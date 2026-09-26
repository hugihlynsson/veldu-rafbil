import { describe, expect, it } from 'vitest'

import { findMentionedCars, getRandomSuggestions } from './chatHelpers'
import newCars from './newCars'

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
