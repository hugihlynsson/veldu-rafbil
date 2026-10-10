import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import nextConfig from './next.config'
import { serializeFilters, type Filters } from './modules/list/filters'
import { serializeSorting } from './modules/list/sorting'
import { serializeView } from './modules/list/view'

type Rule = { source: string; has?: { type: string; key?: string }[] }

const appliesToRoot = (rule: Rule, query: string) => {
  const params = new URLSearchParams(query)

  return (
    rule.source === '/' &&
    rule.has?.every(
      (condition) =>
        condition.type === 'query' && params.has(condition.key ?? ''),
    )
  )
}

const listRewrites = async () => {
  const rewrites = await nextConfig.rewrites!()
  return (Array.isArray(rewrites) ? rewrites : rewrites.beforeFiles) ?? []
}

// Where a visit to / with this query is served from: the rewrite's
// destination, or undefined for the / built at deploy
const servedFrom = async (query: string): Promise<string | undefined> =>
  (await listRewrites()).find((rule) => appliesToRoot(rule, query))?.destination

// The header a visit to / with this query gets, the last matching rule winning
// as it does in Next
const responseHeader = async (
  query: string,
  key: string,
): Promise<string | undefined> =>
  (await nextConfig.headers!())
    .filter((rule) => appliesToRoot(rule, query))
    .flatMap((rule) => rule.headers)
    .findLast((header) => header.key.toLowerCase() === key.toLowerCase())?.value

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

const listQueries: [string, string][] = [
  ['a sorting', serializeSorting({ sorting: 'price', direction: 'asc' })],
  [
    'a flipped sorting',
    serializeSorting({ sorting: 'name', direction: 'desc' }),
  ],
  ['the grid', serializeView('grid')],
  ['the table', serializeView('table')],
  ...Object.entries(everyFilter).map(([key, value]): [string, string] => [
    `the ${key} filter`,
    serializeFilters({ [key]: value } as Filters),
  ]),
]

const otherQueries: [string, string][] = [
  ['no query', ''],
  ['a parameter the list does not read', '?utm_source=facebook'],
]

// The / built at deploy is all cars in name order, as a list, so a URL asking for
// anything else would arrive that way and reorder once it hydrated
describe('the list a URL is served', () => {
  it.each(listQueries)('is rendered per request for %s', async (_, query) => {
    expect(query).not.toBe('')
    expect(await servedFrom(query)).toBe('/with-query')
  })

  it.each(otherQueries)(
    'is the one built at deploy for %s',
    async (_, query) => {
      expect(await servedFrom(query)).toBeUndefined()
    },
  )

  it('is rewritten to a page that exists', () => {
    expect(existsSync('app/with-query/page.tsx')).toBe(true)
  })
})

describe('the CDN cache for a list rendered per request', () => {
  it.each(listQueries)('keeps the page for %s', async (_, query) => {
    expect(await responseHeader(query, 'Vercel-CDN-Cache-Control')).toMatch(
      /max-age=\d+/,
    )
  })

  it('covers every key that is rewritten', async () => {
    const headers = await nextConfig.headers!()
    const rewritten = (await listRewrites()).filter(
      (rule) => rule.destination === '/with-query',
    )

    expect(rewritten.length).toBeGreaterThan(0)
    for (const rule of rewritten) {
      expect(
        headers.find(
          (header) =>
            header.source === rule.source &&
            JSON.stringify(header.has) === JSON.stringify(rule.has),
        )?.headers,
      ).toContainEqual(
        expect.objectContaining({ key: 'Vercel-CDN-Cache-Control' }),
      )
    }
  })

  // The / built at deploy carries its own headers from Next
  it.each(otherQueries)('is left alone for %s', async (_, query) => {
    expect(
      await responseHeader(query, 'Vercel-CDN-Cache-Control'),
    ).toBeUndefined()
  })

  // A new deploy changes the HTML and the chunks it names, so the browser has
  // to keep asking
  it.each([...listQueries, ...otherQueries])(
    'leaves the browser cache as it was for %s',
    async (_, query) => {
      expect(await responseHeader(query, 'Cache-Control')).toBeUndefined()
      expect(await responseHeader(query, 'CDN-Cache-Control')).toBeUndefined()
    },
  )
})
