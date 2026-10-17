import { describe, expect, it } from 'vitest'

import cars, {
  allCars,
  carWithSlug,
  currentCarWithSlug,
  deriveCar,
} from './cars'
import { carSlug } from './getCarId'
import { grantPriceCeiling } from './globals'
import newCars from './newCars'

const priced = (price: number) => deriveCar({ ...newCars[0], price })

describe('hasGrant', () => {
  it('is true for a car listed under the ceiling', () => {
    expect(priced(grantPriceCeiling - 1).hasGrant).toBe(true)
  })

  // The ceiling is exclusive
  it('is false for a car listed at the ceiling or above', () => {
    expect(priced(grantPriceCeiling).hasGrant).toBe(false)
    expect(priced(grantPriceCeiling + 1).hasGrant).toBe(false)
  })

  it('says whether the price shown is below the list price, for every car', () => {
    for (const car of cars) {
      expect(car.hasGrant).toBe(car.priceWithGrant < car.price)
    }
  })
})

// The list, the advisor and the published data read the default export
describe('the cars sold', () => {
  it('leave out the ones no longer sold, which keep their pages', () => {
    expect(cars.some((car) => car.deprecated)).toBe(false)
    expect(allCars).toHaveLength(newCars.length)
  })
})

describe('carWithSlug', () => {
  it('finds every car with a page by its slug', () => {
    expect(allCars.map((car) => carWithSlug(carSlug(car)))).toEqual(allCars)
  })

  it('finds no car for a slug none has', () => {
    expect(carWithSlug('no-such-car')).toBeUndefined()
    expect(carWithSlug('toString')).toBeUndefined()
  })
})

describe('currentCarWithSlug', () => {
  it('finds the cars sold new now, and only them', () => {
    expect(allCars.filter((car) => currentCarWithSlug(carSlug(car)))).toEqual(
      cars,
    )
  })
})
