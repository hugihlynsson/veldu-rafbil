import { describe, expect, it } from 'vitest'

import cars, { deriveCar } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import type { NewCar } from '@/modules/data/newCarSchema'
import { closestCars, similarTo, similarToAll } from './similar'

const base: NewCar = {
  make: 'Kia',
  model: 'EV3',
  heroImageName: 'kia-ev3',
  price: 6_000_000,
  sellerUrl: 'https://kia.is',
  acceleration: 7.5,
  capacity: 81,
  range: 500,
  drive: 'FWD',
  seats: 5,
  timeToCharge10To80: 31,
  power: 150,
}

const car = (overrides: Partial<NewCar>) => deriveCar({ ...base, ...overrides })

describe('closestCars', () => {
  it('puts the car closest in price and range first', () => {
    const looking = car({})
    const close = car({ make: 'Skoda', model: 'Elroq', price: 6_100_000 })
    const far = car({ make: 'Audi', model: 'Q8', price: 14_000_000 })
    expect(closestCars(looking, [far, close, looking], 2)).toEqual([close, far])
  })

  it('never offers another variant of the same model', () => {
    const looking = car({})
    const sibling = car({ subModel: 'Long Range' })
    const other = car({ make: 'Skoda', model: 'Elroq', price: 9_000_000 })
    expect(closestCars(looking, [sibling, other])).toEqual([other])
  })

  it('takes a body style named onto a model for the same model', () => {
    const looking = car({ make: 'Mercedes-Benz', model: 'CLA' })
    const brake = car({ make: 'Mercedes-Benz', model: 'CLA Shooting Brake' })
    const other = car({ make: 'Skoda', model: 'Elroq', price: 9_000_000 })
    expect(closestCars(looking, [brake, other])).toEqual([other])
  })

  it('offers one variant of each other model', () => {
    const looking = car({})
    const a = car({ make: 'Skoda', model: 'Elroq', subModel: '85' })
    const b = car({ make: 'Skoda', model: 'Elroq', subModel: '60' })
    const c = car({ make: 'Audi', model: 'Q4', price: 7_000_000 })
    expect(closestCars(looking, [a, b, c])).toEqual([b, c])
  })

  it('sets a car with seats for a different need further away', () => {
    const looking = car({})
    const sevenSeater = car({ make: 'Kia', model: 'EV9', seats: 7 })
    const fiveSeater = car({
      make: 'Tesla',
      model: 'Model Y',
      price: 6_600_000,
    })
    expect(closestCars(looking, [sevenSeater, fiveSeater], 1)).toEqual([
      fiveSeater,
    ])
  })
})

describe('similarToAll', () => {
  const bySlug = (...slugs: string[]) =>
    slugs.map((slug) => {
      const found = cars.find((car) => carSlug(car) === slug)
      if (!found) throw new Error(`No car ${slug}`)
      return found
    })

  it('offers what the most of the compared cars are similar to first', () => {
    const compared = cars.filter((car) => similarTo(car).length > 0).slice(0, 3)
    const offered = similarToAll(compared)
    const votes = (car: (typeof offered)[number]) =>
      compared.filter((one) => similarTo(one).some((o) => o.id === car.id))
        .length
    expect(offered.map(votes)).toEqual(
      offered.map(votes).toSorted((a, b) => b - a),
    )
  })

  it('never offers a compared car or another variant of one', () => {
    for (const compared of [
      bySlug('skoda-peaq-90x', 'peugeot-e-5008-dual-motor'),
      bySlug('byd-seal-base', 'byd-sealion-7-base'),
      bySlug(
        'tesla-model-y-long-range-dual-motor',
        'kia-ev6-2025-long-range-awd',
      ),
    ]) {
      const offered = similarToAll(compared)
      expect(offered.length).toBeGreaterThan(0)
      for (const car of offered) {
        expect(
          compared.some(
            (one) => one.make === car.make && one.model === car.model,
          ),
        ).toBe(false)
      }
    }
  })

  it('offers at most three', () => {
    for (let i = 0; i + 4 <= cars.length; i += 4) {
      expect(similarToAll(cars.slice(i, i + 4)).length).toBeLessThanOrEqual(3)
    }
  })
})
