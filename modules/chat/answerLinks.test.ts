import { describe, expect, it } from 'vitest'

import {
  leavesSite,
  SELLER_LINK_TOOL,
  sellerLinkCars,
  sitePath,
} from './answerLinks'
import { SITE_URL } from '@/modules/siteUrl'

describe('leavesSite', () => {
  it.each([
    'https://www.xpeng.com/is/g6?utm_source=veldurafbil',
    'http://ev-database.org/car/1240',
    // A look-alike host is not the site
    `${SITE_URL}.evil.com/bill/x`,
    '//evil.com/bill/x',
  ])('is true for %s', (href) => {
    expect(leavesSite(href)).toBe(true)
  })

  it.each([
    `${SITE_URL}/bill/kia-ev3-long-range`,
    SITE_URL,
    SITE_URL.toUpperCase(),
    '/uppfaerslur',
    '#x',
    'mailto:x@example.com',
    undefined,
  ])('is false for %s', (href) => {
    expect(leavesSite(href)).toBe(false)
  })
})

describe('sitePath', () => {
  it.each([
    [`${SITE_URL}/bill/kia-ev3-long-range`, '/bill/kia-ev3-long-range'],
    [`${SITE_URL.toUpperCase()}/bill/x?a=1#b`, '/bill/x?a=1#b'],
    [SITE_URL, '/'],
    ['/uppfaerslur', '/uppfaerslur'],
  ])('reads %s as %s', (href, path) => {
    expect(sitePath(href)).toBe(path)
  })

  it.each([
    'https://www.xpeng.com/is/g6',
    `${SITE_URL}.evil.com/bill/x`,
    '//evil.com/bill/x',
    '#x',
    'mailto:x@example.com',
    undefined,
  ])('is undefined for %s', (href) => {
    expect(sitePath(href)).toBeUndefined()
  })
})

describe('sellerLinkCars', () => {
  const call = (car: string, output: object, state = 'output-available') => ({
    type: `tool-${SELLER_LINK_TOOL}`,
    toolCallId: car,
    state,
    input: { car },
    output,
  })

  it('names the car each link was handed for, as its slug', () => {
    expect(
      sellerLinkCars([
        { type: 'text' },
        call('Kia-EV3-Long-Range', { sellerPage: 'https://kia.is/ev3' }),
        call('kia-ev3-standard-range', { sellerPage: 'https://kia.is/ev3' }),
      ]),
    ).toEqual(new Map([['https://kia.is/ev3', 'kia-ev3-standard-range']]))
  })

  it('leaves out a call that gave no link or has not finished', () => {
    expect(
      sellerLinkCars([
        call('not-a-car', { error: 'There is no car' }),
        call('kia-ev3-long-range', {}, 'input-available'),
      ]),
    ).toEqual(new Map())
  })
})
