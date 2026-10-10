import { describe, expect, it } from 'vitest'

import {
  FIRST_PHRASE,
  lookupPhrase,
  phraseDuration,
  thinkingPhrases,
} from './thinkingPhrases'

const two = ['Kia EV3', 'Tesla Model Y']
const four = ['Kia EV3', 'Tesla Model Y', 'Skoda Elroq', 'Volkswagen ID.4']

// A fixed sequence, so a test reads the same draw every run
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647
  return seed / 2147483647
}

describe('thinkingPhrases', () => {
  it.each([[two], [four]])('names every car compared: %j', (names) => {
    const { phrases } = thinkingPhrases(names, seeded(1))
    for (const name of names) {
      expect(phrases.some((phrase) => phrase.includes(name))).toBe(true)
    }
  })

  it('names the cars only between the opening and the closing lines', () => {
    const { phrases, loopFrom } = thinkingPhrases(four, seeded(2))
    const naming = phrases.map((phrase) =>
      four.some((name) => phrase.includes(name)),
    )
    expect(naming.slice(0, 2)).toEqual([false, false])
    expect(naming.slice(2, loopFrom).every(Boolean)).toBe(true)
    expect(naming.slice(loopFrom).some(Boolean)).toBe(false)
  })

  it('says each line once, the first among none of them', () => {
    const { phrases } = thinkingPhrases(four, seeded(3))
    expect(new Set(phrases).size).toBe(phrases.length)
    expect(phrases).not.toContain(FIRST_PHRASE)
  })

  it('reads differently from one wait to the next', () => {
    expect(thinkingPhrases(four, seeded(4)).phrases).not.toEqual(
      thinkingPhrases(four, seeded(5)).phrases,
    )
  })
})

describe('phraseDuration', () => {
  it('holds a line for two to five and a half seconds or so', () => {
    for (const random of [() => 0, () => 0.999]) {
      expect(phraseDuration('Velur réttu orðin…', random)).toBeGreaterThan(1700)
      expect(phraseDuration('x'.repeat(200), random)).toBeLessThanOrEqual(5400)
    }
  })
})

describe('lookupPhrase', () => {
  it('names the car being looked up', () => {
    expect(lookupPhrase('Kia EV3')).toBe(
      'Flettir upp Kia EV3 á ev-database.org…',
    )
  })
})
