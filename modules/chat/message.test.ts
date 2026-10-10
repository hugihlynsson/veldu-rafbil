import { describe, expect, it } from 'vitest'

import {
  comparisonsStarted,
  getFollowUps,
  getMessageText,
  groupIntoTurns,
  MAX_TAGGED_CARS,
  parseStoredMessages,
  upgradeStoredMessage,
  validateChatMessages,
  type ChatMessage,
} from './message'

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

// The route and the stored history read metadata through this one validator
describe('validateChatMessages', () => {
  const withMetadata = (metadata: unknown) => [
    { ...message([{ type: 'text', text: 'Svarið.' }]), metadata },
  ]

  it.each<[string, unknown]>([
    ['follow-ups alone', { followUps: ['Er hann dýr?'] }],
    ['cars alone', { cars: ['car-kia-ev3-long-range'] }],
    ['both', { followUps: ['Er hann dýr?'], cars: ['car-byd-seal-base'] }],
  ])('takes an answer with %s', async (_label, metadata) => {
    expect(await validateChatMessages(withMetadata(metadata))).toEqual(
      withMetadata(metadata),
    )
  })

  it.each<[string, unknown]>([
    ['cars that are not a list', { cars: 'car-byd-seal-base' }],
    ['an empty list of cars', { cars: [] }],
    ['an empty car id', { cars: [''] }],
    ['a car id longer than any', { cars: ['a'.repeat(101)] }],
    [
      'more cars than an answer tags',
      { cars: Array.from({ length: MAX_TAGGED_CARS + 1 }, (_, i) => `c${i}`) },
    ],
  ])('refuses %s', async (_label, metadata) => {
    expect(await validateChatMessages(withMetadata(metadata))).toBeNull()
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
      metadata: { followUps: ['Er hann dýr?'], cars: ['car-byd-seal-base'] },
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
      metadata: {
        followUps: ['Hvað fer hann langt?'],
        cars: ['car-byd-seal-base'],
      },
    }
    const stored = JSON.stringify([question, answer])

    expect(await parseStoredMessages(stored)).toEqual([question, answer])
  })

  // Its cars are left to the fallback on the names in its text
  it('reads a history from before the cars were tagged', async () => {
    const answer: ChatMessage = {
      ...message([{ type: 'text', text: 'Nei.' }]),
      metadata: { followUps: ['Hvað fer hann langt?'] },
    }
    const stored = JSON.stringify([question, answer])

    expect(await parseStoredMessages(stored)).toEqual([question, answer])
  })

  // What every history written before the metadata looks like
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

describe('groupIntoTurns', () => {
  const at = (id: string, role: ChatMessage['role']): ChatMessage => ({
    id,
    role,
    parts: [{ type: 'text', text: id }],
  })

  it('starts a turn at every question', () => {
    const turns = groupIntoTurns([
      at('q1', 'user'),
      at('a1', 'assistant'),
      at('q2', 'user'),
      at('a2', 'assistant'),
      at('a2b', 'assistant'),
    ])
    expect(turns.map((turn) => turn.map((m) => m.id))).toEqual([
      ['q1', 'a1'],
      ['q2', 'a2', 'a2b'],
    ])
  })

  it('keeps what comes before the first question as its own turn', () => {
    const turns = groupIntoTurns([at('a0', 'assistant'), at('q1', 'user')])
    expect(turns.map((turn) => turn.map((m) => m.id))).toEqual([['a0'], ['q1']])
  })

  it('has no turns without messages', () => {
    expect(groupIntoTurns([])).toEqual([])
  })
})

describe('comparisonsStarted', () => {
  const question = (id: string, comparing?: string[]): ChatMessage => ({
    id,
    role: 'user',
    parts: [{ type: 'text', text: id }],
    ...(comparing && { metadata: { comparing } }),
  })
  const reply = (id: string): ChatMessage => ({
    id,
    role: 'assistant',
    parts: [{ type: 'text', text: id }],
  })

  it('marks the first question asked on a comparison', () => {
    expect(
      comparisonsStarted([
        question('list'),
        reply('a'),
        question('first', ['kia', 'tesla']),
        reply('b'),
        question('again', ['kia', 'tesla']),
      ]),
    ).toEqual(new Map([['first', ['kia', 'tesla']]]))
  })

  it('marks it again once the cars change', () => {
    expect([
      ...comparisonsStarted([
        question('first', ['kia', 'tesla']),
        question('more', ['kia', 'tesla', 'skoda']),
      ]).keys(),
    ]).toEqual(['first', 'more'])
  })

  it('marks a comparison come back to after a question on the list', () => {
    expect([
      ...comparisonsStarted([
        question('first', ['kia', 'tesla']),
        question('list'),
        question('back', ['kia', 'tesla']),
      ]).keys(),
    ]).toEqual(['first', 'back'])
  })

  it('takes no more cars than a comparison holds', async () => {
    expect(
      await validateChatMessages([question('q', ['a', 'b', 'c', 'd', 'e'])]),
    ).toBeNull()
  })
})
