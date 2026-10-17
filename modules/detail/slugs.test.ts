import { describe, expect, it } from 'vitest'

import cars, { allCars } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPathOf } from './paths'
import { readSegment, resolveSlugs } from './slugs'

const [a, b, c] = cars
const slugsOf = (path: string) => path.split('/').slice(2)

describe('resolveSlugs', () => {
  it("reads a car's own address back as the car", () => {
    expect(resolveSlugs(slugsOf(carPathOf(a))).cars).toEqual([a])
  })

  it('reads several back as the cars, in their order', () => {
    expect(resolveSlugs([c, a, b].map(carSlug)).cars).toEqual([c, a, b])
  })

  it('is canonical as it is made', () => {
    const slugs = [b, a].map(carSlug)
    expect(resolveSlugs(slugs).slugs).toEqual(slugs)
  })

  it('names each car once', () => {
    const resolved = resolveSlugs([a, b, a].map(carSlug))
    expect(resolved.cars).toEqual([a, b])
    expect(resolved.slugs).toEqual([a, b].map(carSlug))
  })

  it('reads its slugs whatever their case', () => {
    expect(resolveSlugs([carSlug(a).toUpperCase()]).slugs).toEqual([carSlug(a)])
  })

  it('drops a slug no car has ever had', () => {
    expect(resolveSlugs(['no-such-car', carSlug(a)]).slugs).toEqual([
      carSlug(a),
    ])
  })

  it('follows a renamed car to its new slug', () => {
    const resolved = resolveSlugs(['old-name', carSlug(b)], {
      'old-name': carSlug(a),
    })
    expect(resolved.cars).toEqual([a, b])
    expect(resolved.slugs).toEqual([a, b].map(carSlug))
  })

  // Those no longer sold too, whose pages stay
  it('reads every car with a page', () => {
    for (const car of allCars) {
      expect(resolveSlugs([carSlug(car)]).cars).toEqual([car])
    }
  })
})

// The page and its share image both read their segment through it, and a
// throw there is a 500 where the address should be a 404
describe('readSegment', () => {
  it('decodes an escaped segment', () => {
    expect(readSegment('kia-ev3%2Dlong')).toBe('kia-ev3-long')
  })

  it('names no car, rather than throwing, when the escape is broken', () => {
    expect(readSegment('%E0')).toBe('%E0')
    expect(resolveSlugs([readSegment('%E0')]).cars).toEqual([])
  })
})
