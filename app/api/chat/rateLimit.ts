// In memory, so a caller spread across warm instances gets a multiple of this
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

// x-forwarded-for is spoofable, so this buys politeness, not identity
export const clientKey = (request: Request): string =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip') ||
  'unknown'
