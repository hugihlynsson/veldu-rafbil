// A fixed window per client, held in memory.
//
// This is deliberately modest: serverless means one of these per warm instance,
// so a determined caller spread across instances gets a multiple of the limit.
// It is not a defence against a botnet — it is the difference between a stray
// script costing a few krónur and costing a few thousand, which is the failure
// this site actually has to survive. Anything stronger needs shared state
// (Vercel KV, Upstash) and a running cost of its own.

const WINDOW_MS = 60_000
const MAX_REQUESTS = 12

type Window = { count: number; resetAt: number }

const windows = new Map<string, Window>()

// Without this the map grows one entry per address for the life of the instance
const sweep = (now: number) => {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key)
  }
}

export interface RateLimitResult {
  ok: boolean
  retryAfterSeconds: number
}

export const rateLimit = (key: string): RateLimitResult => {
  const now = Date.now()
  if (windows.size > 10_000) sweep(now)

  const existing = windows.get(key)

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, retryAfterSeconds: 0 }
  }

  existing.count += 1

  return {
    ok: existing.count <= MAX_REQUESTS,
    retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
  }
}

// Vercel sets x-forwarded-for; the left-most entry is the client. Everything
// here is spoofable, so this buys ordinary politeness, not identity.
export const clientKey = (request: Request): string =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip') ||
  'unknown'
