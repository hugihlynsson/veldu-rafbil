import { describe, expect, it } from 'vitest'

import getPriceWithGrant from './getPriceWithGrant'
import { grantAmount, grantPriceCeiling } from './globals'

// Every user-facing price goes through this, so the threshold decides what the
// whole site displays, sorts and filters on. The threshold is read from globals
// rather than written out again: the law is what changes, not this contract.
describe('getPriceWithGrant', () => {
  it('takes the grant off a car under the threshold', () => {
    const under = grantPriceCeiling - 10_000
    expect(getPriceWithGrant(under)).toBe(under - grantAmount)
  })

  it('leaves a car on the threshold alone', () => {
    expect(getPriceWithGrant(grantPriceCeiling)).toBe(grantPriceCeiling)
  })

  it('leaves a car above the threshold alone', () => {
    expect(getPriceWithGrant(grantPriceCeiling + 1)).toBe(grantPriceCeiling + 1)
  })

  it('is the list price that is compared, not the discounted one', () => {
    // Over the threshold, but under it once the grant is off, so it must not
    // sneak under by having the grant taken off first.
    const justOver = grantPriceCeiling + grantAmount - 100_000
    expect(getPriceWithGrant(justOver)).toBe(justOver)
  })
})
