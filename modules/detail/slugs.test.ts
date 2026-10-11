import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPathOf } from './paths'
import { resolveSlugs } from './slugs'

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

  it('stops at the most the page shows', () => {
    expect(resolveSlugs([a, b, c].map(carSlug), 2).cars).toEqual([a, b])
  })

  it('drops a slug no car has ever had', () => {
    expect(resolveSlugs(['no-such-car', carSlug(a)]).slugs).toEqual([
      carSlug(a),
    ])
  })

  it('follows a renamed car to its new slug', () => {
    const resolved = resolveSlugs(['old-name', carSlug(b)], Infinity, {
      'old-name': carSlug(a),
    })
    expect(resolved.cars).toEqual([a, b])
    expect(resolved.slugs).toEqual([a, b].map(carSlug))
  })

  it('keeps a gone car in the path and counts it', () => {
    const resolved = resolveSlugs([carSlug(a), 'gone', carSlug(b)], Infinity, {
      gone: null,
    })
    expect(resolved).toEqual({
      cars: [a, b],
      slugs: [carSlug(a), 'gone', carSlug(b)],
      goneCount: 1,
    })
  })
})
