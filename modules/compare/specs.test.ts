import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import { compareSpecs } from './specs'

const base: NewCar = {
  make: 'Kia',
  model: 'EV3',
  heroImageName: 'kia-ev3',
  price: 6_000_000,
  sellerUrl: 'https://kia.is',
  acceleration: 7.5,
  capacity: 81,
  range: 600,
  drive: 'FWD',
  seats: 5,
  timeToCharge10To80: 31,
  power: 150,
}

const car = (overrides: Partial<NewCar>) => deriveCar({ ...base, ...overrides })

const row = (key: string, ...compared: ReturnType<typeof car>[]) =>
  compareSpecs(compared).find((spec) => spec.key === key)

describe('compareSpecs', () => {
  it('puts the cheaper car ahead on price', () => {
    const cells = row(
      'price',
      car({ price: 7_000_000 }),
      car({ price: 6_000_000 }),
    )?.cells
    expect(cells?.map((cell) => cell.best)).toEqual([false, true])
  })

  it('puts the longer range ahead on range', () => {
    const cells = row('range', car({ range: 400 }), car({ range: 500 }))?.cells
    expect(cells?.map((cell) => cell.best)).toEqual([false, true])
  })

  it('puts the quicker car ahead, though its figure is the smaller', () => {
    const cells = row(
      'acceleration',
      car({ acceleration: 5.1 }),
      car({ acceleration: 8 }),
    )?.cells
    expect(cells?.map((cell) => cell.best)).toEqual([true, false])
  })

  it('puts nobody ahead on a tie all round', () => {
    const cells = row('range', car({}), car({}), car({}))?.cells
    expect(cells?.map((cell) => cell.best)).toEqual([false, false, false])
  })

  it('puts every car sharing the winning figure ahead', () => {
    const cells = row(
      'range',
      car({ range: 500 }),
      car({ range: 500 }),
      car({ range: 300 }),
    )?.cells
    expect(cells?.map((cell) => cell.best)).toEqual([true, true, false])
  })

  it('draws each bar against the largest figure', () => {
    const cells = row('range', car({ range: 300 }), car({ range: 600 }))?.cells
    expect(cells?.map((cell) => cell.share)).toEqual([0.5, 1])
  })

  it('ranks neither drive nor seats', () => {
    const compared = [car({ seats: 7, drive: 'AWD' }), car({})]
    for (const key of ['drive', 'seats']) {
      const cells = row(key, ...compared)?.cells
      expect(
        cells?.every((cell) => !cell.best && cell.share === undefined),
      ).toBe(true)
    }
  })

  it('shows delivery only when a compared car is still to come', () => {
    expect(row('delivery', car({}), car({}))).toBeUndefined()
    expect(
      row('delivery', car({}), car({ expectedDelivery: 'Sumar 2027' }))?.cells,
    ).toMatchObject([{ text: 'Í sölu' }, { text: 'Væntanlegur sumar 2027' }])
  })

  it('writes prices with the list grouping', () => {
    expect(
      row('price', car({ price: 6_490_000 }), car({}))?.cells[0],
    ).toMatchObject({ text: '5.990.000 kr.', detail: 'með styrk' })
  })
})
