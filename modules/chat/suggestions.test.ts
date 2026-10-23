import { describe, expect, it } from 'vitest'

import { CHAT_SUGGESTIONS, getRandomSuggestions } from './suggestions'

describe('CHAT_SUGGESTIONS', () => {
  // The chat input offers three at a time, drawn without repeats
  it('has at least three, all different', () => {
    expect(new Set(CHAT_SUGGESTIONS).size).toBe(CHAT_SUGGESTIONS.length)
    expect(CHAT_SUGGESTIONS.length).toBeGreaterThanOrEqual(3)
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
