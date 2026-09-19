import { describe, expect, it } from 'vitest'

import { agree, takesSingular } from './plural'

describe('takesSingular', () => {
  it.each([1, 21, 31, 101, 121, 1001])('is singular for %i', (count) => {
    expect(takesSingular(count)).toBe(true)
  })

  // The case the old regex got wrong: it matched anything ending in 1
  it.each([11, 111, 211, 1011])('is plural for %i', (count) => {
    expect(takesSingular(count)).toBe(false)
  })

  it.each([0, 2, 5, 10, 12, 20, 100, 185])('is plural for %i', (count) => {
    expect(takesSingular(count)).toBe(false)
  })
})

describe('agree', () => {
  it('picks the form that goes with the count', () => {
    expect(agree(1, 'bíll', 'bílar')).toBe('bíll')
    expect(agree(11, 'bíll', 'bílar')).toBe('bílar')
    expect(agree(21, 'bíll', 'bílar')).toBe('bíll')
    expect(agree(185, 'bíll', 'bílar')).toBe('bílar')
  })
})
