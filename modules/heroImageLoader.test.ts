import { describe, expect, it } from 'vitest'
import { readdirSync } from 'node:fs'

import newCars from './newCars'
import heroImageLoader from './heroImageLoader'

const rendered = new Set(readdirSync('public/rendered'))

describe('the hero image loader', () => {
  // The loader is the only thing standing between a card and a 404, and a
  // missing variant is invisible until someone loads the page on that device.
  it.each(newCars.map((car) => car.heroImageName))(
    'resolves every width for %s',
    (name) => {
      for (const width of [1, 128, 256, 540, 828, 1080, 1180, 1320, 4000]) {
        const url = heroImageLoader({ src: `/images/${name}.jpg`, width })
        expect(rendered.has(url.replace('/rendered/', ''))).toBe(true)
      }
    },
  )

  it('falls back to the source for a photo it has no hash for', () => {
    expect(heroImageLoader({ src: '/images/not-a-car.jpg', width: 540 })).toBe(
      '/images/not-a-car.jpg',
    )
  })
})
