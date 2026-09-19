import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import newCars from './newCars'
import { NewCar } from '../types'

const label = (car: NewCar) =>
  `${car.make} ${car.model} ${car.subModel ?? ''}`.trim()

// Most commits to newCars.ts are data edits, and most corrections to it have
// been bad links or a hero image that does not resolve. These catch the classes
// of mistake that can be checked without knowing the real-world values.
describe('the car data', () => {
  it('has cars in it', () => {
    expect(newCars.length).toBeGreaterThan(100)
  })

  it.each(newCars.map((car) => [label(car), car] as const))(
    'has a hero image for %s',
    (_name, car) => {
      expect(existsSync(`public/images/${car.heroImageName}.jpg`)).toBe(true)
    },
  )

  // Two Peugeot e-208 entries once shared a key and React rendered them wrong.
  it('gives every car a unique React key', () => {
    const keys = newCars.map(
      (car) => `${car.make} ${car.model} ${car.subModel} ${car.price}`,
    )
    expect(keys).toHaveLength(new Set(keys).size)
  })

  it.each(newCars.map((car) => [label(car), car] as const))(
    'has plausible numbers for %s',
    (_name, car) => {
      expect(car.price).toBeGreaterThan(0)
      expect(car.range).toBeGreaterThan(0)
      expect(car.range).toBeLessThan(1200)
      expect(car.acceleration).toBeGreaterThan(0)
      expect(car.acceleration).toBeLessThan(30)
      expect(car.capacity).toBeGreaterThan(0)
      expect(car.power).toBeGreaterThan(0)
      expect(car.timeToCharge10T080).toBeGreaterThan(0)
    },
  )

  it.each(newCars.map((car) => [label(car), car] as const))(
    'has usable links for %s',
    (_name, car) => {
      expect(car.sellerURL).toMatch(/^https:\/\//)
      if (car.evDatabaseURL) {
        expect(car.evDatabaseURL).toMatch(
          /^https:\/\/ev-database\.org\/car\/\d+\//,
        )
      }
    },
  )

  it('never points two cars at the same ev-database entry', () => {
    const urls = newCars
      .map((car) => car.evDatabaseURL)
      .filter((url): url is string => Boolean(url))
    const duplicates = urls.filter((url, i) => urls.indexOf(url) !== i)
    expect([...new Set(duplicates)]).toEqual([])
  })
})
