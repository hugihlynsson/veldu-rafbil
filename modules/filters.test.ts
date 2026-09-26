import { describe, expect, it } from 'vitest'

import carFilter from './carFilter'
import cars from './cars'
import {
  filterUrlKeys,
  getFiltersFromQuery,
  normalizeFilters,
  serializeFilters,
} from './filters'
import { Filters } from '@/types'

const matches = (filters: Filters) => cars.filter(carFilter(filters)).length

// What the browser would put back in the address bar, as Next hands it over
const getQueryFromFilters = (filters: Filters): Record<string, string> =>
  Object.fromEntries(new URLSearchParams(serializeFilters(filters)))

describe('getFiltersFromQuery', () => {
  it('maps the Icelandic params onto the English fields', () => {
    expect(
      getFiltersFromQuery({
        hrodun: '7',
        hradhledsla: '5',
        verd: '6000000',
        draegni: '400',
        saeti: '7',
        virdi: '12000',
        frambod: 'faanlegir',
      }),
    ).toEqual({
      acceleration: 7,
      fastcharge: 5,
      price: 6000000,
      range: 400,
      seats: 7,
      value: 12000,
      availability: 'available',
    })
  })

  it('reads vaentanlegir as expected rather than available', () => {
    expect(getFiltersFromQuery({ frambod: 'vaentanlegir' }).availability).toBe(
      'expected',
    )
  })

  // Anything but the two words it knows used to come back as "expected", and a
  // repeated parameter is an array, which is never either of them
  it('ignores an availability it cannot read', () => {
    expect(getFiltersFromQuery({ frambod: 'kannski' })).toEqual({})
    expect(
      getFiltersFromQuery({ frambod: ['faanlegir', 'vaentanlegir'] }),
    ).toEqual({ availability: 'available' })
  })

  it('splits a comma separated list back into separate values', () => {
    expect(getFiltersFromQuery({ nafn: 'tesla,kia' }).name).toEqual([
      'tesla',
      'kia',
    ])
    expect(getFiltersFromQuery({ drif: 'AWD,RWD' }).drive).toEqual([
      'AWD',
      'RWD',
    ])
  })

  it('accepts a repeated param as well as the comma form', () => {
    expect(
      getFiltersFromQuery({ drif: ['AWD', 'RWD'] as unknown as string }).drive,
    ).toEqual(['AWD', 'RWD'])
  })

  it('treats separators on their own as no filter at all', () => {
    expect(getFiltersFromQuery({ nafn: ' , , ' })).toEqual({})
    expect(getFiltersFromQuery({ drif: '' })).toEqual({})
  })

  // A drive nobody sells is not a filter that hides every car
  it('keeps only the drives it knows', () => {
    expect(getFiltersFromQuery({ drif: 'AWD,4WD' }).drive).toEqual(['AWD'])
    expect(getFiltersFromQuery({ drif: '4WD' })).toEqual({})
    expect(getFiltersFromQuery({})).toEqual({})
  })

  // An unreadable parameter is no filter, not one that matches nothing
  it.each([
    ['verd', 'abc'],
    ['verd', ''],
    ['draegni', 'four hundred'],
    ['hrodun', '-3'],
    ['virdi', '0'],
    ['hradhledsla', 'Infinity'],
    ['saeti', '0'],
    ['saeti', 'nine'],
  ])('ignores %s=%s rather than matching nothing', (key, value) => {
    const filters = getFiltersFromQuery({ [key]: value })

    expect(filters).toEqual({})
    expect(matches(filters)).toBe(cars.length)
  })

  // A fraction renders as a price and breaks the tiebreak in the name sort
  it.each([
    // Both are maxima, so the nearest whole króna either way is nothing
    ['verd', '9500000.5', 9_500_001],
    ['verd', '6000000.4', 6_000_000],
    ['verd', '9499999.5', 9_500_000],
    ['virdi', '20000.6', 20_001],
  ])('reads %s=%s as %d whole krónur', (key, value, expected) => {
    const filters = getFiltersFromQuery({ [key]: value })

    expect(Object.values(filters)).toEqual([expected])
    expect(Object.values(filters).every(Number.isInteger)).toBe(true)
  })

  it('treats a price that rounds to nothing as no filter', () => {
    expect(getFiltersFromQuery({ verd: '0.4' })).toEqual({})
    expect(getFiltersFromQuery({ virdi: '0.2' })).toEqual({})
  })

  // Half a seat would render in the chip that offers to remove the filter
  it('rounds a fractional seat count up to a whole seat', () => {
    expect(getFiltersFromQuery({ saeti: '6.2' }).seats).toBe(7)
    expect(getFiltersFromQuery({ saeti: '7' }).seats).toBe(7)
  })

  // Seconds and km per minute are measurements, not prices
  it('leaves the filters that are not prices fractional', () => {
    expect(getFiltersFromQuery({ hrodun: '7.25' }).acceleration).toBe(7.25)
    expect(getFiltersFromQuery({ hradhledsla: '3.1' }).fastcharge).toBe(3.1)
  })

  it('still reads a good number next to a bad one', () => {
    expect(getFiltersFromQuery({ verd: 'abc', draegni: '400' })).toEqual({
      range: 400,
    })
  })
})

