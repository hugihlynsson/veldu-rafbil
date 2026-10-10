import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import {
  comparisonPath,
  comparisonPathOf,
  comparisonTitle,
  MAX_COMPARED,
  resolveComparison,
} from './comparison'

const [a, b, c, d, e] = cars
const slugsOf = (path: string) => path.split('/').slice(2)

describe('a comparison URL', () => {
  it('reads back as the cars it was made from, in their order', () => {
    const compared = [c, a, b]
    expect(resolveComparison(slugsOf(comparisonPathOf(compared))).cars).toEqual(
      compared,
    )
  })

  it('is canonical as it is made', () => {
    const slugs = [b, a].map(carSlug)
    expect(resolveComparison(slugs).slugs).toEqual(slugs)
  })

  it('names each car once', () => {
    const resolved = resolveComparison([a, b, a].map(carSlug))
    expect(resolved.cars).toEqual([a, b])
    expect(resolved.slugs).toEqual([a, b].map(carSlug))
  })

  it('reads its slugs whatever their case', () => {
    expect(resolveComparison([carSlug(a).toUpperCase()]).slugs).toEqual([
      carSlug(a),
    ])
  })

  it(`stops at ${MAX_COMPARED} cars`, () => {
    expect(resolveComparison([a, b, c, d, e].map(carSlug)).cars).toEqual([
      a,
      b,
      c,
      d,
    ])
  })

  it('drops a slug no car has ever had', () => {
    expect(resolveComparison(['no-such-car', carSlug(a)]).slugs).toEqual([
      carSlug(a),
    ])
  })

  it('follows a renamed car to its new slug', () => {
    const resolved = resolveComparison(['old-name', carSlug(b)], {
      'old-name': carSlug(a),
    })
    expect(resolved.cars).toEqual([a, b])
    expect(resolved.slugs).toEqual([a, b].map(carSlug))
  })

  it('keeps a gone car in the path and counts it', () => {
    const resolved = resolveComparison([carSlug(a), 'gone', carSlug(b)], {
      gone: null,
    })
    expect(resolved).toEqual({
      cars: [a, b],
      slugs: [carSlug(a), 'gone', carSlug(b)],
      goneCount: 1,
    })
  })

  it('starts with the comparison path', () => {
    expect(comparisonPath(['x', 'y'])).toBe('/samanburdur/x/y')
  })
})

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
