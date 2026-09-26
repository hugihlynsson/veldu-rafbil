import { describe, expect, it } from 'vitest'

import carFilter from './carFilter'
import { deriveCar, Car } from './cars'
import { NewCar } from '@/types'

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

  it('compares price after the grant', () => {
    // 9,400,000 after the grant, so a 9,500,000 limit keeps it.
    expect(keep({ price: 9_500_000 }, car({ price: 9_900_000 }))).toBe(true)
  })

  it('matches names on make, model and subModel together', () => {
    expect(keep({ name: ['model y'] }, car({}))).toBe(true)
    expect(keep({ name: ['long range'] }, car({}))).toBe(true)
    expect(keep({ name: ['polestar'] }, car({}))).toBe(false)
  })

  it('ignores case in a name', () => {
    expect(keep({ name: ['TESLA'] }, car({}))).toBe(true)
  })

  it('keeps a car matching any one of several names', () => {
    expect(keep({ name: ['kia', 'tesla'] }, car({}))).toBe(true)
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
