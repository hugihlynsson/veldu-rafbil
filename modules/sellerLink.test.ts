import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { sellerLink } from './sellerLink'

describe('sellerLink', () => {
  it('tags a seller page as a referral from here', () => {
    expect(sellerLink('https://kia.is/bilar/ev3')).toBe(
      'https://kia.is/bilar/ev3?utm_source=veldurafbil&utm_medium=referral',
    )
  })

  it('keeps the query and the fragment the page already has', () => {
    expect(sellerLink('https://bl.is/bill?gerd=ev3#verd')).toBe(
      'https://bl.is/bill?gerd=ev3&utm_source=veldurafbil&utm_medium=referral#verd',
    )
  })

  it('leaves a tag the page already carries as it is', () => {
    expect(sellerLink('https://bl.is/bill?utm_source=bl')).toBe(
      'https://bl.is/bill?utm_source=bl&utm_medium=referral',
    )
  })

  it('leaves what is not a URL as it came', () => {
    expect(sellerLink('kia.is')).toBe('kia.is')
  })

  it('still leads every car to its own seller page', () => {
    for (const car of cars) {
      const tagged = new URL(sellerLink(car.sellerUrl))
      const untagged = new URL(car.sellerUrl)
      expect(tagged.origin + tagged.pathname).toBe(
        untagged.origin + untagged.pathname,
      )
      expect(tagged.searchParams.get('utm_source')).toBeTruthy()
    }
  })
})
