import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import { carFigures } from './figures'

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
  towing: 1000,
  timeToCharge10To80: 31,
  power: 150,
}

const towingOf = (overrides: Partial<NewCar>) =>
  carFigures(deriveCar({ ...base, ...overrides })).find(
    (figure) => figure.key === 'towing',
  )

describe('carFigures', () => {
  // Two to a row on a phone, four from lg: a ninth would stand alone
  it('gives eight figures, power not among them', () => {
    const figures = carFigures(deriveCar(base))
    expect(figures).toHaveLength(8)
    expect(figures.map((figure) => figure.key)).not.toContain('power')
  })

  it('puts the power under the towing, horsepower and trailer on hover', () => {
    expect(towingOf({})).toEqual({
      key: 'towing',
      label: 'Dráttargeta',
      text: '1.000 kg',
      textTitle: 'hemlaður vagn',
      detail: '150 kW',
      detailTitle: '204 hö',
    })
  })

  it('still gives the power under a car that cannot tow', () => {
    expect(towingOf({ towing: 0 })).toMatchObject({
      text: 'Enginn krókur',
      textTitle: undefined,
      detail: '150 kW',
    })
  })

  it('leaves every other figure as the comparison has it', () => {
    const range = carFigures(deriveCar(base)).find((f) => f.key === 'range')
    expect(range).toEqual({
      key: 'range',
      label: 'Drægni',
      text: '600 km',
      detail: 'WLTP',
    })
  })
})
