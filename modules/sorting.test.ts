import { describe, expect, it } from 'vitest'

import {
  carSorter,
  defaultDirection,
  flipDirection,
  getDirectionFromQuery,
  getSortingFromQuery,
  isDefaultDirection,
  sortingToQuery,
} from './sorting'
import { NewCar, Sorting } from '../types'

const car = (over: Partial<NewCar>): NewCar => ({
  make: 'Make',
  model: 'Model',
  heroImageName: 'x',
  price: 5_000_000,
  sellerURL: 'https://example.is',
  acceleration: 7,
  capacity: 60,
  range: 400,
  drive: 'FWD',
  timeToCharge10T080: 30,
  power: 150,
  ...over,
})

describe('reading the sorting out of the query', () => {
  it('defaults to name when the param is missing or unknown', () => {
    expect(getSortingFromQuery({} as never)).toBe('name')
    expect(getSortingFromQuery({ radaeftir: 'bogus' } as never)).toBe('name')
  })

  it.each(Object.entries(sortingToQuery))(
    'round trips %s through its Icelandic param',
    (sorting, query) => {
      expect(getSortingFromQuery({ radaeftir: query } as never)).toBe(sorting)
    },
  )
})

// ofugt means "flipped from this sorting's default", not "descending", so the
// same param means opposite directions for different sortings.
describe('direction', () => {
  it('starts each sorting in its most useful direction', () => {
    expect(getDirectionFromQuery({ radaeftir: 'verdi' })).toBe('asc')
    expect(getDirectionFromQuery({ radaeftir: 'draegni' })).toBe('desc')
  })

  it('reads ofugt as a flip of that default, not as descending', () => {
    expect(getDirectionFromQuery({ radaeftir: 'verdi', ofugt: '1' })).toBe(
      'desc',
    )
    expect(getDirectionFromQuery({ radaeftir: 'draegni', ofugt: '1' })).toBe(
      'asc',
    )
  })

  it('knows when a direction is the default one', () => {
    expect(isDefaultDirection('range', 'desc')).toBe(true)
    expect(isDefaultDirection('range', 'asc')).toBe(false)
  })

  it('flips both ways', () => {
    expect(flipDirection('asc')).toBe('desc')
    expect(flipDirection(flipDirection('asc'))).toBe('asc')
  })
})

describe('carSorter', () => {
  it('sorts price by what the buyer pays, after the grant', () => {
    // 10,100,000 gets no grant; 9,900,000 drops to 9,400,000.
    const expensive = car({ price: 10_100_000 })
    const cheap = car({ price: 9_900_000 })
    expect([expensive, cheap].sort(carSorter('price'))).toEqual([
      cheap,
      expensive,
    ])
  })

  it('puts the longest range first by default', () => {
    const short = car({ range: 300 })
    const long = car({ range: 600 })
    expect([short, long].sort(carSorter('range'))).toEqual([long, short])
  })

  it('applies direction on top of the underlying order', () => {
    const short = car({ range: 300 })
    const long = car({ range: 600 })
    expect([long, short].sort(carSorter('range', 'asc'))).toEqual([short, long])
  })

  it.each(Object.keys(sortingToQuery) as Array<Sorting>)(
    'handles %s without returning undefined',
    (sorting) => {
      const result = carSorter(sorting)(
        car({ range: 300 }),
        car({ range: 600 }),
      )
      expect(Number.isFinite(result)).toBe(true)
    },
  )

  it('has a default direction for every sorting', () => {
    for (const sorting of Object.keys(sortingToQuery) as Array<Sorting>) {
      expect(defaultDirection[sorting]).toMatch(/^(asc|desc)$/)
    }
  })
})
