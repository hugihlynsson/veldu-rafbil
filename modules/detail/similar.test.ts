import { describe, expect, it } from 'vitest'

import cars, { deriveCar, type Car } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import { closestCars, closestToSelection } from './similar'

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
  towing: 1500,
  groundClearance: null,
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

describe('closestToSelection', () => {
  const none = () => []

  it('weighs a car against every selected car, not only the nearest', () => {
    const cheap = car({ price: 6_000_000 })
    const dear = car({ make: 'Audi', model: 'Q4', price: 8_000_000 })
    const between = car({ make: 'Ford', model: 'Explorer', price: 6_500_000 })
    const below = car({ make: 'Skoda', model: 'Elroq', price: 5_500_000 })
    expect(
      closestToSelection([cheap, dear], 2, [below, between], none),
    ).toEqual([between, below])
  })

  it('never offers a selected car or another variant of its model', () => {
    const selected = car({})
    const sibling = car({ subModel: 'Long Range' })
    const other = car({ make: 'Skoda', model: 'Elroq', price: 9_000_000 })
    expect(
      closestToSelection([selected], 3, [selected, sibling, other], none),
    ).toEqual([other])
  })

  it('offers one variant of each other model', () => {
    const selected = car({})
    const a = car({ make: 'Skoda', model: 'Elroq', subModel: '85' })
    const b = car({ make: 'Skoda', model: 'Elroq', subModel: '60' })
    expect(closestToSelection([selected], 3, [a, b], none)).toEqual([b])
  })

  it('moves a car a selected car lists as similar ahead of one a little nearer', () => {
    const selected = car({})
    const nearer = car({ make: 'Skoda', model: 'Elroq', price: 6_100_000 })
    const listed = car({ make: 'Audi', model: 'Q4', price: 6_300_000 })
    const listedFor = (of: Car) => (of === selected ? [listed] : [])
    expect(
      closestToSelection([selected], 2, [nearer, listed], listedFor),
    ).toEqual([listed, nearer])
  })

  it('lets a list name only so much, so a far car it names stays behind', () => {
    const selected = car({})
    const near = car({ make: 'Skoda', model: 'Elroq', price: 6_100_000 })
    const far = car({ make: 'Audi', model: 'Q8', price: 14_000_000 })
    const listedFor = () => [far]
    expect(closestToSelection([selected], 2, [far, near], listedFor)).toEqual([
      near,
      far,
    ])
  })

  it('offers the nth best as the nth', () => {
    const selected = car({})
    const others = [6_900_000, 6_100_000, 6_500_000].map((price, index) =>
      car({ make: 'Make', model: `Model ${index}`, price }),
    )
    expect(
      closestToSelection([selected], 3, others, none).map((c) => c.price),
    ).toEqual([6_100_000, 6_500_000, 6_900_000])
  })

  it('offers nothing beside an empty selection', () => {
    expect(closestToSelection([], 3, [car({})], none)).toEqual([])
  })

  it('suggests a third and a fourth car that are on sale', () => {
    const [first, second] = cars
    const suggested = closestToSelection([first!, second!], 2)
    expect(suggested).toHaveLength(2)
    for (const other of suggested) expect(cars).toContain(other)
  })
})
