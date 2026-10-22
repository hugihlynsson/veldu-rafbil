import { describe, expect, it } from 'vitest'

import { toHorsepower } from './horsepower'

describe('toHorsepower', () => {
  it('gives the metric figure a seller quotes', () => {
    expect(toHorsepower(150)).toBe(204)
  })
})
