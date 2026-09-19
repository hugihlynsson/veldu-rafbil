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
})
