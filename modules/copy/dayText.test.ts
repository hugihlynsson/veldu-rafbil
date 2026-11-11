import { describe, expect, it } from 'vitest'

import { dayRangeText, dayText, monthText } from './dayText'

describe('dayText', () => {
  it('writes the day as Icelandic does, without a leading zero', () => {
    expect(dayText('2026-10-31')).toBe('31. október 2026')
    expect(dayText('2026-01-05')).toBe('5. janúar 2026')
  })

  it('gives the month alone', () => {
    expect(monthText('2026-08-24')).toBe('ágúst 2026')
  })
})

describe('dayRangeText', () => {
  it('says a shared month and year once', () => {
    expect(dayRangeText('2023-12-04', '2023-12-17')).toBe(
      '4.–17. desember 2023',
    )
    expect(dayRangeText('2023-11-20', '2023-12-17')).toBe(
      '20. nóvember – 17. desember 2023',
    )
    expect(dayRangeText('2022-12-28', '2023-01-10')).toBe(
      '28. desember 2022 – 10. janúar 2023',
    )
  })

  it('is one day when it starts and ends on it', () => {
    expect(dayRangeText('2023-12-17', '2023-12-17')).toBe('17. desember 2023')
  })
})
