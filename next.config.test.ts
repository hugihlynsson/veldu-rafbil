import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import nextConfig from './next.config'
import { serializeFilters } from './modules/filters'
import { serializeSorting } from './modules/sorting'
import { Filters } from './types'

// Where a visit to / with this query is served from: the rewrite's
// destination, or undefined for the / built at deploy
const servedFrom = async (query: string): Promise<string | undefined> => {
  const rewrites = await nextConfig.rewrites!()
  const rules = Array.isArray(rewrites) ? rewrites : rewrites.beforeFiles
  const params = new URLSearchParams(query)

  return rules?.find(
    (rule) =>
      rule.source === '/' &&
      rule.has?.every(
        (condition) => condition.type === 'query' && params.has(condition.key),
      ),
  )?.destination
}

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

// The / built at deploy is all cars in name order, so a URL asking for
// anything else would arrive that way and reorder once it hydrated
describe('the list a URL is served', () => {
  it.each<[string, string]>([
    ['a sorting', serializeSorting({ sorting: 'price', direction: 'asc' })],
    [
      'a flipped sorting',
      serializeSorting({ sorting: 'name', direction: 'desc' }),
    ],
    ...Object.entries(everyFilter).map(([key, value]): [string, string] => [
      `the ${key} filter`,
      serializeFilters({ [key]: value } as Filters),
    ]),
  ])('is rendered per request for %s', async (_label, query) => {
    expect(query).not.toBe('')
    expect(await servedFrom(query)).toBe('/listi')
  })

  it.each([
    ['no query', ''],
    ['a parameter the list does not read', '?utm_source=facebook'],
  ])('is the one built at deploy for %s', async (_label, query) => {
    expect(await servedFrom(query)).toBeUndefined()
  })

  it('is rewritten to a page that exists', () => {
    expect(existsSync('app/listi/page.tsx')).toBe(true)
  })
})
