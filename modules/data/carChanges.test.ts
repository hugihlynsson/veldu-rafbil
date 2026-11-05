import { describe, expect, it } from 'vitest'

import carChanges, { type CarChange } from './carChanges'
import { allCars } from './cars'
import { carSlug } from './getCarId'
import { movedSlugs } from './movedSlugs'

const bySlug = new Map<string, CarChange[]>()
for (const entry of carChanges) {
  bySlug.set(entry.slug, [...(bySlug.get(entry.slug) ?? []), entry])
}

// The car as its entries leave it, read oldest first
const replay = (entries: ReadonlyArray<CarChange>) => {
  let onSale = false
  let price: number | undefined
  let delivery: string | undefined
  for (const entry of entries) {
    if (entry.added) onSale = true
    if (entry.removed) onSale = false
    if (entry.price) price = entry.price.to
    if (entry.delivery || entry.added) delivery = entry.delivery?.to
  }
  return { onSale, price, delivery, label: entries.at(-1)?.label }
}

// The fix for a failure here is `npx tsx scripts/car-changes.ts`
describe('the change log', () => {
  it('ends at every car as it is now', () => {
    const behind = allCars.flatMap((car) => {
      const logged = replay(bySlug.get(carSlug(car)) ?? [])
      const now = {
        onSale: !car.deprecated,
        price: car.price,
        delivery: car.expectedDelivery,
        label: car.label,
      }
      return JSON.stringify(logged) === JSON.stringify(now)
        ? []
        : [{ slug: carSlug(car), logged, now }]
    })
    expect(behind).toEqual([])
  })

  it('has every car that has left the data last taken out', () => {
    const slugs = new Set(allCars.map(carSlug))
    const astray = [...bySlug].flatMap(([slug, entries]) =>
      slugs.has(slug) || entries.at(-1)?.removed ? [] : [slug],
    )
    expect(astray).toEqual([])
  })

  it('names each car by the slug it has now', () => {
    expect(carChanges.filter(({ slug }) => slug in movedSlugs)).toEqual([])
  })

  it('runs oldest first, a day at a time', () => {
    for (const { date } of carChanges) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    const dates = carChanges.map(({ date }) => date)
    expect(dates).toEqual(dates.toSorted())
  })

  it('has something changed in every entry', () => {
    const empty = carChanges.filter(
      (entry) =>
        !entry.added &&
        !entry.removed &&
        !entry.price &&
        !entry.delivery &&
        !entry.renamedFrom,
    )
    expect(empty).toEqual([])
  })
})
