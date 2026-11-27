import { afterEach, describe, expect, it, vi } from 'vitest'

const browser =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1'

const loadPost = async () => {
  vi.resetModules()
  vi.stubEnv('AXIOM_TOKEN', '')
  const ingested = vi.fn()
  vi.doMock('../publicEndpoint', async (original) => ({
    ...(await original<typeof import('../publicEndpoint')>()),
    ingestAfterResponse: ingested,
  }))
  const { POST } = await import('./route')
  const post = (
    body: unknown,
    address = '10.3.0.1',
    userAgent: string = browser,
  ) =>
    POST(
      new Request('http://localhost/api/umferd', {
        method: 'POST',
        headers: { 'x-forwarded-for': address, 'user-agent': userAgent },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      }),
    )
  return Object.assign(post, { ingested, POST })
}

const batch = {
  sessionId: '6f1c8a52-3e0b-4d5e-9a57-0f2b6c1d9e44',
  device: 'desktop',
  events: [
    {
      name: 'seller_clicked',
      car: 'kia-ev3',
      page: { kind: 'list', slugs: [] },
      ageMs: 300,
    },
  ],
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.doUnmock('../publicEndpoint')
})

describe('POST /api/umferd', () => {
  it('takes a batch and answers with nothing', async () => {
    const post = await loadPost()
    expect((await post(batch)).status).toBe(204)
    expect(post.ingested).toHaveBeenCalledOnce()
  })

  it('answers a crawler as it would anyone, and keeps nothing of it', async () => {
    const post = await loadPost()
    const googlebot =
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/131.0.6778.204 Safari/537.36'
    expect((await post(batch, '10.3.0.1', googlebot)).status).toBe(204)
    expect((await post('not json', '10.3.0.1', googlebot)).status).toBe(204)
    expect(post.ingested).not.toHaveBeenCalled()
  })

  it('reads a beacon, which is sent as text', async () => {
    const post = await loadPost()
    const response = await post.POST(
      new Request('http://localhost/api/umferd', {
        method: 'POST',
        headers: {
          'x-forwarded-for': '10.3.0.9',
          'content-type': 'text/plain;charset=UTF-8',
          'user-agent': browser,
        },
        body: JSON.stringify(batch),
      }),
    )
    expect(response.status).toBe(204)
    expect(post.ingested).toHaveBeenCalledOnce()
  })

  it('refuses a body that is not a batch', async () => {
    const post = await loadPost()
    for (const body of ['not json', {}, { ...batch, events: [] }]) {
      expect((await post(body)).status).toBe(400)
    }
  })

  it('refuses a caller past sixty a minute', async () => {
    const post = await loadPost()
    const statuses = []
    for (let i = 0; i < 61; i++) statuses.push((await post(batch)).status)
    expect(statuses.slice(0, 60).every((status) => status === 204)).toBe(true)
    expect(statuses[60]).toBe(429)
    expect((await post(batch, '10.3.0.2')).status).toBe(204)
  })
})
