import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { allCars } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { SITE_URL } from '@/modules/siteUrl'
import sitemap from './sitemap'

const urls = sitemap().map(({ url }) => url)

describe('sitemap', () => {
  it('lists the list and every car page that is built', () => {
    expect(urls).toContain(`${SITE_URL}/`)
    for (const car of allCars) {
      expect(urls).toContain(`${SITE_URL}/bill/${carSlug(car)}`)
    }
    expect(urls).toHaveLength(allCars.length + 1)
  })

  it('names each page once', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })

  // robots.txt is a static file, so nothing else ties its line to the route
  it('is where robots.txt says it is', () => {
    const robots = readFileSync(path.join(__dirname, 'robots.txt'), 'utf8')
    expect(robots).toMatch(
      new RegExp(`^Sitemap: ${SITE_URL}/sitemap\\.xml$`, 'm'),
    )
  })
})
