import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import { closestCars } from './similar'

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
