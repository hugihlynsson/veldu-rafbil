import { describe, expect, it } from 'vitest'

import { buildCarsPayload, toApiCar } from './carApi'
import newCars from '@/modules/data/newCars'
import cars, { carWithSlug, deriveCar } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPath, comparisonPath } from '@/modules/detail/paths'
import { MAX_COMPARED } from '@/modules/detail/comparison'
import { grantAmount, grantPriceCeiling } from '@/modules/data/globals'
import type { NewCar } from '@/modules/data/newCarSchema'

const label = (car: NewCar) =>
  `${car.make} ${car.model} ${car.subModel ?? ''}`.trim()

const payload = buildCarsPayload(new Date('2026-01-01T00:00:00.000Z'), 'abc123')

// A field that quietly changes name or meaning breaks a consumer silently
describe('the published car payload', () => {
  it('publishes every car', () => {
    expect(payload.cars).toHaveLength(cars.length)
    expect(payload.count).toBe(cars.length)
  })

  it('reports the date it was built rather than the date it is read', () => {
    expect(payload.generatedAt).toBe('2026-01-01T00:00:00.000Z')
  })

  it('leaves the commit out when the platform does not say what it is', () => {
    expect(buildCarsPayload(new Date())).not.toHaveProperty('commit')
  })

  // A consumer quoting price.list for a car that qualifies overstates it
  it('applies the grant the same way the site does', () => {
    for (const car of cars) {
      const { price } = toApiCar(car)
      expect(price.withGrant, label(car)).toBe(car.priceWithGrant)
      expect(price.list - price.withGrant, label(car)).toBe(price.grantApplied)

      // ISK has no subunit, and this is where a consumer reads a price
      expect(Number.isInteger(price.list), label(car)).toBe(true)
      expect(Number.isInteger(price.withGrant), label(car)).toBe(true)
      expect(Number.isInteger(price.grantApplied), label(car)).toBe(true)
    }
  })

  it('gives the grant to a car under the ceiling and not to one over it', () => {
    const under = toApiCar(
      deriveCar({ ...newCars[0]!, price: grantPriceCeiling - 1 }),
    )
    expect(under.price.grantApplied).toBe(grantAmount)
    expect(under.price.withGrant).toBe(grantPriceCeiling - 1 - grantAmount)

    // The ceiling is exclusive
    const at = toApiCar(deriveCar({ ...newCars[0]!, price: grantPriceCeiling }))
    expect(at.price.grantApplied).toBe(0)
    expect(at.price.withGrant).toBe(grantPriceCeiling)
  })

  // A consumer joins on these between two fetches of the document, and builds
  // the car's page, its document and a comparison from them
  it('gives every car a slug of its own, the one its page is at', () => {
    const slugs = payload.cars.map((car) => car.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs).toEqual(cars.map(carSlug))
    for (const slug of slugs) expect(carWithSlug(slug), slug).toBeDefined()
  })

  it('derives availability from the expected delivery, both ways', () => {
    for (const car of cars) {
      const published = toApiCar(car)
      if (car.expectedDelivery) {
        expect(published.availability, label(car)).toBe('expected')
        expect(published.expectedDelivery, label(car)).toBe(
          car.expectedDelivery,
        )
      } else {
        expect(published.availability, label(car)).toBe('available')
        expect(published, label(car)).not.toHaveProperty('expectedDelivery')
      }
    }
  })

  it('names the paths a slug reaches as the site serves them', () => {
    const [slug = '', other = ''] = cars.map(carSlug)
    const pages = payload.notes.pages
    expect(pages.replace('{slug}', slug)).toContain(carPath(slug))
    expect(pages.replace('{slug}/{slug}', `${slug}/${other}`)).toContain(
      comparisonPath([slug, other]),
    )
    expect(pages).toContain(`up to ${MAX_COMPARED}`)
  })

  // Same name inside and out, because it already says what it is
  it('publishes the seat count unchanged', () => {
    for (const car of cars) {
      expect(toApiCar(car).seats, label(car)).toBe(car.seats)
    }
  })

  it('turns the fixed-precision charge rate back into a number', () => {
    for (const car of payload.cars) {
      expect(Number.isFinite(car.fastCharge.kmPerMinute), car.slug).toBe(true)
      expect(car.fastCharge.kmPerMinute, car.slug).toBeGreaterThan(0)
    }
  })

  it('estimates a real range under the WLTP figure', () => {
    for (const car of payload.cars) {
      const { min, max } = car.estimatedRealRangeKm
      expect(min, car.slug).toBeLessThan(max)
      expect(max, car.slug).toBeLessThan(car.rangeWltpKm)
    }
  })

  // Spreading a car into the wire format would hand a consumer a list price
  // called `price` and a WLTP figure called `range`
  it('publishes the named fields and none of the internal ones', () => {
    const published = new Set(Object.keys(payload.cars[0]!))
    for (const internal of [
      'price',
      'range',
      'capacity',
      'acceleration',
      'power',
      'heroImageName',
      'timeToCharge10To80',
      'id',
    ]) {
      expect(published.has(internal), internal).toBe(
        internal === 'price', // The one name kept, and it is an object, not a number
      )
    }
    expect(typeof payload.cars[0]!.price).toBe('object')
  })

  // The link means the same inside and out, so it keeps one name. The
  // ev-database link is the largest field and filters nothing, so it waits
  // for the car's own document.
  it('publishes the seller link and leaves the rest to the car document', () => {
    const car = cars.find((car) => car.evDatabaseUrl)!
    const published = toApiCar(car)
    expect(published.sellerUrl).toBe(car.sellerUrl)
    expect(published).not.toHaveProperty('evDatabaseUrl')
  })

  // A path to them in a public document invites hotlinking
  it('publishes no path to the photos', () => {
    const serialised = JSON.stringify(payload)
    expect(serialised).not.toContain('/images/')
    for (const car of payload.cars) {
      expect(car, car.slug).not.toHaveProperty('imagePath')
    }
  })

  // A caveat only helps if it travels with the thing it is about
  it('carries the grant and range caveats in the envelope', () => {
    expect(payload.grant.amount).toBe(grantAmount)
    expect(payload.grant.priceCeiling).toBe(grantPriceCeiling)
    expect(payload.grant.note).toContain('price.withGrant')
    expect(payload.notes.range).toContain('WLTP')
    expect(payload.disclaimer).toContain('by hand')
  })
})
