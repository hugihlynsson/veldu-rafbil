import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPath, carPathOf, shareImagePath } from './paths'

const [a] = cars

describe("a car's page", () => {
  it('is at its slug', () => {
    expect(carPath('x')).toBe('/bill/x')
    expect(carPathOf(a)).toBe(`/bill/${carSlug(a)}`)
  })

  it('has its share image beside it', () => {
    expect(shareImagePath('x')).toBe('/mynd/bill/x')
  })
})
