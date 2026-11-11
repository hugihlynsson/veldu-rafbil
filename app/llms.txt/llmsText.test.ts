import { describe, expect, it } from 'vitest'

import buildLlmsText from './llmsText'
import cars from '@/modules/data/cars'
import { filterUrlKeys } from '@/modules/list/filters'
import { grantAmount, grantPriceCeiling } from '@/modules/data/globals'
import { sortingUrlKeys } from '@/modules/list/sorting'
import { carSlug } from '@/modules/data/getCarId'
import { carPath, comparisonPath } from '@/modules/detail/paths'
import { NEWS_FEED_PATH } from '@/modules/news/paths'

const text = buildLlmsText()

// Generated rather than written into public/ so the numbers cannot go stale
describe('llms.txt', () => {
  it('counts the cars from the list', () => {
    expect(text).toContain(String(cars.length))
  })

  it('names the grant figures the prices actually use', () => {
    expect(text).toContain(grantAmount.toLocaleString('en-US'))
    expect(text).toContain(grantPriceCeiling.toLocaleString('en-US'))
  })

  // https://llmstxt.org: an H1 with the name, then a blockquote summary
  it('opens the way the convention says to', () => {
    const [title, blank, summary] = text.split('\n')
    expect(title).toBe('# Veldu Rafbíl')
    expect(blank).toBe('')
    expect(summary?.startsWith('> ')).toBe(true)
  })

  it('points at the machine-readable list', () => {
    expect(text).toContain('(/api/cars)')
  })

  // An agent builds these from a slug, so they have to be the paths served
  it('names the page paths the site serves', () => {
    const slug = carSlug(cars[0]!)
    const other = carSlug(cars[1]!)
    expect(text).toContain('`/bill/{slug}`')
    expect(`/bill/${slug}`).toBe(carPath(slug))
    expect(text).toContain('`/samanburdur/{slug}/{slug}`')
    expect(`/samanburdur/${slug}/${other}`).toBe(comparisonPath([slug, other]))
    expect(text).toContain(`(${NEWS_FEED_PATH})`)
  })

  // An agent that builds a link from a name that is not a parameter gets the
  // whole list back, sorted by name, and no hint that anything went wrong
  it('names only query parameters the list reads', () => {
    const line = text.split('\n').find((line) => line.includes('query string'))
    const named = [...(line ?? '').matchAll(/`([a-z]+)`/g)].map(
      ([, name = '']) => name,
    )
    const keys: string[] = [
      ...Object.values(sortingUrlKeys),
      ...Object.values(filterUrlKeys),
    ]

    expect(named.length).toBeGreaterThan(0)
    expect(named.filter((name) => !keys.includes(name))).toEqual([])
  })
})
