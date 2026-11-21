import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import carFilter from './carFilter'
import { bodyTypeOf, bodyTypes } from './bodyTypes'
import { parseFilterIntent } from './filterIntent'
import { getFiltersFromQuery, serializeFilters } from './query'
import {
  millionsText,
  presetMatches,
  presets,
  pricePresets,
  quickToggleOn,
  quickToggles,
  searchSummary,
  toggledQuick,
} from './search'

const count = (filters: Parameters<typeof carFilter>[0]) =>
  cars.filter(carFilter(filters)).length

describe('the body types', () => {
  it('know every car on the list', () => {
    expect(cars.filter((car) => !bodyTypeOf(car)).map((car) => car.id)).toEqual(
      [],
    )
  })

  it.each(bodyTypes)('find cars for %s', (type) => {
    expect(count({ body: [type] })).toBeGreaterThan(0)
  })

  it('round-trip through the URL in Icelandic', () => {
    const query = serializeFilters({ body: ['suv', 'compactSuv'] })
    expect(query).toContain('gerd=jepplingur,jeppi')
    expect(
      getFiltersFromQuery(Object.fromEntries(new URLSearchParams(query))),
    ).toEqual({ body: ['compactSuv', 'suv'] })
  })

  it('drop a word the URL does not know', () => {
    expect(getFiltersFromQuery({ gerd: 'skip' })).toEqual({})
  })

  it.each([
    ['jeppi 4x4 undir 8 millj', ['suv']],
    ['lítill jepplingur', ['compactSuv']],
    ['SUV fyrir fjölskylduna', ['compactSuv', 'suv']],
    ['skutbíll', ['estate']],
    ['ekki jeppi', undefined],
  ])('are read from "%s"', (text, body) => {
    expect(parseFilterIntent(text).filters.body).toEqual(body)
  })
})

describe('millionsText', () => {
  it.each([
    [8_000_000, '8 m.kr'],
    [6_500_000, '6,5 m.kr'],
    [12_340_000, '12,3 m.kr'],
  ])('writes %i as %s', (kronur, text) => {
    expect(millionsText(kronur)).toBe(text)
  })
})

describe('pricePresets', () => {
  const steps = pricePresets(cars)

  it('climbs in half millions', () => {
    expect(steps.length).toBeGreaterThan(1)
    expect(steps.every((step) => step % 500_000 === 0)).toBe(true)
    expect([...steps].sort((a, b) => a - b)).toEqual(steps)
  })

  it('leaves cars at every step', () => {
    steps.forEach((price) => expect(count({ price })).toBeGreaterThan(0))
  })
})

describe('presets', () => {
  const list = presets(cars)

  it.each(list.map((preset) => [preset.label, preset]))(
    '%s leaves cars on the list',
    (_label, preset) => {
      expect(count(preset.filters)).toBeGreaterThan(0)
    },
  )

  it('match the state they set, and only that', () => {
    const [family, suv] = list
    expect(presetMatches(family!, family!.filters, family!.sorting)).toBe(true)
    expect(presetMatches(family!, suv!.filters, family!.sorting)).toBe(false)
    expect(
      presetMatches(family!, family!.filters, {
        sorting: 'range',
        direction: 'desc',
      }),
    ).toBe(false)
  })

  it('are no match for the list as it arrives', () => {
    const arrival = { sorting: 'price', direction: 'asc' } as const
    expect(list.filter((preset) => presetMatches(preset, {}, arrival))).toEqual(
      [],
    )
  })
})

describe('quick toggles', () => {
  it.each(quickToggles.map((toggle) => [toggle.label, toggle]))(
    '%s switches on and off, keeping the rest',
    (_label, toggle) => {
      const on = toggledQuick(toggle, { drive: ['AWD'] })
      expect(quickToggleOn(toggle, on)).toBe(true)
      expect(on.drive).toEqual(['AWD'])
      expect(toggledQuick(toggle, on)).toEqual({ drive: ['AWD'] })
    },
  )
})

describe('searchSummary', () => {
  it('is empty for no search', () => {
    expect(searchSummary({})).toEqual([])
  })

  it('reads the big three and counts the rest', () => {
    expect(
      searchSummary({
        price: 8_000_000,
        body: ['suv'],
        drive: ['AWD'],
        seats: 7,
        towing: 1500,
      }),
    ).toEqual(['Undir 8 m.kr', 'Jeppi', 'Fjórhjóladrif', '+2 síur'])
  })

  it('counts makes past two rather than listing them', () => {
    expect(searchSummary({ make: ['Kia', 'Tesla', 'BYD'] })).toEqual([
      '3 merki',
    ])
  })
})
