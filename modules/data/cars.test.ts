import { describe, expect, it } from 'vitest'

import cars, { deriveCar } from './cars'
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
