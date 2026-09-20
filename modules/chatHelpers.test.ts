import { describe, expect, it } from 'vitest'

import { UIMessage } from 'ai'

import {
  findMentionedCars,
  getMessageText,
  getRandomSuggestions,
  parseFollowUps,
  stripFollowUps,
} from './chatHelpers'
import newCars from './newCars'

const message = (parts: UIMessage['parts']): UIMessage => ({
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

describe('parseFollowUps', () => {
  it('pulls the questions out of the markers', () => {
    expect(
      parseFollowUps('Svarið.\n[q:Hvað fer hann langt?]\n[q:Er hann dýr?]'),
    ).toEqual(['Hvað fer hann langt?', 'Er hann dýr?'])
  })

  it('trims what it finds', () => {
    expect(parseFollowUps('[q:   Hvað fer hann langt?   ]')).toEqual([
      'Hvað fer hann langt?',
    ])
  })

  it('finds nothing in an answer without markers', () => {
    expect(parseFollowUps('Bara venjulegt svar.')).toEqual([])
  })

  // A half-written marker is what the stream looks like mid-token
  it('ignores a marker that has not been closed yet', () => {
    expect(parseFollowUps('Svarið. [q:Hvað fer hann')).toEqual([])
  })
})

describe('stripFollowUps', () => {
  it('removes finished markers and keeps the answer', () => {
    expect(
      stripFollowUps('Svarið.\n[q:Hvað fer hann langt?]\n[q:Er hann dýr?]'),
    ).toBe('Svarið.')
  })

  // Keeps a half-written marker from flashing up mid-stream
  it('removes a marker that is still being written', () => {
    expect(stripFollowUps('Svarið. [q:Hvað fer hann')).toBe('Svarið.')
    expect(stripFollowUps('Svarið. [q:')).toBe('Svarið.')
    expect(stripFollowUps('Svarið. [')).toBe('Svarið. [')
  })

  it('removes a partial marker that runs over a newline', () => {
    expect(stripFollowUps('Svarið.\n[q:Hvað fer\nhann')).toBe('Svarið.')
  })

  it('leaves an answer without markers alone', () => {
    expect(stripFollowUps('Bara venjulegt svar.')).toBe('Bara venjulegt svar.')
  })

  it('leaves square brackets that are not markers alone', () => {
    expect(stripFollowUps('Sjá [hlekk](http://x) hér')).toBe(
      'Sjá [hlekk](http://x) hér',
    )
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
