import { describe, expect, it } from 'vitest'

import addDecimalSeparators from './addDecimalSeparators'

// This exists instead of toLocaleString because that can differ between node
// and the browser and break hydration, so the output must be fixed.
describe('addDecimalSeparators', () => {
  it.each([
    [1, '1'],
    [123, '123'],
    [1000, '1.000'],
    [9_490_000, '9.490.000'],
    [1_234_567, '1.234.567'],
  ])('formats %i as %s', (input, expected) => {
    expect(addDecimalSeparators(input)).toBe(expected)
  })

  it('does not depend on the runtime locale', () => {
    expect(addDecimalSeparators(1_000_000)).toBe('1.000.000')
  })

  // A price or a price-per-km filter comes out of the URL, so a shared or
  // hand-edited link can carry a fraction. Reversing and chunking the whole
  // string put a separator inside it: 9500000.5 read as "950.000.0.5".
  it.each([
    [9_500_000.5, '9.500.000,5'],
    [1234.5, '1.234,5'],
    [0.5, '0,5'],
    [0.25, '0,25'],
  ])('writes %d with a comma before the fraction', (input, expected) => {
    expect(addDecimalSeparators(input)).toBe(expected)
  })

  it('keeps the sign on a negative', () => {
    expect(addDecimalSeparators(-1_234_567)).toBe('-1.234.567')
    expect(addDecimalSeparators(-1000.5)).toBe('-1.000,5')
  })

  it.each([
    [0, '0'],
    [999, '999'],
    [1_000_000_000, '1.000.000.000'],
  ])('groups %d as %s', (input, expected) => {
    expect(addDecimalSeparators(input)).toBe(expected)
  })

  // Nothing renders these, but the one that used to arrive here came out as
  // "ytin.ifn.I" rather than as anything a reader could act on
  it.each([
    [Number.NaN, 'NaN'],
    [Number.POSITIVE_INFINITY, 'Infinity'],
    [1e21, '1e+21'],
  ])('leaves %d alone rather than grouping it', (input, expected) => {
    expect(addDecimalSeparators(input)).toBe(expected)
  })
})
