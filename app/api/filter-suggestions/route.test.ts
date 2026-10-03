import { afterEach, describe, expect, it, vi } from 'vitest'

import { MAX_INTENT_LENGTH } from '@/modules/list/filterIntent'

// The client is built as the route loads, so each test loads it afresh with
// the key it means: a key in the shell running the tests must not be spent
const loadPost = async (key: string) => {
  vi.resetModules()
  vi.stubEnv('TYPESAFE_API_KEY', key)
  const { POST } = await import('./route')
  return (body: unknown, address = '10.1.0.1') =>
    POST(
      new Request('http://localhost/api/filter-suggestions', {
        method: 'POST',
        headers: { 'x-forwarded-for': address },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      }),
    )
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('POST /api/filter-suggestions', () => {
  it('answers from the text alone without a key', async () => {
    const post = await loadPost('')
    const response = await post({ text: 'ódýr með 7 sætum' })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      suggestions: [{ key: 'seats', value: 7, source: 'text', probability: 1 }],
      model: 'unavailable',
    })
  })

  it('refuses a body that is not one short text', async () => {
    const post = await loadPost('')
    const tooLong = 'a'.repeat(MAX_INTENT_LENGTH + 1)
    for (const body of [
      'not json',
      {},
      { text: '' },
      { text: '   ' },
      { text: tooLong },
      { text: 7 },
      { text: 'ódýr', questions: {} },
    ]) {
      expect((await post(body)).status).toBe(400)
    }
  })

  it('refuses a caller past sixty a minute', async () => {
    const post = await loadPost('')
    const statuses = []
    for (let i = 0; i < 61; i++) {
      statuses.push((await post({ text: 'rafbíll' })).status)
    }
    expect(statuses.slice(0, 60).every((status) => status === 200)).toBe(true)
    expect(statuses[60]).toBe(429)
    expect((await post({ text: 'rafbíll' }, '10.1.0.2')).status).toBe(200)
  })
})

describe('POST /api/filter-suggestions with a key', () => {
  it('asks Jev about what the text left open, and adds what it is sure of', async () => {
    const fetch = vi.fn(async (_url: string, init?: RequestInit) => {
      const { questions } = JSON.parse(String(init?.body))
      const answers = Object.fromEntries(
        Object.keys(questions).map((key) => [
          key,
          {
            type: 'choice',
            choice: key === 'drive' ? 'all_wheel_drive' : 'none',
            confidence: 0.9,
            probabilities:
              key === 'drive'
                ? { none: 0.1, all_wheel_drive: 0.9 }
                : { none: 1 },
          },
        ]),
      )
      return Response.json({
        model: 'jev-test',
        answers,
        usage: { input_tokens: 500, output_tokens: 0 },
      })
    })
    vi.stubGlobal('fetch', fetch)
    const post = await loadPost('test-key')

    const response = await post({ text: '7 sæta fyrir veturinn' })
    const [url, init] = fetch.mock.calls[0]
    const sent = JSON.parse(String(init?.body))

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(url).toBe('https://api.typesafe.ai/v1/systemone')
    expect(sent.state).toEqual({ request: '7 sæta fyrir veturinn' })
    expect(Object.keys(sent.questions)).not.toContain('seats')
    expect(await response.json()).toEqual({
      suggestions: [
        { key: 'seats', value: 7, source: 'text', probability: 1 },
        { key: 'drive', value: ['AWD'], source: 'model', probability: 0.9 },
      ],
      model: 'answered',
    })
  })

  it('answers from the text, asking once, when Jev fails', async () => {
    const fetch = vi.fn(async () => new Response('down', { status: 503 }))
    vi.stubGlobal('fetch', fetch)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const post = await loadPost('test-key')

    const response = await post({ text: '7 sæta fyrir veturinn' })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(await response.json()).toEqual({
      suggestions: [{ key: 'seats', value: 7, source: 'text', probability: 1 }],
      model: 'failed',
    })
  })

  it('does not ask when the text says it all', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const post = await loadPost('test-key')

    await post({ text: '7 sæta undir 9 milljónum' })

    expect(fetch).not.toHaveBeenCalled()
  })
})
