import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import newCars from './newCars'
import heroImageLoader from './heroImageLoader'
import hashes from './heroImageHashes.json'
import widths from './heroImageWidths.json'

// CI runs the tests without building, so nothing here may read the rendered
// files. What it can pin is that the three things the build has to agree on —
// the widths, the hashes and the loader — still say the same.
const config = require('../next.config.js')

describe('the hero image loader', () => {
  it('renders every width next.config.js can ask for', () => {
    const asked = [
      ...config.images.deviceSizes,
      ...config.images.imageSizes,
    ].sort((a: number, b: number) => a - b)

    expect(widths).toEqual(asked)
  })

  // The manifest is committed because CI typechecks without running the
  // render, so it can go stale against the photos beside it.
  it('has a hash for every photo and a photo for every hash', () => {
    const onDisk = readdirSync('assets/images')
      .filter((file) => file.endsWith('.jpg'))
      .map((file) => file.replace(/\.jpg$/, ''))

    expect(Object.keys(hashes).sort()).toEqual(onDisk.sort())
  })

  it.each(Object.keys(hashes))('has the current hash for %s', (name) => {
    const digest = createHash('sha256')
      .update(readFileSync(`assets/images/${name}.jpg`))
      .digest('hex')
      .slice(0, 8)

    expect(hashes[name as keyof typeof hashes]).toBe(digest)
  })

  it.each(newCars.map((car) => car.heroImageName))(
    'points %s at a rendered width for any request',
    (name) => {
      const hash = hashes[name as keyof typeof hashes]

      // Under the smallest, between two, exactly on one, and past the largest
      for (const [asked, served] of [
        [1, widths[0]],
        [500, 540],
        [828, 828],
        [4000, widths.at(-1)],
      ]) {
        expect(
          heroImageLoader({ src: `/images/${name}.jpg`, width: asked! }),
        ).toBe(`/rendered/${name}.${hash}.${served}.webp`)
      }
    },
  )

  it('falls back to the source for a photo it has no hash for', () => {
    expect(heroImageLoader({ src: '/images/not-a-car.jpg', width: 540 })).toBe(
      '/images/not-a-car.jpg',
    )
  })
})
