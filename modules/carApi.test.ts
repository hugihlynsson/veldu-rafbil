import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { buildCarsPayload, toApiCar } from './carApi'
import newCars from './newCars'
import getCarId from './getCarId'
import getPriceWithGrant from './getPriceWithGrant'
import { grantAmount, grantPriceCeiling } from './globals'
import { NewCar } from '../types'

const label = (car: NewCar) =>
  `${car.make} ${car.model} ${car.subModel ?? ''}`.trim()

const payload = buildCarsPayload(new Date('2026-01-01T00:00:00.000Z'), 'abc123')

// Everything here is a promise to somebody who cannot see this repo. A field
// that quietly changes name or meaning breaks them silently, which is what
// these are for — not to re-test the helpers, which have their own tests, but
// to pin the shape those helpers get published in.
describe('the published car payload', () => {
  it('publishes every car', () => {
    expect(payload.cars).toHaveLength(newCars.length)
    expect(payload.count).toBe(newCars.length)
  })

  it('reports the date it was built rather than the date it is read', () => {
    expect(payload.generatedAt).toBe('2026-01-01T00:00:00.000Z')
  })

  it('leaves the commit out when the platform does not say what it is', () => {
    expect(buildCarsPayload(new Date())).not.toHaveProperty('commit')
  })

  // The one mistake this whole shape exists to prevent. `price.withGrant` is
  // what the site shows, sorts and filters on; a consumer quoting `price.list`
  // for a car that qualifies overstates it by the grant.
  it('applies the grant the same way the site does', () => {
    for (const car of newCars) {
      const { price } = toApiCar(car)
      expect(price.withGrant, label(car)).toBe(getPriceWithGrant(car.price))
      expect(price.list - price.withGrant, label(car)).toBe(price.grantApplied)
    }
  })

  it('gives the grant to a car under the ceiling and not to one over it', () => {
    const under = toApiCar({ ...newCars[0]!, price: grantPriceCeiling - 1 })
    expect(under.price.grantApplied).toBe(grantAmount)
    expect(under.price.withGrant).toBe(grantPriceCeiling - 1 - grantAmount)

    // The ceiling is exclusive
    const at = toApiCar({ ...newCars[0]!, price: grantPriceCeiling })
    expect(at.price.grantApplied).toBe(0)
    expect(at.price.withGrant).toBe(grantPriceCeiling)
  })

  // The ids are what a consumer joins on between two fetches of this document,
  // so a collision is their bug to hit and ours to have caused
  it('gives every car an id of its own', () => {
    const ids = payload.cars.map((car) => car.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('derives availability from the expected delivery, both ways', () => {
    for (const car of newCars) {
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

  it('points at an image that exists and an anchor the page carries', () => {
    for (const car of payload.cars) {
      expect(existsSync(`public${car.imagePath}`), car.id).toBe(true)
      expect(car.pagePath, car.id).toBe(`/#${car.id}`)
    }
    // The anchor is the card's id, so the two have to keep agreeing
    expect(payload.cars.map((car) => car.id)).toEqual(newCars.map(getCarId))
  })

  it('turns the fixed-precision charge rate back into a number', () => {
    for (const car of payload.cars) {
      expect(Number.isFinite(car.fastCharge.kmPerMinute), car.id).toBe(true)
      expect(car.fastCharge.kmPerMinute, car.id).toBeGreaterThan(0)
    }
  })

  it('estimates a real range under the WLTP figure', () => {
    for (const car of payload.cars) {
      const { min, max } = car.estimatedRealRangeKm
      expect(min, car.id).toBeLessThan(max)
      expect(max, car.id).toBeLessThan(car.rangeWltpKm)
    }
  })

  // The wire format is not NewCar, and the way it stops being NewCar again is
  // somebody spreading a car into it. These are the internal names: if one
  // turns up here, a consumer is reading a list price called `price` and a
  // WLTP figure called `range`.
  it('publishes the named fields and none of the internal ones', () => {
    const published = new Set(Object.keys(payload.cars[0]!))
    for (const internal of [
      'price',
      'range',
      'capacity',
      'acceleration',
      'power',
      'sellerURL',
      'evDatabaseURL',
      'heroImageName',
      'timeToCharge10T080',
    ]) {
      expect(published.has(internal), internal).toBe(
        internal === 'price', // The one name kept, and it is an object, not a number
      )
    }
    expect(typeof payload.cars[0]!.price).toBe('object')
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
