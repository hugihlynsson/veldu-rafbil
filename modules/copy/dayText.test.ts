import { describe, expect, it } from 'vitest'

import { dayMonthText, dayText, monthText } from './dayText'

describe('dayText', () => {
  it('writes the day as Icelandic does, without a leading zero', () => {
    expect(dayText('2026-10-31')).toBe('31. október 2026')
    expect(dayText('2026-01-05')).toBe('5. janúar 2026')
  })

  it('leaves out the year', () => {
    expect(dayMonthText('2026-11-05')).toBe('5. nóvember')
  })

  it('gives the month alone', () => {
    expect(monthText('2026-08-24')).toBe('ágúst 2026')
  })
})
