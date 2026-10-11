import { MAX_COMPARED, MIN_COMPARED } from '@/modules/detail/comparison'
import { resolveSlugs } from '@/modules/detail/slugs'
import { encodeEvent, type VerdictEvent } from '@/modules/detail/verdictEvents'
import { clientKey, verdictRateLimit } from '@/modules/rateLimit'
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
 * A comparison's summary as it is written, for its page to show the model at
 * work: one VerdictEvent a line, ending with the
 * verdict. One already written is sent at once, and costs nothing.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slugs: string[] }> },
) {
  const segments = (await params).slugs.map(decodeURIComponent)
  const { cars, slugs, goneCount } = resolveSlugs(segments, MAX_COMPARED)
  // Only the page asks, and it asks for the cars it compares, as they are
  // named. A car's own review is written ahead, and is not bought here.
  if (
    cars.length < MIN_COMPARED ||
    goneCount > 0 ||
    slugs.join('/') !== segments.join('/')
  ) {
    return Response.json({ error: 'No such cars' }, { status: 404 })
  }

  const written = await peekVerdict(cars)
  if (written) {
    return new Response(encodeEvent({ type: 'verdict', verdict: written }), {
      headers,
    })
  }

  // Counted only here, where a verdict is about to be bought
  const limit = verdictRateLimit(clientKey(request))
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
