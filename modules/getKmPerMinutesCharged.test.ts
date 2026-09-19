import { describe, expect, it } from 'vitest'

import getKmPerMinutesCharged from './getKmPerMinutesCharged'

describe('getKmPerMinutesCharged', () => {
  it('is 70% of the range spread over the charge time', () => {
    expect(getKmPerMinutesCharged(20, 500)).toBe('17.5')
  })

  it('returns a string, which callers have to wrap in Number to compare', () => {
    expect(typeof getKmPerMinutesCharged(21, 712)).toBe('string')
  })

  it('keeps three significant figures', () => {
    expect(getKmPerMinutesCharged(21, 712)).toBe('23.7')
  })
})
