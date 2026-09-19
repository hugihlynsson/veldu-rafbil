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
