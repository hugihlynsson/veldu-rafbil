import { describe, expect, it } from 'vitest'

import getPriceWithGrant from './getPriceWithGrant'
import { grantAmount } from './globals'

// Every user-facing price goes through this, so the threshold decides what the
// whole site displays, sorts and filters on.
describe('getPriceWithGrant', () => {
  it('takes the grant off a car under the threshold', () => {
    expect(getPriceWithGrant(9_990_000)).toBe(9_990_000 - grantAmount)
  })

  it('leaves a car on the threshold alone', () => {
    expect(getPriceWithGrant(10_000_000)).toBe(10_000_000)
  })

  it('leaves a car above the threshold alone', () => {
    expect(getPriceWithGrant(10_000_001)).toBe(10_000_001)
  })

  it('is the list price that is compared, not the discounted one', () => {
    // 10,400,000 is over the threshold, so it must not sneak under by first
    // having the grant taken off.
    expect(getPriceWithGrant(10_400_000)).toBe(10_400_000)
  })
})
