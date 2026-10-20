import { describe, expect, it } from 'vitest'

import cars, { deriveCar } from '@/modules/data/cars'
import { grantPriceCeiling, nextGrant } from '@/modules/data/globals'
import newCars from '@/modules/data/newCars'
import type { NewCar } from '@/modules/data/newCarSchema'
import { grantChangeNotice } from './grantChange'

const car = (over: Partial<NewCar>) =>
  deriveCar({
    ...newCars[0]!,
    expectedDelivery: undefined,
    deprecated: undefined,
    ...over,
  })

describe('grantChangeNotice', () => {
  it('gives the price without the grant to a car that loses it', () => {
    const notice = grantChangeNotice(car({ price: 8_290_000 }))
    expect(notice?.title).toBe('Styrkurinn fellur niður 1. nóvember')
    expect(notice?.text).toContain('þá kostar þessi 8.290.000 kr.')
    expect(notice?.text).toContain('fyrir mánaðamót')
  })

  it('gives the price after the smaller grant to a car that keeps one', () => {
    const notice = grantChangeNotice(car({ price: 6_490_000 }))
    expect(notice?.title).toBe('Styrkurinn lækkar 1. nóvember')
    expect(notice?.text).toContain('400.000 kr.')
    expect(notice?.text).toContain('þá kostar þessi 6.090.000 kr.')
  })

  it('says nothing of a car the grant never reached', () => {
    expect(grantChangeNotice(car({ price: grantPriceCeiling }))).toBeUndefined()
  })

  it('says nothing of a car no longer sold', () => {
    expect(
      grantChangeNotice(car({ price: 6_490_000, deprecated: '2026-10-01' })),
    ).toBeUndefined()
  })

  // Its price already reads the next grant, so there is no new price to give
  it('explains the price of a car still to arrive', () => {
    const under = car({ price: 6_490_000, expectedDelivery: 'lok 2026' })
    expect(grantChangeNotice(under)?.text).toContain('eftir 400.000 kr. styrk')

    const over = car({
      price: nextGrant.priceCeiling + 100_000,
      expectedDelivery: 'lok 2026',
    })
    expect(grantChangeNotice(over)?.text).toContain('án styrks')
  })

  it('says nothing of a car still to arrive that no grant reaches', () => {
    expect(
      grantChangeNotice(
        car({ price: grantPriceCeiling, expectedDelivery: 'lok 2026' }),
      ),
    ).toBeUndefined()
  })

  it('reaches every car on sale whose price the change moves', () => {
    for (const each of cars.filter((c) => c.hasGrant && !c.expectedDelivery)) {
      expect(grantChangeNotice(each), each.id).toBeDefined()
    }
  })
})
