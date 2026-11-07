import { describe, expect, it } from 'vitest'

import cars, { allCars } from '@/modules/data/cars'
import carReviews from '@/modules/data/carReviews'
import { carSlug } from '@/modules/data/getCarId'
import { reviewOf, sheetReviewOf } from './review'

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

// What the sheet over the list fetches for a car, from its own file
describe('sheetReviewOf', () => {
  it('is the text and the questions of the review the page shows', () => {
    for (const car of allCars) {
      const review = reviewOf(car)
      expect(sheetReviewOf(car)).toEqual(
        review
          ? { paragraphs: review.paragraphs, questions: review.questions }
          : null,
      )
    }
  })
})
