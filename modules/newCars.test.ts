import { existsSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import newCars from './newCars'
import getCarId, { carLabel } from './getCarId'
import { z } from 'zod'

import { newCarSchema } from './newCarSchema'

// Most corrections to this file have been a bad link or a missing photo
describe('the car data', () => {
  it('has cars in it', () => {
    expect(newCars.length).toBeGreaterThan(100)
  })

  it.each(newCars.map((car) => [carLabel(car), car] as const))(
    'has a hero image for %s',
    (_name, car) => {
      expect(existsSync(`public/images/${car.heroImageName}.jpg`)).toBe(true)
    },
  )

  // Dropping a car used to leave its photo behind, and they piled up
  it('leaves no photo behind for a car that is gone', () => {
    const used = new Set(newCars.map((car) => car.heroImageName))
    const orphans = readdirSync('public/images')
      .filter((file) => file.endsWith('.jpg'))
      .map((file) => file.replace(/\.jpg$/, ''))
      .filter((name) => !used.has(name))

    expect(orphans).toEqual([])
  })

  // A collision is three bugs at once: two cards on one id, the chat scrolling
  // to whichever came first, and a list React cannot tell apart.
  it('gives every car an id of its own', () => {
    const byId = new Map<string, Array<string>>()
    for (const car of newCars) {
      const id = getCarId(car)
      byId.set(id, [...(byId.get(id) ?? []), `${carLabel(car)} @ ${car.price}`])
    }

    const collisions = [...byId].filter(([, cars]) => cars.length > 1)

    expect(collisions).toEqual([])
  })

  // /api/cars publishes it as a URL fragment, which a # or a + does not survive
  it('gives every car an id a URL can carry as it is', () => {
    const unsafe = newCars
      .map(getCarId)
      .filter((id) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))

    expect(unsafe).toEqual([])
  })

  // A strict object, so a misspelt optional field is caught rather than dropped
  it.each(newCars.map((car) => [carLabel(car), car] as const))(
    'matches the schema: %s',
    (_name, car) => {
      const result = newCarSchema.safeParse(car)
      expect(result.success ? [] : z.prettifyError(result.error)).toEqual([])
    },
  )

  it('never points two cars at the same ev-database entry', () => {
    const urls = newCars
      .map((car) => car.evDatabaseUrl)
      .filter((url): url is string => Boolean(url))
    const duplicates = urls.filter((url, i) => urls.indexOf(url) !== i)
    expect([...new Set(duplicates)]).toEqual([])
  })
})
