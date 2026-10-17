import { describe, expect, it } from 'vitest'

import { allCars } from './cars'
import { carSlug } from './getCarId'
import { movedSlugs } from './movedSlugs'

// A car no longer sold still has its page, and its slug
const current = new Set(allCars.map(carSlug))

describe('the slugs renamed cars moved from', () => {
  it('move only to a car on the list', () => {
    const broken = Object.entries(movedSlugs).filter(
      ([, to]) => !current.has(to),
    )
    expect(broken).toEqual([])
  })

  it('move only the slugs that no car has any more', () => {
    const shadowed = Object.keys(movedSlugs).filter((slug) => current.has(slug))
    expect(shadowed).toEqual([])
  })
})
