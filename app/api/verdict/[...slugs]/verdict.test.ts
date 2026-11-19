import { afterEach, describe, expect, it, vi } from 'vitest'

import { advisorModel } from '@/modules/chat/model'
import cars, { type Car } from '@/modules/data/cars'

const [a, b] = cars.filter((car) => !car.evDatabaseUrl) as [Car, Car]
const words = Array.from({ length: 60 }, () => 'orð').join(' ')

// Each answer the model gives, in turn, as the finish it ends with
const answering = (finishes: string[]) => {
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
  vi.doMock('@ai-sdk/google', () => ({ google: () => 'gemini' }))
  vi.doMock('ai', () => ({
    streamText: (call: unknown) => {
      const finish = finishes[calls.length] ?? 'stop'
      calls.push(call)
      return {
        stream: (async function* () {
          yield { type: 'text-start' }
        })(),
        finishReason: Promise.resolve(finish),
        rawFinishReason: Promise.resolve(finish.toUpperCase()),
        totalUsage: Promise.resolve({ outputTokens: 10 }),
        text: Promise.resolve(words),
      }
    },
  }))
  return { calls, logged }
}

const finished = async () => {
  const { writeVerdict } = await import('./verdict')
  const job = writeVerdict([a, b])
  await vi.waitFor(() =>
    expect(['verdict', 'error']).toContain(job.events.at(-1)?.type),
  )
  return job.events.at(-1)?.type
}

afterEach(() => {
  for (const mocked of [
    'next/cache',
    'next/server',
    '@/app/api/publicEndpoint',
    '@ai-sdk/anthropic',
    '@ai-sdk/google',
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
    answering(['stop'])
    const kept = keyedOnSource()
    expect(await finished()).toBe('verdict')
    const { peekVerdict } = await import('./verdict')
    expect(await peekVerdict([b, a])).toMatchObject({
      paragraphs: expect.any(Array),
    })
    for (const key of kept.keys()) expect(key).not.toMatch(/=>|throw/)
  })
})

describe('writeVerdict', () => {
  it('asks once when the first answer is kept', async () => {
    const { calls } = answering(['stop'])
    expect(await finished()).toBe('verdict')
    expect(calls).toHaveLength(1)
  })

  it('asks Claude, with its fallbacks, when the first answer is kept', async () => {
    const { calls, logged } = answering(['stop'])
    expect(await finished()).toBe('verdict')
    expect(calls[0]).toMatchObject({
      model: 'claude',
      providerOptions: { anthropic: { fallbacks: 'default' } },
    })
    await vi.waitFor(() => expect(logged).toHaveLength(1))
    expect(logged[0]).toMatchObject({ model: 'claude-fable-5-2' })
  })

  // Claude's own fallbacks have declined by then, and asking it again would
  // pay for the same refusal
  it('asks Gemini once when the first answer is filtered', async () => {
    const { calls, logged } = answering(['content-filter', 'stop'])
    expect(await finished()).toBe('verdict')
    expect(calls).toHaveLength(2)
    expect(calls[1]).toMatchObject({ model: 'gemini' })
    await vi.waitFor(() => expect(logged).toHaveLength(1))
    expect(logged[0]).toMatchObject({ model: advisorModel })
  })

  // Every call is paid for, and a set that is filtered twice will be again
  it('gives up after a second filtered answer', async () => {
    const { calls, logged } = answering(['content-filter', 'content-filter'])
    expect(await finished()).toBe('error')
    expect(calls).toHaveLength(2)
    await vi.waitFor(() => expect(logged).toHaveLength(1))
    expect(logged[0]).toMatchObject({
      error: expect.stringContaining('CONTENT-FILTER'),
      blocked: { reason: 'CONTENT-FILTER' },
    })
  })

  it('does not ask again for an answer cut off for another reason', async () => {
    const { calls } = answering(['length'])
    expect(await finished()).toBe('error')
    expect(calls).toHaveLength(1)
  })
})
