import { describe, expect, it } from 'vitest'

import {
  findMentionedCars,
  getMessageText,
  getFollowUps,
  getRandomSuggestions,
  parseStoredMessages,
  upgradeStoredMessage,
  type ChatMessage,
} from './chatHelpers'
import newCars from './newCars'

const message = (parts: ChatMessage['parts']): ChatMessage => ({
  id: 'a-message',
  role: 'assistant',
  parts,
})

describe('getMessageText', () => {
  it('joins the text parts and leaves the rest out', () => {
    expect(
      getMessageText(
        message([
          { type: 'text', text: 'Fyrri hluti' },
          { type: 'step-start' },
          { type: 'text', text: 'seinni hluti' },
        ]),
      ),
    ).toBe('Fyrri hluti seinni hluti')
  })

  // The chat reads this before the first token, and on a tool call with no text
  it('reads a message with nothing to say as empty', () => {
    expect(getMessageText(message([]))).toBe('')
    expect(getMessageText(message([{ type: 'step-start' }]))).toBe('')
    expect(getMessageText(undefined)).toBe('')
  })
})

describe('getFollowUps', () => {
  it('reads the questions off an answer', () => {
    expect(
      getFollowUps({
        ...message([{ type: 'text', text: 'Svarið.' }]),
        metadata: { followUps: ['Hvað fer hann langt?'] },
      }),
    ).toEqual(['Hvað fer hann langt?'])
  })

  it('finds none on an answer without them, or on a question', () => {
    expect(getFollowUps(message([{ type: 'text', text: 'Svarið.' }]))).toEqual(
      [],
    )
    expect(
      getFollowUps({
        ...message([]),
        role: 'user',
        metadata: { followUps: ['x'] },
      }),
    ).toEqual([])
    expect(getFollowUps(undefined)).toEqual([])
  })
})

// The history in localStorage predates the metadata, and outlives the deploy
describe('upgradeStoredMessage', () => {
  it('moves the markers of a stored answer into its metadata', () => {
    const stored = message([
      { type: 'step-start' },
      {
        type: 'text',
        text: 'Svarið.\n[q:Hvað fer hann langt?]\n[q:Er hann dýr?]',
      },
    ])

    expect(upgradeStoredMessage(stored)).toEqual({
      ...stored,
      parts: [{ type: 'step-start' }, { type: 'text', text: 'Svarið.' }],
      metadata: { followUps: ['Hvað fer hann langt?', 'Er hann dýr?'] },
    })
  })

  it('leaves an answer that is already upgraded, or needs none, alone', () => {
    const upgraded: ChatMessage = {
      ...message([{ type: 'text', text: 'Svarið.' }]),
      metadata: { followUps: ['Er hann dýr?'] },
    }
    const plain = message([{ type: 'text', text: 'Svarið.' }])

    expect(upgradeStoredMessage(upgraded)).toBe(upgraded)
    expect(upgradeStoredMessage(plain)).toEqual(plain)
  })

  // Someone asking about the format is not the model offering follow-ups
  it('leaves what a user typed alone', () => {
    const typed: ChatMessage = {
      ...message([{ type: 'text', text: 'Hvað þýðir [q:x]?' }]),
      role: 'user',
    }
    expect(upgradeStoredMessage(typed)).toBe(typed)
  })
})

describe('parseStoredMessages', () => {
  const question: ChatMessage = {
    id: 'q',
    role: 'user',
    parts: [{ type: 'text', text: 'Er hann dýr?' }],
  }

  it('reads back what was stored', async () => {
    const answer: ChatMessage = {
      ...message([{ type: 'text', text: 'Nei.' }]),
      metadata: { followUps: ['Hvað fer hann langt?'] },
    }
    const stored = JSON.stringify([question, answer])

    expect(await parseStoredMessages(stored)).toEqual([question, answer])
  })

  // What every history written before this change looks like
  it('reads and upgrades a history from before the metadata', async () => {
    const stored = JSON.stringify([
      question,
      message([{ type: 'text', text: 'Nei.\n[q:Hvað fer hann langt?]' }]),
    ])

    expect(await parseStoredMessages(stored)).toEqual([
      question,
      {
        ...message([{ type: 'text', text: 'Nei.' }]),
        metadata: { followUps: ['Hvað fer hann langt?'] },
      },
    ])
  })

  it.each([
    ['not JSON', '{'],
    ['not a list', '{"id":"q"}'],
    ['a message without parts', '[{"id":"q","role":"user"}]'],
  ])('reads %s as no history', async (_label, stored) => {
    expect(await parseStoredMessages(stored)).toEqual([])
  })
})

describe('findMentionedCars', () => {
  const first = newCars[0]

  it('finds a car named in the text', () => {
    const found = findMentionedCars(
      `Ég myndi skoða ${first.make} ${first.model} fyrir þig.`,
    )
    expect(found.map((car) => `${car.make} ${car.model}`)).toContain(
      `${first.make} ${first.model}`,
    )
  })

  it('does not care about case', () => {
    expect(
      findMentionedCars(`${first.make} ${first.model}`.toUpperCase()).length,
    ).toBeGreaterThan(0)
  })

  it('finds nothing in text that names no car', () => {
    expect(findMentionedCars('Hvar er best að hlaða?')).toEqual([])
  })

  it('never returns the same car twice', () => {
    const found = findMentionedCars(
      `${first.make} ${first.model}. Aftur: ${first.make} ${first.model}.`,
    )
    const keys = found.map(
      (car) => `${car.make}|${car.model}|${car.subModel ?? ''}`,
    )
    expect(keys).toHaveLength(new Set(keys).size)
  })
})

describe('getRandomSuggestions', () => {
  const pool = ['a', 'b', 'c', 'd', 'e']

  it('returns the number asked for', () => {
    expect(getRandomSuggestions(pool, 3)).toHaveLength(3)
  })

  it('never repeats one', () => {
    for (let run = 0; run < 50; run++) {
      const picked = getRandomSuggestions(pool, 3)
      expect(new Set(picked).size).toBe(3)
    }
  })

  it('leaves the pool it was given alone', () => {
    const original = [...pool]
    getRandomSuggestions(pool, 3)
    expect(pool).toEqual(original)
  })

  it('cannot return more than the pool holds', () => {
    expect(getRandomSuggestions(pool, 99)).toHaveLength(pool.length)
  })
})
