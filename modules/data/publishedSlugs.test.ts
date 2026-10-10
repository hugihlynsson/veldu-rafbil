import { describe, expect, it } from 'vitest'

import cars from './cars'
import { carSlug } from './getCarId'
import { movedSlugs, publishedSlugs } from './publishedSlugs'

const current = new Set(cars.map(carSlug))
const published = new Set(publishedSlugs)

// A comparison link is shared and kept, so every slug it can name has to keep
// naming a car, or say plainly that the car is gone
describe('the slugs comparison URLs name cars by', () => {
  it('include every car on the list', () => {
    const unpublished = [...current].filter((slug) => !published.has(slug))
    // A new car, or a renamed one: add its slug to publishedSlugs, and for a
    // rename point the old slug at it in movedSlugs
    expect(unpublished).toEqual([])
  })

  it('still lead somewhere once their car is renamed or gone', () => {
    const lost = publishedSlugs.filter(
      (slug) => !current.has(slug) && !(slug in movedSlugs),
    )
    // Point each at the slug that replaced it in movedSlugs, or at null
    expect(lost).toEqual([])
  })

  it('move only to a car on the list', () => {
    const broken = Object.entries(movedSlugs).filter(
      ([, to]) => to !== null && !current.has(to),
    )
    expect(broken).toEqual([])
  })

  it('move only the slugs that no car has any more', () => {
    const shadowed = Object.keys(movedSlugs).filter((slug) => current.has(slug))
    expect(shadowed).toEqual([])
  })

  it('are listed once each', () => {
    expect(publishedSlugs.length).toBe(published.size)
  })
})
