import { MIN_COMPARED, resolveComparison } from '@/modules/compare/comparison'
import { encodeEvent, type VerdictEvent } from '@/modules/compare/verdictEvents'
import { clientKey, comparisonVerdictRateLimit } from '@/modules/rateLimit'
import { rateLimitedText } from '@/modules/chat/progress'
import { peekVerdict, writeVerdict } from './verdict'

// The model thinks, looks each car up and then writes, which takes a while
export const maxDuration = 120

const headers = {
  'Content-Type': 'application/x-ndjson; charset=utf-8',
  'Cache-Control': 'no-store',
}

const finished = (event: VerdictEvent) =>
  event.type === 'verdict' || event.type === 'error'

/**
 * The comparison's verdict as it is written, for the page to show the model
 * at work: one VerdictEvent a line, ending with the verdict. One already
 * written is sent at once, and costs nothing.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slugs: string[] }> },
) {
  const segments = (await params).slugs.map(decodeURIComponent)
  const { cars, slugs, goneCount } = resolveComparison(segments)
  // Only the page asks, and it asks for the cars it shows, as they are named
  if (
    cars.length < MIN_COMPARED ||
    goneCount > 0 ||
    slugs.join('/') !== segments.join('/')
  ) {
    return Response.json({ error: 'Not a comparison' }, { status: 404 })
  }

  const written = await peekVerdict(cars)
  if (written) {
    return new Response(encodeEvent({ type: 'verdict', verdict: written }), {
      headers,
    })
  }

  // Counted only here, where a verdict is about to be bought
  const limit = comparisonVerdictRateLimit(clientKey(request))
  if (!limit.ok) {
    return Response.json(
      { error: rateLimitedText },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    )
  }

  const job = writeVerdict(cars)
  const encoder = new TextEncoder()
  let send: ((event: VerdictEvent) => void) | undefined

  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      let open = true
      send = (event) => {
        if (!open) return
        controller.enqueue(encoder.encode(encodeEvent(event)))
        if (finished(event)) {
          open = false
          job.listeners.delete(send!)
          controller.close()
        }
      }
      // Whatever was said before this visitor arrived, then the rest live
      for (const event of job.events) send(event)
      if (open) job.listeners.add(send)
    },
    // The visitor left; the answer is still written and kept
    cancel() {
      if (send) job.listeners.delete(send)
    },
  })

  return new Response(body, { headers })
}
