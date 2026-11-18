import { describe, expect, it } from 'vitest'

import carFilter from './carFilter'
import type { Car } from '@/modules/data/cars'
import { deriveCar } from '@/modules/data/cars'
import { grantAmount, grantPriceCeiling } from '@/modules/data/globals'
import type { NewCar } from '@/modules/data/newCarSchema'
import type { Filters } from './filters'

const car = (over: Partial<NewCar>): Car =>
  deriveCar({
    make: 'Tesla',
    model: 'Model Y',
    subModel: 'Long Range',
    heroImageName: 'x',
    price: 8_000_000,
    sellerUrl: 'https://example.is',
    acceleration: 6,
    capacity: 75,
    range: 500,
    drive: 'AWD',
    seats: 5,
    towing: 1500,
    groundClearance: null,
    timeToCharge10To80: 25,
    power: 250,
    ...over,
  })

const keep = (filters: Parameters<typeof carFilter>[0], c: Car) =>
  carFilter(filters)(c)

describe('carFilter', () => {
  it('keeps everything when nothing is set', () => {
    expect(keep({}, car({}))).toBe(true)
  })

  it('treats the numeric filters as limits, not exact values', () => {
    expect(keep({ acceleration: 7 }, car({ acceleration: 6 }))).toBe(true)
    expect(keep({ acceleration: 5 }, car({ acceleration: 6 }))).toBe(false)
    expect(keep({ range: 400 }, car({ range: 500 }))).toBe(true)
    expect(keep({ range: 600 }, car({ range: 500 }))).toBe(false)
  })

  // "7+" has to keep the eight-seat vans, not just the exact sevens
  it('treats seats as a minimum', () => {
    expect(keep({ seats: 5 }, car({ seats: 5 }))).toBe(true)
    expect(keep({ seats: 7 }, car({ seats: 5 }))).toBe(false)
    expect(keep({ seats: 7 }, car({ seats: 8 }))).toBe(true)
  })

  it('treats towing as a minimum, and an unknown figure as none', () => {
    expect(keep({ towing: 1500 }, car({ towing: 1500 }))).toBe(true)
    expect(keep({ towing: 1600 }, car({ towing: 1500 }))).toBe(false)
    expect(keep({ towing: 750 }, car({ towing: 0 }))).toBe(false)
    expect(keep({ towing: 750 }, car({ towing: null }))).toBe(false)
  })

  it('compares price after the grant', () => {
    const listed = grantPriceCeiling - 100_000
    const limit = listed - grantAmount + 100_000
    expect(keep({ price: limit }, car({ price: listed }))).toBe(true)
  })

  it('matches names on make, model and subModel together', () => {
    expect(keep({ name: ['model y'] }, car({}))).toBe(true)
    expect(keep({ name: ['long range'] }, car({}))).toBe(true)
    expect(keep({ name: ['polestar'] }, car({}))).toBe(false)
  })

  it('ignores case in a name', () => {
    expect(keep({ name: ['TESLA'] }, car({}))).toBe(true)
  })

  it('ignores spaces and punctuation in a name', () => {
    expect(
      keep({ name: ['X peng'] }, car({ make: 'XPENG', model: 'G6' })),
    ).toBe(true)
    expect(
      keep({ name: ['id 4'] }, car({ make: 'Volkswagen', model: 'ID.4' })),
    ).toBe(true)
    expect(keep({ name: [' - '] }, car({}))).toBe(false)
  })

  it('keeps a car matching any one of several names', () => {
    expect(keep({ name: ['kia', 'tesla'] }, car({}))).toBe(true)
  })

  it('matches a make whole, in any case', () => {
    const mini = car({ make: 'Mini', model: 'Cooper' })
    expect(keep({ make: ['Mini'] }, mini)).toBe(true)
    expect(keep({ make: ['mini'] }, mini)).toBe(true)
    expect(keep({ make: ['Min'] }, mini)).toBe(false)
    expect(keep({ make: ['Kia', 'Mini'] }, mini)).toBe(true)
  })

  describe('a make and a name together', () => {
    const enyaq = car({ make: 'Skoda', model: 'Enyaq', subModel: '85' })
    const elroq = car({ make: 'Skoda', model: 'Elroq', subModel: '85' })
    const ev3 = car({
      make: 'Kia',
      model: 'EV3',
      subModel: 'Long Range',
      price: 5_000_000,
    })
    const modelY = car({})
    const list = [enyaq, elroq, ev3, modelY]
    const kept = (filters: Filters) =>
      list.filter(carFilter(filters, list)).map((c) => c.model)

    it('narrows the make to the model named', () => {
      expect(kept({ make: ['Skoda'], name: ['enyaq'] })).toEqual(['Enyaq'])
    })

    it('adds a model of a make not chosen', () => {
      expect(kept({ make: ['Kia'], name: ['model y'] })).toEqual([
        'EV3',
        'Model Y',
      ])
    })

    it('narrows only the make the name is of', () => {
      expect(kept({ make: ['Skoda', 'Kia'], name: ['enyaq'] })).toEqual([
        'Enyaq',
        'EV3',
      ])
    })

    it('keeps a word that finds a car of the make inside the make', () => {
      expect(kept({ make: ['Kia'], name: ['long range'] })).toEqual(['EV3'])
    })

    it('still applies the other filters', () => {
      expect(
        kept({ make: ['Kia'], name: ['model y'], price: 6_000_000 }),
      ).toEqual(['EV3'])
    })
  })

  it('matches any of the selected drives', () => {
    expect(keep({ drive: ['AWD', 'RWD'] }, car({ drive: 'AWD' }))).toBe(true)
    expect(keep({ drive: ['FWD'] }, car({ drive: 'AWD' }))).toBe(false)
  })

  it('splits available from expected on expectedDelivery', () => {
    const shipping = car({})
    const awaited = car({ expectedDelivery: 'sumar 2026' })
    expect(keep({ availability: 'available' }, shipping)).toBe(true)
    expect(keep({ availability: 'available' }, awaited)).toBe(false)
    expect(keep({ availability: 'expected' }, awaited)).toBe(true)
    expect(keep({ availability: 'expected' }, shipping)).toBe(false)
  })

  it('ands the filters together', () => {
    const subject = car({ range: 500, drive: 'AWD' })
    expect(keep({ range: 400, drive: ['AWD'] }, subject)).toBe(true)
    expect(keep({ range: 600, drive: ['AWD'] }, subject)).toBe(false)
  })
})
