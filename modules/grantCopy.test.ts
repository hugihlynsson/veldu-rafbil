import { afterEach, describe, expect, it, vi } from 'vitest'

import { grantAmount } from './globals'

// Both numbers are legislation and have changed before
const copyWith = async (amount: number, ceiling: number) => {
  vi.resetModules()
  vi.doMock('./globals', () => ({
    grantAmount: amount,
    grantPriceCeiling: ceiling,
  }))
  return import('./grantCopy')
}

// Pins that the prose is derived, so raising a number carries through
describe('the grant copy', () => {
  afterEach(() => {
    vi.doUnmock('./globals')
    vi.resetModules()
  })

  it('names the grant and the ceiling as the law stands', async () => {
    const copy = await import('./grantCopy')
    expect(copy.grantAmountText).toBe('500.000 kr.')
    expect(copy.grantCeilingText).toBe('10 milljónir')
    expect(copy.grantCeilingDativeText).toBe('10 milljónum')
  })

  it('carries a change to the law into the prose', async () => {
    const copy = await copyWith(700_000, 12_000_000)
    expect(copy.grantAmountText).toBe('700.000 kr.')
    expect(copy.grantCeilingText).toBe('12 milljónir')
    expect(copy.grantCeilingDativeText).toBe('12 milljónum')
  })

  it('agrees the noun with a ceiling ending in 1', async () => {
    const copy = await copyWith(grantAmount, 21_000_000)
    expect(copy.grantCeilingText).toBe('21 milljón')
    expect(copy.grantCeilingDativeText).toBe('21 milljón')
  })

  // The other half of the agreement rule, the half a regex gets wrong
  it('keeps the plural for a ceiling ending in 11', async () => {
    const copy = await copyWith(grantAmount, 11_000_000)
    expect(copy.grantCeilingText).toBe('11 milljónir')
    expect(copy.grantCeilingDativeText).toBe('11 milljónum')
  })

  it('writes part of a million with a comma, and as a plural', async () => {
    const half = await copyWith(grantAmount, 9_500_000)
    expect(half.grantCeilingText).toBe('9,5 milljónir')

    // 1,5 is the trap: that 1 is not a singular
    const oneAndAHalf = await copyWith(grantAmount, 1_500_000)
    expect(oneAndAHalf.grantCeilingText).toBe('1,5 milljónir')
  })

  it('reads as the sentences that use it', async () => {
    const copy = await import('./grantCopy')
    expect(`sem kosta minna en ${copy.grantCeilingText}`).toBe(
      'sem kosta minna en 10 milljónir',
    )
    expect(`sækja um ${copy.grantAmountText} rafbílastyrk`).toBe(
      'sækja um 500.000 kr. rafbílastyrk',
    )
    expect(`fyrir bíla undir ${copy.grantCeilingDativeText} kr`).toBe(
      'fyrir bíla undir 10 milljónum kr',
    )
  })
})
