import { describe, expect, it } from 'vitest'

import { leavesSite } from './answerLinks'
import { SITE_URL } from '@/modules/siteUrl'

describe('leavesSite', () => {
  it.each([
    'https://www.xpeng.com/is/g6?utm_source=veldurafbil',
    'http://ev-database.org/car/1240',
    // A look-alike host is not the site
    `${SITE_URL}.evil.com/bill/x`,
  ])('is true for %s', (href) => {
    expect(leavesSite(href)).toBe(true)
  })

  it.each([
    `${SITE_URL}/bill/kia-ev3-long-range`,
    '/uppfaerslur',
    '#x',
    undefined,
  ])('is false for %s', (href) => {
    expect(leavesSite(href)).toBe(false)
  })
})
