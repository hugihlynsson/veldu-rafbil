import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { clientKey, rateLimit } from './rateLimit'

// The windows outlive each test, so every test asks for addresses of its own
describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  const ask = (key: string, times: number) =>
    Array.from({ length: times }, () => rateLimit(key))

  it('lets twelve requests a minute through', () => {
    expect(ask('10.0.0.1', 12).every((result) => result.ok)).toBe(true)
  })

  it('refuses the thirteenth, saying when to come back', () => {
    ask('10.0.0.2', 12)
    vi.advanceTimersByTime(20_000)

    expect(rateLimit('10.0.0.2')).toEqual({ ok: false, retryAfterSeconds: 40 })
  })

  it('lets a caller back in once the minute is up', () => {
    ask('10.0.0.3', 13)
    vi.advanceTimersByTime(60_000)

    expect(rateLimit('10.0.0.3').ok).toBe(true)
  })

  it('counts each caller on their own', () => {
    ask('10.0.0.4', 13)

    expect(rateLimit('10.0.0.5').ok).toBe(true)
  })

  it('still counts a caller once the map is swept', () => {
    ask('10.0.0.6', 12)
    for (let i = 0; i < 10_001; i++) rateLimit(`sweep-${i}`)

    expect(rateLimit('10.0.0.6').ok).toBe(false)
  })
})

describe('clientKey', () => {
  const request = (headers: Record<string, string>) =>
    new Request('http://localhost/api/chat', { headers })

  it('reads the first address a proxy forwarded', () => {
    expect(
      clientKey(request({ 'x-forwarded-for': ' 1.2.3.4 , 10.0.0.1' })),
    ).toBe('1.2.3.4')
  })

  it('falls back to x-real-ip', () => {
    expect(clientKey(request({ 'x-real-ip': '1.2.3.4' }))).toBe('1.2.3.4')
  })

  it('puts every caller without an address in one window', () => {
    expect(clientKey(request({}))).toBe('unknown')
  })
})
