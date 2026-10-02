type Window = { count: number; resetAt: number }

export interface RateLimitResult {
  ok: boolean
  retryAfterSeconds: number
}

/**
 * A limiter with windows of its own, so one public endpoint spending its
 * allowance does not spend another's. In memory, so a caller spread across
 * warm instances gets a multiple of this.
 */
export const createRateLimit = (maxRequests: number, windowMs = 60_000) => {
  const windows = new Map<string, Window>()

  // Without this the map grows one entry per address for the life of the instance
  const sweep = (now: number) => {
    for (const [key, window] of windows) {
      if (window.resetAt <= now) windows.delete(key)
    }
  }

  return (key: string): RateLimitResult => {
    const now = Date.now()
    if (windows.size > 10_000) sweep(now)

    const existing = windows.get(key)

    if (!existing || existing.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs })
      return { ok: true, retryAfterSeconds: 0 }
    }

    existing.count += 1

    return {
      ok: existing.count <= maxRequests,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    }
  }
}

export const rateLimit = createRateLimit(12)

// x-forwarded-for is spoofable, so this buys politeness, not identity
export const clientKey = (request: Request): string =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip') ||
  'unknown'
