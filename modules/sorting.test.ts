import { describe, expect, it } from 'vitest'

import {
  carSorter,
  defaultDirection,
  flipDirection,
  getDirectionFromQuery,
  getQueryFromSorting,
  getSortingFromQuery,
  isDefaultDirection,
  sortingQueryKeys,
  sortingToQuery,
} from './sorting'
import { NewCar, Sorting, SortingDirection } from '../types'

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
    expect(getSortingFromQuery({})).toBe('name')
    expect(getSortingFromQuery({ radaeftir: 'bogus' })).toBe('name')
  })

  it.each(Object.entries(sortingToQuery))(
    'round trips %s through its Icelandic param',
    (sorting, query) => {
      expect(getSortingFromQuery({ radaeftir: query })).toBe(sorting)
    },
  )

  // A repeated param arrives as an array; neither of these is a list
  it('takes the first value when the param is given twice', () => {
    expect(getSortingFromQuery({ radaeftir: ['draegni', 'verdi'] })).toBe(
      'range',
    )
    expect(
      getDirectionFromQuery({ radaeftir: ['verdi'], ofugt: ['1', '0'] }),
    ).toBe('desc')
  })
})

// ofugt means "flipped from the default", not "descending"
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

// Adding a sorting means touching both directions; this is what says they meet
describe('sorting survives a round trip through the URL', () => {
  const sortings = Object.keys(sortingToQuery) as Array<Sorting>
  const directions: Array<SortingDirection> = ['asc', 'desc']
  const cases = sortings.flatMap((sorting) =>
    directions.map((direction): [Sorting, SortingDirection] => [
      sorting,
      direction,
    ]),
  )

  it.each(cases)('%s %s comes back unchanged', (sorting, direction) => {
    const query = getQueryFromSorting(sorting, direction)

    expect(getSortingFromQuery(query)).toBe(sorting)
    expect(getDirectionFromQuery(query)).toBe(direction)
  })

  // The tidy URL the site is meant to have when nothing has been chosen
  it('writes nothing for the default sorting in its default direction', () => {
    expect(getQueryFromSorting('name', defaultDirection.name)).toEqual({})
  })

  it('records a flip rather than a direction', () => {
    // Descending is range's default, so ascending is what needs the parameter
    expect(getQueryFromSorting('range', 'desc')).toEqual({
      radaeftir: 'draegni',
    })
    expect(getQueryFromSorting('range', 'asc')).toEqual({
      radaeftir: 'draegni',
      ofugt: '1',
    })
  })

  it('writes only keys the client knows to clear', () => {
    const written = new Set(
      cases.flatMap(([sorting, direction]) =>
        Object.keys(getQueryFromSorting(sorting, direction)),
      ),
    )

    expect([...written].sort()).toEqual([...sortingQueryKeys].sort())
  })
})