// Two makes picked and reloaded used to match nothing
describe('filters survive a round trip through the URL', () => {
  const cases: Array<[string, Filters]> = [
    ['two names', { name: ['tesla', 'kia'] }],
    ['one name', { name: ['tesla'] }],
    ['two drives', { drive: ['AWD', 'RWD'] }],
    ['one drive', { drive: ['FWD'] }],
    ['a price', { price: 6_000_000 }],
    ['a range', { range: 400 }],
    ['a seat count', { seats: 7 }],
    ['an acceleration', { acceleration: 7 }],
    ['a value', { value: 20_000 }],
    ['a fastcharge', { fastcharge: 3 }],
    ['available', { availability: 'available' }],
    ['expected', { availability: 'expected' }],
    ['no filter at all', {}],
    [
      'every filter at once',
      {
        name: ['tesla', 'kia'],
        drive: ['AWD', 'RWD'],
        price: 9_000_000,
        range: 300,
        seats: 5,
        acceleration: 9,
        value: 30_000,
        fastcharge: 2,
        availability: 'available',
      },
    ],
  ]

  const roundTrip = (filters: Filters) =>
    getFiltersFromQuery(getQueryFromFilters(filters))

  it.each(cases)('%s come back unchanged', (_label, filters) => {
    expect(roundTrip(filters)).toEqual(filters)
  })

  it.each(cases)('%s match the same cars', (_label, filters) => {
    const before = matches(filters)
    expect(before).toBeGreaterThan(0)
    expect(matches(roundTrip(filters))).toBe(before)
  })

  // These are the absence of a filter, so they must not survive the trip
  it.each<[string, Filters]>([
    ['a zero', { price: 0 }],
    ['an empty list', { name: [] }],
    ['a list of separators', { name: [''] }],
  ])('drops %s rather than carrying it', (_label, filters) => {
    expect(getQueryFromFilters(filters)).toEqual({})
    expect(roundTrip(filters)).toEqual({})
  })

  // Required<Filters> is the tripwire: a new filter fails to compile here until
  // it is listed, and one written under the wrong key would not read back
  it('writes every filter under its own key', () => {
    const everyFilter: Required<Filters> = {
      name: ['tesla'],
      drive: ['AWD'],
      price: 9_000_000,
      range: 300,
      seats: 5,
      acceleration: 9,
      value: 30_000,
      fastcharge: 2,
      availability: 'available',
    }

    expect(Object.keys(getQueryFromFilters(everyFilter)).sort()).toEqual(
      Object.values(filterUrlKeys).sort(),
    )
    expect(roundTrip(everyFilter)).toEqual(everyFilter)
  })
})

// The modal's count preview used to test a negative price as typed, and showed
// no cars for a filter the list then dropped and showed all of them for
describe('normalizeFilters', () => {
  it.each<[string, Filters, Filters]>([
    ['a negative price', { price: -5 }, {}],
    ['a zero range', { range: 0 }, {}],
    ['a fractional price', { price: 6_000_000.4 }, { price: 6_000_000 }],
    ['an empty list of names', { name: [] }, {}],
    ['a filter it keeps', { range: 400 }, { range: 400 }],
  ])('reads %s the way the URL will', (_label, filters, expected) => {
    expect(normalizeFilters(filters)).toEqual(expected)
    expect(normalizeFilters(filters)).toEqual(
      getFiltersFromQuery(getQueryFromFilters(filters)),
    )
  })
})
