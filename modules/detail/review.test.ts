import { describe, expect, it } from 'vitest'

import cars, { allCars } from '@/modules/data/cars'
import carReviews from '@/modules/data/carReviews'
import { carSlug } from '@/modules/data/getCarId'
import { reviewOf } from './review'

// The car's page and the sheet over the list both show what this gives
describe('reviewOf', () => {
  it('is the review of a car sold new', () => {
    for (const car of cars) {
      expect(reviewOf(car)).toBe(carReviews[carSlug(car)])
    }
  })

  it('is none for a car no longer sold new', () => {
    const deprecated = allCars.filter((car) => car.deprecated)
    expect(deprecated.length).toBeGreaterThan(0)
    for (const car of deprecated) expect(reviewOf(car)).toBeUndefined()
  })
})
