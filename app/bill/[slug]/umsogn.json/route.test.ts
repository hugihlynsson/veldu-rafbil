import { describe, expect, it } from 'vitest'

import cars, { allCars } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { reviewOf } from '@/modules/detail/review'
import { GET } from './route'

const served = async (slug: string): Promise<unknown> =>
  (
    await GET(new Request('http://localhost'), {
      params: Promise.resolve({ slug }),
    })
  ).json()

// CarView shows the paragraphs and CarSheet hands the questions to the chat;
// what the review was written from stays out of a file fetched per car
describe("a car's review file", () => {
  it('holds the review the page shows, and its questions, for a car on sale', async () => {
    for (const car of cars) {
      const review = reviewOf(car)
      expect(review).toBeDefined()
      expect(await served(carSlug(car))).toStrictEqual({
        paragraphs: review?.paragraphs,
        questions: review?.questions,
      })
    }
  })

  it('is empty for a car no longer sold new', async () => {
    const deprecated = allCars.filter((car) => car.deprecated)
    expect(deprecated.length).toBeGreaterThan(0)
    for (const car of deprecated) {
      expect(await served(carSlug(car))).toBeNull()
    }
  })
})
