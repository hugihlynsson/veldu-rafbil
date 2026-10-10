import { Axiom } from '@axiomhq/js'
import { after } from 'next/server'

import { rateLimitedText } from '@/modules/chat/progress'
import { clientKey, type RateLimit } from '@/modules/rateLimit'

/**
 * The checks every public endpoint that spends money makes before any work:
 * the caller's allowance, then a body that is JSON at all. The body, or the
 * response that refuses the request.
 */
export const readGuardedBody = async (
  request: Request,
  rateLimit: RateLimit,
): Promise<{ body: unknown } | Response> => {
  const limit = rateLimit(clientKey(request))
  if (!limit.ok) {
    return Response.json(
      { error: rateLimitedText },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    )
  }

  try {
    return { body: await request.json() }
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export const invalidBody = () =>
  Response.json({ error: 'Invalid request body' }, { status: 400 })

/**
 * Which deploy answered, so a wrong figure can be traced to the car data and
 * prompt it was given. Not NODE_ENV, which is production on a preview too.
 */
export interface Deployment {
  environment: string
  commit: string | undefined
}

export const deployment = (): Deployment => ({
  environment: process.env.VERCEL_ENV ?? 'development',
  commit: process.env.VERCEL_GIT_COMMIT_SHA,
})

// Left unbuilt without a token, so a local or preview run stays quiet
const axiom = process.env.AXIOM_TOKEN
  ? new Axiom({ token: process.env.AXIOM_TOKEN })
  : undefined

/**
 * Logs once the response has gone, so the Axiom round trip never holds it
 * open. The event is built then, so it can say how the response ended, and
 * can wait on work that outlives the response.
 */
export const logAfterResponse = (
  event: () => object | Promise<object>,
): void => {
  if (!axiom) return
  after(async () => {
    try {
      axiom.ingest('veldu-rafbil-assistant', [await event()])
      await axiom.flush()
    } catch (error) {
      console.error('Failed to log to Axiom:', error)
    }
  })
}
