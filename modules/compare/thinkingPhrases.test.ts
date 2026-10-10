import { describe, expect, it } from 'vitest'

import { phraseDuration, thinkingPhrases } from './thinkingPhrases'

const two = ['Kia EV3', 'Tesla Model Y']
const four = ['Kia EV3', 'Tesla Model Y', 'Skoda Elroq', 'Volkswagen ID.4']

describe('thinkingPhrases', () => {
  it.each([[two], [four]])('names every car compared: %j', (names) => {
    const { phrases } = thinkingPhrases(names)
    for (const name of names) {
      expect(phrases.some((phrase) => phrase.includes(name))).toBe(true)
    }
  })

  it('names the cars only between the opening and the closing lines', () => {
    const { phrases, loopFrom } = thinkingPhrases(four)
    const naming = phrases.map((phrase) =>
      four.some((name) => phrase.includes(name)),
    )
    expect(naming.slice(0, 2)).toEqual([false, false])
    expect(naming.slice(2, loopFrom).every(Boolean)).toBe(true)
    expect(naming.slice(loopFrom).some(Boolean)).toBe(false)
  })

  it('says each line once', () => {
    const { phrases } = thinkingPhrases(two)
    expect(new Set(phrases).size).toBe(phrases.length)
  })

  // The server renders the first line, and the browser has to agree on it
  it('gives a comparison the same lines every time', () => {
    expect(thinkingPhrases(four)).toEqual(thinkingPhrases(four))
  })

  it('loops back to the closing lines, not the start', () => {
    const { phrases, loopFrom } = thinkingPhrases(two)
    expect(loopFrom).toBeGreaterThan(2)
    expect(loopFrom).toBeLessThan(phrases.length)
  })
})

describe('phraseDuration', () => {
  it('holds a line between two and a half and five seconds or so', () => {
    expect(phraseDuration('Velur réttu orðin…')).toBeGreaterThanOrEqual(2200)
    expect(phraseDuration('x'.repeat(200))).toBe(4500)
  })
})
