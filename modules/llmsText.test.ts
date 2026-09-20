import { describe, expect, it } from 'vitest'

import buildLlmsText from './llmsText'
import newCars from './newCars'
import { grantAmount, grantPriceCeiling } from './globals'

const text = buildLlmsText()

// The point of generating this rather than writing it into public/ is that the
// numbers in it come from the data. If they stop doing that, it is a file
// telling models a car count and a grant that the site no longer uses.
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
})
