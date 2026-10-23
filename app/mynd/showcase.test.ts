import { describe, expect, it } from 'vitest'

import { currentCarWithSlug } from '@/modules/data/cars'
import { showcaseCars, showcaseSlugs } from './showcase'

describe('showcaseCars', () => {
  it.each(showcaseSlugs)('finds %s on sale now', (slug) => {
    expect(currentCarWithSlug(slug)?.availability).toBe('available')
  })

  it('runs from the cheapest to the dearest', () => {
    const prices = showcaseCars().map((car) => car.priceWithGrant)
    expect(prices).toEqual(prices.toSorted((a, b) => a - b))
  })
})
