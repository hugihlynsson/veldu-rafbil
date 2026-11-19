import { afterEach, describe, expect, it, vi } from 'vitest'

import cars, { type Car } from '@/modules/data/cars'
import type { VerdictEvent } from '@/modules/detail/verdictEvents'

const [a, b] = cars.filter((car) => !car.evDatabaseUrl) as [Car, Car]
const words = Array.from({ length: 60 }, () => 'orð')

const writing = (text: ReadonlyArray<string>) =>
  text.map((word) => ({ type: 'text-delta', text: `${word} ` }))

interface Answer {
  finish?: string
  parts?: ReadonlyArray<object>
  /** The model the provider says answered */
  modelId?: string
}

// The model's answer, streamed as `parts` and ending with `finish`
const answering = ({
  finish = 'stop',
  parts = writing(words),
  modelId = 'claude-fable-5-2',
}: Answer = {}) => {
  const calls: unknown[] = []
  const logged: object[] = []
  vi.resetModules()
  vi.doMock('next/cache', () => ({
    unstable_cache: (read: () => Promise<unknown>) => read,
  }))
  vi.doMock('next/server', () => ({ after: () => {} }))
  vi.doMock('@/app/api/publicEndpoint', () => ({
    deployment: () => ({}),
    logAfterResponse: async (event: () => Promise<object>) =>
      logged.push(await event()),
  }))
  vi.doMock('@ai-sdk/anthropic', () => ({ anthropic: () => 'claude' }))
  vi.doMock('ai', () => ({
    streamText: (call: unknown) => {
      calls.push(call)
      return {
        stream: (async function* () {
          yield* parts
        })(),
        finishReason: Promise.resolve(finish),
        rawFinishReason: Promise.resolve(finish.toUpperCase()),
        totalUsage: Promise.resolve({ outputTokens: 10 }),
        response: Promise.resolve({ modelId }),
      }
    },
  }))
  return { calls, logged }
}

const finished = async (): Promise<VerdictEvent[]> => {
  const { writeVerdict } = await import('./verdict')
  const job = writeVerdict([a, b])
  await vi.waitFor(() =>
    expect(['verdict', 'error']).toContain(job.events.at(-1)?.type),
  )
  return job.events
}

const last = (events: VerdictEvent[]) => events.at(-1)?.type

afterEach(() => {
  for (const mocked of [
    'next/cache',
    'next/server',
    '@/app/api/publicEndpoint',
    '@ai-sdk/anthropic',
    'ai',
  ])
    vi.doUnmock(mocked)
})

describe('peekVerdict', () => {
  // As Next keys it, so a key that carries the callback's source would differ
  // between the page's bundle and the route's
  const keyedOnSource = () => {
    const kept = new Map<string, unknown>()
    vi.doMock('next/cache', () => ({
      unstable_cache:
        (read: () => Promise<unknown>, parts: string[]) => async () => {
          const key = `${read.toString()}-${parts.join(',')}`
          if (!kept.has(key)) kept.set(key, await read())
          return kept.get(key)
        },
    }))
    return kept
  }

  it('reads the verdict the route kept, under a key no compiler changes', async () => {
    answering()
    const kept = keyedOnSource()
    expect(last(await finished())).toBe('verdict')
    const { peekVerdict } = await import('./verdict')
    expect(await peekVerdict([b, a])).toMatchObject({
      paragraphs: expect.any(Array),
    })
    for (const key of kept.keys()) expect(key).not.toMatch(/=>|throw/)
  })
})

describe('writeVerdict', () => {
  it('asks Claude once, with its fallbacks', async () => {
    const { calls, logged } = answering()
    expect(last(await finished())).toBe('verdict')
    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatchObject({
      model: 'claude',
      providerOptions: { anthropic: { fallbacks: 'default' } },
    })
    await vi.waitFor(() => expect(logged).toHaveLength(1))
    expect(logged[0]).toMatchObject({ model: 'claude-fable-5-2' })
  })

  // The page shows the words as they come and then swaps in the verdict, so
  // the two have to read the same
  it('sends the words as they are written, then the verdict they make', async () => {
    answering()
    const events = await finished()
    const sent = events.flatMap((event) =>
      event.type === 'text' ? [event.text] : [],
    )
    expect(sent).toHaveLength(words.length)
    expect(events.at(-1)).toEqual({
      type: 'verdict',
      verdict: { paragraphs: [sent.join('').trim()] },
    })
  })

  it('keeps only what the model that took over wrote', async () => {
    const { logged } = answering({
      parts: [
        ...writing(['Hálfskrifað']),
        { type: 'custom', kind: 'anthropic.fallback' },
        ...writing(words),
      ],
      modelId: 'claude-opus-5-5',
    })
    const events = await finished()
    const restart = events.findIndex((event) => event.type === 'restart')
    expect(restart).toBe(1)
    expect(events.at(-1)).toMatchObject({
      verdict: { paragraphs: [words.join(' ')] },
    })
    await vi.waitFor(() => expect(logged).toHaveLength(1))
    expect(logged[0]).toMatchObject({ model: 'claude-opus-5-5' })
  })

  // Every model the fallbacks name has refused by then, and each call is paid
  it('gives up on an answer every model refused', async () => {
    const { calls, logged } = answering({ finish: 'content-filter' })
    expect(last(await finished())).toBe('error')
    expect(calls).toHaveLength(1)
    await vi.waitFor(() => expect(logged).toHaveLength(1))
    expect(logged[0]).toMatchObject({
      error: expect.stringContaining('CONTENT-FILTER'),
    })
  })

  it('does not ask again for an answer cut off for another reason', async () => {
    const { calls } = answering({ finish: 'length' })
    expect(last(await finished())).toBe('error')
    expect(calls).toHaveLength(1)
  })

  it('keeps no verdict far shorter than the one asked for', async () => {
    answering({ parts: writing(words.slice(0, 10)) })
    expect(last(await finished())).toBe('error')
  })
})
