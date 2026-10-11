import { describe, expect, it } from 'vitest'

import cars from './cars'
import { carSlug } from './getCarId'
import similarCars from './similarCars'
import { SIMILAR_COUNT } from '@/modules/detail/similar'

const bySlug = new Map(cars.map((car) => [carSlug(car), car]))

// Each car's page offers these, and its review is written against them
describe('the similar-cars list', () => {
  it('has an entry for every car', () => {
    const missing = [...bySlug.keys()].filter((slug) => !(slug in similarCars))
    // A new or renamed car: run `npx tsx scripts/similar-cars.ts`
    expect(missing).toEqual([])
  })

  it('names only cars on the list', () => {
    const stale = Object.entries(similarCars).flatMap(([slug, similar]) =>
      [slug, ...similar].filter((named) => !bySlug.has(named)),
    )
    // A car gone or renamed: run `npx tsx scripts/similar-cars.ts`, which
    // works out again every entry naming one
    expect(stale).toEqual([])
  })

  it(`offers one to ${SIMILAR_COUNT} other cars, each once`, () => {
    for (const [slug, similar] of Object.entries(similarCars)) {
      expect(similar.length).toBeGreaterThan(0)
      expect(similar.length).toBeLessThanOrEqual(SIMILAR_COUNT)
      expect(new Set(similar).size).toBe(similar.length)
      expect(similar).not.toContain(slug)
    }
  })

  it('offers no other variant of the same model', () => {
    const siblings = Object.entries(similarCars).flatMap(([slug, similar]) => {
      const car = bySlug.get(slug)
      return similar.filter((other) => {
        const otherCar = bySlug.get(other)
        return car?.make === otherCar?.make && car?.model === otherCar?.model
      })
    })
    expect(siblings).toEqual([])
  })
})
