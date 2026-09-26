import { describe, expect, it } from 'vitest'

import {
  defaultDirection,
  flipDirection,
  getSortingFromQuery,
  isDefaultDirection,
  serializeSorting,
  sortCars,
  sortingToQuery,
  sortingUrlKeys,
} from './sorting'
import { deriveCar, Car } from './cars'
import { NewCar, SearchParams, Sorting, SortingDirection } from '@/types'

const readSorting = (query: SearchParams) => getSortingFromQuery(query).sorting
const readDirection = (query: SearchParams) =>
  getSortingFromQuery(query).direction

// What the browser would put back in the address bar, as Next hands it over
const getQueryFromSorting = (
  sorting: Sorting,
  direction: SortingDirection,
): Record<string, string> =>
  Object.fromEntries(
    new URLSearchParams(serializeSorting({ sorting, direction })),
  )

const car = (over: Partial<NewCar>): Car =>
  deriveCar({
    make: 'Make',
    model: 'Model',
    heroImageName: 'x',
    price: 5_000_000,
    sellerUrl: 'https://example.is',
    acceleration: 7,
    capacity: 60,
    range: 400,
    drive: 'FWD',
    seats: 5,
    timeToCharge10To80: 30,
    power: 150,
    ...over,
  })

describe('reading the sorting out of the query', () => {
  it('defaults to name when the param is missing or unknown', () => {
    expect(readSorting({})).toBe('name')
    expect(readSorting({ radaeftir: 'bogus' })).toBe('name')
    // `in` used to answer for these, and a function is not a Sorting
    expect(readSorting({ radaeftir: 'toString' })).toBe('name')
  })

  it.each(Object.entries(sortingToQuery))(
    'round trips %s through its Icelandic param',
    (sorting, query) => {
      expect(readSorting({ radaeftir: query })).toBe(sorting)
    },
  )

  // A repeated param arrives as an array; neither of these is a list
  it('takes the first value when the param is given twice', () => {
    expect(readSorting({ radaeftir: ['draegni', 'verdi'] })).toBe('range')
    expect(readDirection({ radaeftir: ['verdi'], ofugt: ['1', '0'] })).toBe(
      'desc',
    )
  })
})

// ofugt means "flipped from the default", not "descending"
describe('direction', () => {
  it('starts each sorting in its most useful direction', () => {
    expect(readDirection({ radaeftir: 'verdi' })).toBe('asc')
    expect(readDirection({ radaeftir: 'draegni' })).toBe('desc')
  })

  it('reads ofugt as a flip of that default, not as descending', () => {
    expect(readDirection({ radaeftir: 'verdi', ofugt: '1' })).toBe('desc')
    expect(readDirection({ radaeftir: 'draegni', ofugt: '1' })).toBe('asc')
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

describe('sortCars', () => {
  const sortings = Object.keys(sortingToQuery) as Array<Sorting>

  it('sorts price by what the buyer pays, after the grant', () => {
    // 10,100,000 gets no grant; 9,900,000 drops to 9,400,000.
    const expensive = car({ price: 10_100_000 })
    const cheap = car({ price: 9_900_000 })
    expect(sortCars([expensive, cheap], 'price')).toEqual([cheap, expensive])
  })

  it('puts the longest range first by default', () => {
    const short = car({ range: 300 })
    const long = car({ range: 600 })
    expect(sortCars([short, long], 'range')).toEqual([long, short])
  })

  it('applies direction on top of the underlying order', () => {
    const short = car({ range: 300 })
    const long = car({ range: 600 })
    expect(sortCars([long, short], 'range', 'asc')).toEqual([short, long])
  })

  it('ranks fastcharge by km per minute rather than as text', () => {
    // 3.5 and 17.5 km/min: as strings "17.5" would come first
    const slow = car({ range: 300, timeToCharge10To80: 60 })
    const fast = car({ range: 500, timeToCharge10To80: 20 })
    expect(sortCars([slow, fast], 'fastcharge')).toEqual([fast, slow])
  })

  it.each(sortings)('returns every car it was given for %s', (sorting) => {
    const cars = [car({ range: 300 }), car({ range: 600 }), car({ range: 450 })]
    const sorted = sortCars(cars, sorting)

    expect(sorted).toHaveLength(cars.length)
    expect(new Set(sorted)).toEqual(new Set(cars))
  })

  it('leaves the list it was given alone', () => {
    const short = car({ range: 300 })
    const long = car({ range: 600 })
    const cars = [short, long]

    sortCars(cars, 'range')

    expect(cars).toEqual([short, long])
  })

  // What stableSort used to be there for, now the sort's own guarantee
  it.each<SortingDirection>(['asc', 'desc'])(
    'keeps equal-ranked cars in data order, %s',
    (direction) => {
      const cars = [
        car({ model: 'First', range: 400 }),
        car({ model: 'Second', range: 400 }),
        car({ model: 'Third', range: 400 }),
      ]

      expect(sortCars(cars, 'range', direction).map((c) => c.model)).toEqual([
        'First',
        'Second',
        'Third',
      ])
    },
  )

  // The server and an Icelandic browser do not share a default locale, so a
  // collation left to the runtime would order these two differently
  it('collates names in Icelandic rather than the runtime default', () => {
    const o = car({ make: 'Örn' })
    const v = car({ make: 'Volvo' })

    expect(sortCars([o, v], 'name')).toEqual([v, o])
  })

  it('has a default direction for every sorting', () => {
    for (const sorting of sortings) {
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

    expect(readSorting(query)).toBe(sorting)
    expect(readDirection(query)).toBe(direction)
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

  it('writes only its own two keys', () => {
    const written = new Set(
      cases.flatMap(([sorting, direction]) =>
        Object.keys(getQueryFromSorting(sorting, direction)),
      ),
    )

    expect([...written].sort()).toEqual(Object.values(sortingUrlKeys).sort())
  })
})
