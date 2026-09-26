import { describe, expect, it } from 'vitest'

import buildLlmsText from './llmsText'
import newCars from './newCars'
import { filterUrlKeys } from './filters'
import { grantAmount, grantPriceCeiling } from './globals'
import { sortingUrlKeys } from './sorting'

const text = buildLlmsText()

// Generated rather than written into public/ so the numbers cannot go stale
describe('llms.txt', () => {
  it('counts the cars from the list', () => {
    expect(text).toContain(String(newCars.length))
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

  // An agent that builds a link from a name that is not a parameter gets the
  // whole list back, sorted by name, and no hint that anything went wrong
  it('names only query parameters the list reads', () => {
    const line = text.split('\n').find((line) => line.includes('query string'))
    const named = [...(line ?? '').matchAll(/`([a-z]+)`/g)].map(
      ([, name]) => name,
    )
    const keys: string[] = [
      ...Object.values(sortingUrlKeys),
      ...Object.values(filterUrlKeys),
    ]

    expect(named.length).toBeGreaterThan(0)
    expect(named.filter((name) => !keys.includes(name))).toEqual([])
  })
})
