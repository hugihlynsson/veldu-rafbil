import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { comparisonTitle } from './comparison'

describe('comparisonTitle', () => {
  const kia = cars.find((car) => car.make === 'Kia')!
  const tesla = cars.find((car) => car.make === 'Tesla')!
  const skoda = cars.find((car) => car.make === 'Skoda')!

  it('asks between two', () => {
    expect(comparisonTitle([kia, tesla])).toBe(
      `Kia ${kia.model} eða Tesla ${tesla.model}?`,
    )
  })

  it('lists the rest before the last', () => {
    expect(comparisonTitle([kia, tesla, skoda])).toBe(
      `Kia ${kia.model}, Tesla ${tesla.model} eða Skoda ${skoda.model}?`,
    )
  })

  it('names the variant when two share a model', () => {
    const siblings = cars.filter(
      (car) => car.make === kia.make && car.model === kia.model,
    )
    expect(siblings.length).toBeGreaterThan(1)
    expect(comparisonTitle(siblings.slice(0, 2))).toBe(
      `${siblings[0].label} eða ${siblings[1].label}?`,
    )
  })
})
