import { afterEach, describe, expect, it, vi } from 'vitest'

import { suggestionOutcome } from '@/modules/list/suggestionOutcome'

const loadPost = async () => {
  vi.resetModules()
  vi.stubEnv('AXIOM_TOKEN', '')
  const { POST } = await import('./route')
  return (body: unknown, address = '10.2.0.1') =>
    POST(
      new Request('http://localhost/api/filter-suggestions/outcomes', {
        method: 'POST',
        headers: { 'x-forwarded-for': address },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      }),
    )
}

const outcome = suggestionOutcome(
  'sent',
  {
    text: 'ódýr',
    requestId: undefined,
    suggestions: [
      { key: 'seats', value: 7, source: 'text', probability: 1, count: 26 },
    ],
    shownAt: 0,
  },
  900,
)

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('POST /api/filter-suggestions/outcomes', () => {
  it('takes an outcome and answers with nothing', async () => {
    const post = await loadPost()
    const response = await post(outcome)
    expect(response.status).toBe(204)
  })

  it('refuses a body that is not an outcome', async () => {
    const post = await loadPost()
    for (const body of ['not json', {}, { ...outcome, action: 'liked' }]) {
      expect((await post(body)).status).toBe(400)
    }
  })

  it('refuses a caller past thirty a minute', async () => {
    const post = await loadPost()
    const statuses = []
    for (let i = 0; i < 31; i++) statuses.push((await post(outcome)).status)
    expect(statuses.slice(0, 30).every((status) => status === 204)).toBe(true)
    expect(statuses[30]).toBe(429)
    expect((await post(outcome, '10.2.0.2')).status).toBe(204)
  })
})
