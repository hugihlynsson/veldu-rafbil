import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { allCars, deriveCar } from '@/modules/data/cars'
import newCars from '@/modules/data/newCars'
import { SITE_URL } from '@/modules/siteUrl'
import { carStructuredData, serializeStructuredData } from './structuredData'

const sold = allCars.find((car) => !car.deprecated && car.hasGrant)!
const deprecated = allCars.find((car) => car.deprecated)!
const publicDir = path.join(__dirname, '../../../public')

describe('carStructuredData', () => {
  // The page shows the price after the grant, and search engines drop an
  // offer that disagrees with the page
  it('offers the price the page shows', () => {
    const { offers } = carStructuredData(sold)
    expect(offers?.price).toBe(sold.priceWithGrant)
    expect(offers?.price).not.toBe(sold.price)
    expect(offers?.priceCurrency).toBe('ISK')
  })

  it('makes no offer for a car no longer sold new', () => {
    expect(carStructuredData(deprecated)).not.toHaveProperty('offers')
  })

  it('marks a car still to arrive as a pre-order', () => {
    const onSale = newCars.find(
      (car) => !car.deprecated && !car.expectedDelivery,
    )!
    const expected = deriveCar({ ...onSale, expectedDelivery: 'Í vor' })
    expect(carStructuredData(expected).offers?.availability).toBe(
      'https://schema.org/PreOrder',
    )
    expect(carStructuredData(deriveCar(onSale)).offers).not.toHaveProperty(
      'availability',
    )
  })

  it('names the page and a photo that exists, in full', () => {
    for (const car of allCars) {
      const { url, image } = carStructuredData(car)
      expect(url.startsWith(`${SITE_URL}/bill/`)).toBe(true)
      expect(image.startsWith(`${SITE_URL}/images/`)).toBe(true)
      expect(
        existsSync(path.join(publicDir, image.slice(SITE_URL.length))),
      ).toBe(true)
    }
  })

  it('gives every drive a schema.org configuration', () => {
    for (const car of allCars) {
      expect(carStructuredData(car).driveWheelConfiguration).toMatch(
        /^https:\/\/schema\.org\/\w+DriveConfiguration$/,
      )
    }
  })
})

describe('serializeStructuredData', () => {
  it('cannot close the script tag it is written into', () => {
    const json = serializeStructuredData({ name: '</script><script>alert(1)' })
    expect(json).not.toContain('</script>')
    expect(JSON.parse(json)).toEqual({ name: '</script><script>alert(1)' })
  })
})
