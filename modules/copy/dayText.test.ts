import { describe, expect, it } from 'vitest'

import { dayText, monthText } from './dayText'

describe('dayText', () => {
  it('writes the day as Icelandic does, without a leading zero', () => {
    expect(dayText('2026-10-31')).toBe('31. október 2026')
    expect(dayText('2026-01-05')).toBe('5. janúar 2026')
  })

  it('gives the month alone', () => {
    expect(monthText('2026-08-24')).toBe('ágúst 2026')
  })
})
