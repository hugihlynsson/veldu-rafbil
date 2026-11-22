import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import { addReason } from './addReason'

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
  towing: 1000,
  groundClearance: null,
  timeToCharge10To80: 30,
  power: 150,
}

const car = (overrides: Partial<NewCar>) => deriveCar({ ...base, ...overrides })

const pair = [car({}), car({ make: 'Skoda', price: 7_000_000, range: 550 })]

describe('addReason', () => {
  it('names seats beyond any compared car first', () => {
    expect(addReason(car({ seats: 7, price: 5_000_000 }), pair)).toBe('7 sæti')
  })

  it('says how much cheaper than the cheapest, after the grant', () => {
    expect(addReason(car({ price: 5_350_000 }), pair)).toBe(
      '650.000 kr. ódýrari en báðir',
    )
  })

  it('says how much further than the furthest', () => {
    expect(addReason(car({ price: 8_000_000, range: 630 }), pair)).toBe(
      '80 km meiri drægni en báðir',
    )
  })

  it('counts three compared cars as all three', () => {
    const three = [...pair, car({ make: 'Audi', price: 7_500_000 })]
    expect(addReason(car({ price: 5_350_000 }), three)).toBe(
      '650.000 kr. ódýrari en allir þrír',
    )
  })

  it('names faster charging, as a share of the range a minute adds', () => {
    // 17,9 km a minute to the faster pair car's 12,8
    expect(
      addReason(
        car({ price: 8_000_000, range: 550, timeToCharge10To80: 21.5 }),
        pair,
      ),
    ).toBe('Hleðst 40% hraðar en báðir')
  })

  it('leaves charging out under a tenth faster', () => {
    expect(
      addReason(
        car({ price: 8_000_000, range: 550, timeToCharge10To80: 28 }),
        pair,
      ),
    ).toBeUndefined()
  })

  it('names towing only against figures that are known', () => {
    const heavier = car({ price: 8_000_000, towing: 2000 })
    expect(addReason(heavier, pair)).toBe('Dregur 1.000 kg meira en báðir')
    const unknown = [pair[0]!, car({ make: 'Skoda', towing: null })]
    expect(addReason(heavier, unknown)).toBeUndefined()
  })

  it('says a car between them on price and range is', () => {
    expect(addReason(car({ price: 6_500_000, range: 520 }), pair)).toBe(
      'Á milli þeirra í verði og drægni',
    )
  })

  it('calls a gap too small to tell them apart like them, not better', () => {
    expect(
      addReason(car({ price: 5_950_000, range: 510, towing: 1100 }), pair),
    ).toBe('Svipaður í verði og drægni')
  })

  it('calls a car a few percent past them on price and range like them', () => {
    expect(addReason(car({ price: 7_200_000, range: 560 }), pair)).toBe(
      'Svipaður í verði og drægni',
    )
  })

  it('gives no reason that is not one', () => {
    expect(addReason(car({ price: 9_000_000, range: 400 }), pair)).toBe(
      undefined,
    )
  })
})
