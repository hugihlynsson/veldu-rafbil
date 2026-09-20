import { describe, expect, it } from 'vitest'

import carFilter from './carFilter'
import newCars from './newCars'
import { getFiltersFromQuery } from './filters'
import { Filters } from '../types'

// Mirrors how useFilters (app/newCars.tsx) writes filters into the URL.
const toQuery = (filters: Filters): Record<string, string> => {
  const query: Record<string, string> = {}
  if (filters.name?.length) query.nafn = filters.name.join(',')
  if (filters.drive?.length) query.drif = filters.drive.join(',')
  return query
}

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

  // ISK has no subunit, and the UI cannot produce a fraction — but the filters
  // come out of the URL, and a fractional price is not a price: it renders as
  // one, and it breaks the zero-padded tiebreak in the name sort.
  it.each([
    // Both of these are maxima, and a half króna either way is nothing next to
    // a price quoted in thousands, so it is the nearest whole one
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

  // The ones that are not prices: seconds and km per minute are measurements,
  // and the modal offers 8.0 and 3.1 as the example of each
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

// The bug this guards: useFilters joined multi-value filters with commas and
// getFiltersFromQuery parsed the whole string back as one value, so picking two
// makes and reloading matched nothing.
describe('filters survive a round trip through the URL', () => {
  const cases: Array<[string, Filters]> = [
    ['two names', { name: ['tesla', 'kia'] }],
    ['one name', { name: ['tesla'] }],
    ['two drives', { drive: ['AWD', 'RWD'] }],
    ['one drive', { drive: ['FWD'] }],
  ]

  it.each(cases)('%s come back unchanged', (_label, filters) => {
    expect(getFiltersFromQuery(toQuery(filters))).toEqual(filters)
  })

  it.each(cases)('%s match the same cars', (_label, filters) => {
    const before = matches(filters)
    expect(before).toBeGreaterThan(0)
    expect(matches(getFiltersFromQuery(toQuery(filters)))).toBe(before)
  })
})
