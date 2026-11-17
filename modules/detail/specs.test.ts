import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import { carFigures, specRows } from './specs'

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
  towing: 1500,
  timeToCharge10To80: 31,
  power: 150,
}

const car = (overrides: Partial<NewCar>) => deriveCar({ ...base, ...overrides })

const row = (key: string, ...compared: ReturnType<typeof car>[]) =>
  specRows(compared).find((spec) => spec.key === key)

describe('specRows', () => {
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

  it('does not rank seats', () => {
    const compared = [car({ seats: 7 }), car({})]
    expect(row('seats', ...compared)?.cells.every((cell) => !cell.best)).toBe(
      true,
    )
  })

  it('gives towing in kg on a braked trailer, unranked', () => {
    const cells = row('towing', car({ towing: 2500 }), car({}))?.cells
    expect(cells?.[0]).toMatchObject({
      text: '2.500 kg',
      detail: 'Hemluð',
    })
    expect(cells?.every((cell) => !cell.best)).toBe(true)
  })

  it('tells a car that takes no towbar from one with no figure', () => {
    expect(row('towing', car({ towing: 0 }))?.cells[0]).toEqual({
      text: 'Enginn krókur',
      detail: undefined,
      best: false,
    })
    expect(row('towing', car({ towing: null }))?.cells[0]?.text).toBe('Óþekkt')
  })

  it('gives the horsepower under the power', () => {
    expect(row('power', car({ power: 150 }))?.cells[0]?.detail).toBe('204 hö')
  })

  it('gives the drive a row of its own, unranked', () => {
    const cells = row('drive', car({ drive: 'AWD' }), car({}))?.cells
    expect(cells?.[0]).toMatchObject({ text: 'AWD', detail: 'Fjórhjóladrif' })
    expect(cells?.every((cell) => !cell.best)).toBe(true)
  })

  it('writes prices with the list grouping', () => {
    expect(
      row('price', car({ price: 6_390_000 }), car({}))?.cells[0],
    ).toMatchObject({ text: '5.990.000 kr.', detail: 'með styrk' })
  })
})

describe('carFigures', () => {
  const clearance = (overrides: Partial<NewCar>) =>
    carFigures(car(overrides)).find(({ key }) => key === 'groundClearance')

  it('gives the ground clearance in mm, and says when it is a raised level', () => {
    expect(clearance({ groundClearance: { mm: 180 } })?.cells[0]).toEqual({
      text: '180 mm',
      detail: undefined,
      best: false,
    })
    expect(
      clearance({ groundClearance: { mm: 240, adjustable: true } })?.cells[0]
        ?.detail,
    ).toBe('Hæsta stilling')
  })

  it('leaves the figure out for a car without one', () => {
    expect(clearance({})).toBeUndefined()
  })

  // Too few cars have one for a row of mostly gaps
  it('keeps the ground clearance out of a comparison', () => {
    const withIt = car({ groundClearance: { mm: 200 } })
    expect(specRows([withIt, withIt]).map(({ key }) => key)).not.toContain(
      'groundClearance',
    )
  })
})
