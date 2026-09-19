import { describe, expect, it } from 'vitest'

import carFilter from './carFilter'
import newCars from './newCars'
import {
  filterQueryKeys,
  getFiltersFromQuery,
  getQueryFromFilters,
} from './filters'
import { Filters } from '../types'

const matches = (filters: Filters) => newCars.filter(carFilter(filters)).length

describe('getFiltersFromQuery', () => {
  it('maps the Icelandic params onto the English fields', () => {
    expect(
      getFiltersFromQuery({
        hrodun: '7',
        hradhledsla: '5',
        verd: '6000000',
        draegni: '400',
        virdi: '12000',
        frambod: 'faanlegir',
      }),
    ).toEqual({
      acceleration: 7,
      fastcharge: 5,
      price: 6000000,
      range: 400,
      value: 12000,
      availability: 'available',
    })
  })

  it('reads vaentanlegir as expected rather than available', () => {
    expect(getFiltersFromQuery({ frambod: 'vaentanlegir' }).availability).toBe(
      'expected',
    )
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
    expect(getFiltersFromQuery({})).toEqual({})
  })

  // Number('abc') is NaN and every comparison against NaN is false, so an
  // unreadable parameter used to hide every car and render "NaN kr." in the
  // chip that offered to remove it.
  it.each([
    ['verd', 'abc'],
    ['verd', ''],
    ['draegni', 'four hundred'],
    ['hrodun', '-3'],
    ['virdi', '0'],
    ['hradhledsla', 'Infinity'],
  ])('ignores %s=%s rather than matching nothing', (key, value) => {
    const filters = getFiltersFromQuery({ [key]: value })

    expect(filters).toEqual({})
    expect(matches(filters)).toBe(newCars.length)
  })

  it('still reads a good number next to a bad one', () => {
    expect(getFiltersFromQuery({ verd: 'abc', draegni: '400' })).toEqual({
      range: 400,
    })
  })
})

// The bug this guards: useFilters joined multi-value filters with commas and
// getFiltersFromQuery parsed the whole string back as one value, so picking two
// makes and reloading matched nothing. It now runs through the writer the client
// actually uses rather than through a copy of it kept in this file.
describe('filters survive a round trip through the URL', () => {
  const cases: Array<[string, Filters]> = [
    ['two names', { name: ['tesla', 'kia'] }],
    ['one name', { name: ['tesla'] }],
    ['two drives', { drive: ['AWD', 'RWD'] }],
    ['one drive', { drive: ['FWD'] }],
    ['a price', { price: 6_000_000 }],
    ['a range', { range: 400 }],
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

  // Both ends agree that these are the absence of a filter rather than a filter
  // that matches nothing, so they do not survive the trip — and must not
  it.each<[string, Filters]>([
    ['a zero', { price: 0 }],
    ['an empty list', { name: [] }],
    ['a list of separators', { name: [''] }],
  ])('drops %s rather than carrying it', (_label, filters) => {
    expect(getQueryFromFilters(filters)).toEqual({})
    expect(roundTrip(filters)).toEqual({})
  })

  // Required<Filters> is the tripwire: a new filter field fails to compile here
  // until it is listed, and then fails this until its key joins the list the
  // client clears before writing. A key missing from that list is a filter that
  // cannot be switched off.
  it('writes only keys the client knows to clear', () => {
    const everyFilter: Required<Filters> = {
      name: ['tesla'],
      drive: ['AWD'],
      price: 9_000_000,
      range: 300,
      acceleration: 9,
      value: 30_000,
      fastcharge: 2,
      availability: 'available',
    }

    expect(Object.keys(getQueryFromFilters(everyFilter)).sort()).toEqual(
      [...filterQueryKeys].sort(),
    )
  })
})
