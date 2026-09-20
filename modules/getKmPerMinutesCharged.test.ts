import { describe, expect, it } from 'vitest'

import getKmPerMinutesCharged, {
  formatKmPerMinutesCharged,
} from './getKmPerMinutesCharged'

describe('getKmPerMinutesCharged', () => {
  it('is 70% of the range spread over the charge time', () => {
    expect(getKmPerMinutesCharged(20, 500)).toBe(17.5)
  })

  // Sorting and the fastcharge filter compare it, so it cannot be text
  it('returns a number', () => {
    expect(typeof getKmPerMinutesCharged(21, 712)).toBe('number')
  })

  it('keeps three significant figures', () => {
    expect(getKmPerMinutesCharged(21, 712)).toBe(23.7)
  })
})

describe('formatKmPerMinutesCharged', () => {
  it('writes the same figure the list UI shows', () => {
    expect(formatKmPerMinutesCharged(21, 712)).toBe('23.7')
  })

  // A number would render this as "20", and the column would jump about
  it('keeps a trailing zero the number form loses', () => {
    expect(formatKmPerMinutesCharged(10.5, 300)).toBe('20.0')
    expect(Number(formatKmPerMinutesCharged(10.5, 300))).toBe(
      getKmPerMinutesCharged(10.5, 300),
    )
  })
})
