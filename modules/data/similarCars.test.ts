import { describe, expect, it } from 'vitest'

import cars, { allCars } from './cars'
import { carSlug } from './getCarId'
import similarCars from './similarCars'
import { SIMILAR_COUNT } from '@/modules/detail/similar'

// Every car with a page has an entry, and every entry offers cars still sold
const bySlug = new Map(allCars.map((car) => [carSlug(car), car]))
const sold = new Set(cars.map(carSlug))

// Each car's page offers these, and its review is written against them
describe('the similar-cars list', () => {
  it('has an entry for every car', () => {
    const missing = [...bySlug.keys()].filter((slug) => !(slug in similarCars))
    // A new or renamed car: run `npx tsx scripts/similar-cars.ts`
    expect(missing).toEqual([])
  })

  it('offers only cars still sold, for cars with a page', () => {
    const stale = Object.entries(similarCars).flatMap(([slug, similar]) => [
      ...(bySlug.has(slug) ? [] : [slug]),
      ...similar.filter((named) => !sold.has(named)),
    ])
    // A car renamed or no longer sold: run `npx tsx scripts/similar-cars.ts`,
    // which works out again every entry naming one
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

  // A car no other page offers can only be found from the list
  it("offers every car sold on another car's page", () => {
    const offered = new Set(Object.values(similarCars).flat())
    const unseen = [...sold].filter((slug) => !offered.has(slug))
    // Set it by hand in a near car's entry, in place of one offered often
    expect(unseen).toEqual([])
  })
})
