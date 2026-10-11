import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPathOf, comparisonPath, pagePath, shareImagePath } from './paths'

const [a] = cars

describe('pagePath', () => {
  it("is one car's own page", () => {
    expect(pagePath(['x'])).toBe('/bill/x')
    expect(carPathOf(a)).toBe(`/bill/${carSlug(a)}`)
  })

  it('is a comparison of more', () => {
    expect(pagePath(['x', 'y'])).toBe('/samanburdur/x/y')
    expect(comparisonPath(['x', 'y'])).toBe('/samanburdur/x/y')
  })

  it('has its share image beside it', () => {
    expect(shareImagePath(['x'])).toBe('/mynd/bill/x')
    expect(shareImagePath(['x', 'y'])).toBe('/mynd/samanburdur/x/y')
  })
})
