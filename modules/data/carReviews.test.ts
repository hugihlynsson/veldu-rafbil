import { describe, expect, it } from 'vitest'

import cars from './cars'
import { carSlug } from './getCarId'
import carReviews from './carReviews'
import { reviewFactsKey } from '@/modules/detail/reviewPrompt'

const bySlug = new Map(cars.map((car) => [carSlug(car), car]))

describe('the car reviews', () => {
  it('has one for every car', () => {
    const missing = [...bySlug.keys()].filter((slug) => !(slug in carReviews))
    // A new or renamed car: run `npx tsx --env-file=.env.local scripts/car-reviews.ts`
    expect(missing).toEqual([])
  })

  it('reviews only cars on the list', () => {
    const gone = Object.keys(carReviews).filter((slug) => !bySlug.has(slug))
    // The same run drops them
    expect(gone).toEqual([])
  })

  // A review quotes its car's figures and the gaps to its similar cars
  it('has each written from the figures as they are now', () => {
    const stale = [...bySlug].flatMap(([slug, car]) => {
      const review = carReviews[slug]
      return review && review.facts !== reviewFactsKey(car) ? [slug] : []
    })
    // Their figures changed: the same run writes them again
    expect(stale).toEqual([])
  })

  it('has each in plain paragraphs', () => {
    for (const { paragraphs } of Object.values(carReviews)) {
      expect(paragraphs.length).toBeGreaterThan(0)
      for (const paragraph of paragraphs) {
        expect(paragraph.trim()).toBe(paragraph)
        expect(paragraph).not.toMatch(/\*\*|^#|\n/)
      }
    }
  })
})
