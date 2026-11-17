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
  const drive = (overrides: Partial<NewCar>) =>
    carFigures(car(overrides)).find(({ key }) => key === 'drive')?.cells[0]

  it('gives the ground clearance under the drive', () => {
    expect(drive({ drive: 'AWD', groundClearance: { mm: 180 } })).toEqual({
      text: 'AWD',
      detail: 'Fjórhjóladrif · veghæð\u00a0180\u00a0mm',
      best: false,
    })
  })

  it('says "up to" for a raised air-suspension level', () => {
    expect(
      drive({ drive: 'AWD', groundClearance: { mm: 240, adjustable: true } })
        ?.detail,
    ).toBe('Fjórhjóladrif · veghæð\u00a0allt\u00a0að\u00a0240\u00a0mm')
  })

  it('leaves the drive as it is for a car without one', () => {
    expect(drive({ drive: 'AWD' })?.detail).toBe('Fjórhjóladrif')
  })

  it('adds no figure of its own, so the page keeps its eight', () => {
    const withIt = car({ groundClearance: { mm: 200 } })
    expect(carFigures(withIt).map(({ key }) => key)).toEqual(
      specRows([withIt]).map(({ key }) => key),
    )
  })

  // Too few cars have one for a row of mostly gaps
  it('keeps the ground clearance out of a comparison', () => {
    const withIt = car({ groundClearance: { mm: 200 } })
    expect(
      specRows([withIt, withIt]).flatMap(({ cells }) =>
        cells.map((cell) => cell.detail),
      ),
    ).not.toContain('Fjórhjóladrif · veghæð\u00a0200\u00a0mm')
  })
})
