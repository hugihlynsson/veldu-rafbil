import { afterEach, describe, expect, it, vi } from 'vitest'

const loadPost = async () => {
  vi.resetModules()
  vi.stubEnv('AXIOM_TOKEN', '')
  const { POST } = await import('./route')
  return (body: unknown, address = '10.3.0.1') =>
    POST(
      new Request('http://localhost/api/umferd', {
        method: 'POST',
        headers: { 'x-forwarded-for': address },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      }),
    )
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
})

describe('POST /api/umferd', () => {
  it('takes a batch and answers with nothing', async () => {
    const post = await loadPost()
    expect((await post(batch)).status).toBe(204)
  })

  it('reads a beacon, which is sent as text', async () => {
    const { POST } = await import('./route')
    const response = await POST(
      new Request('http://localhost/api/umferd', {
        method: 'POST',
        headers: {
          'x-forwarded-for': '10.3.0.9',
          'content-type': 'text/plain;charset=UTF-8',
        },
        body: JSON.stringify(batch),
      }),
    )
    expect(response.status).toBe(204)
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
