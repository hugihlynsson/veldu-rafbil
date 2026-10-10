import { describe, expect, it } from 'vitest'

import { deriveCar, type Car } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import { parseFilterIntent } from './filterIntent'
import {
  MAX_SUGGESTIONS,
  rankSuggestions,
  readSuggestions,
  suggestionsFromFilters,
  type FilterSuggestion,
} from './filterSuggestions'

const car = (over: Partial<NewCar>): Car =>
  deriveCar({
    make: 'Make',
    model: 'Model',
    heroImageName: 'x',
    price: 8_000_000,
    sellerUrl: 'https://example.is',
    acceleration: 6,
    capacity: 75,
    range: 500,
    drive: 'FWD',
    seats: 5,
    timeToCharge10To80: 25,
    power: 250,
    ...over,
  })

const list = [
  car({ model: 'A', drive: 'AWD', seats: 7, price: 12_000_000 }),
  car({ model: 'B', drive: 'AWD', seats: 5, price: 7_000_000 }),
  car({ model: 'C', drive: 'FWD', seats: 5, price: 4_000_000 }),
]

const text = (
  suggestion: Pick<FilterSuggestion, 'key' | 'value'>,
): FilterSuggestion =>
  ({ ...suggestion, source: 'text', probability: 1 }) as FilterSuggestion
const model = (
  suggestion: Pick<FilterSuggestion, 'key' | 'value'>,
  probability: number,
): FilterSuggestion =>
  ({ ...suggestion, source: 'model', probability }) as FilterSuggestion

const ranked = (suggestions: FilterSuggestion[], current = {}) =>
  rankSuggestions(suggestions, current, list).suggestions.map(
    ({ key, count }) => [key, count],
  )

describe('rankSuggestions', () => {
  it('puts the text first, then the likeliest guess', () => {
    expect(
      ranked([
        model({ key: 'drive', value: ['AWD'] }, 0.7),
        model({ key: 'price', value: 7_500_000 }, 0.9),
        text({ key: 'seats', value: 5 }),
      ]),
    ).toEqual([
      ['seats', 3],
      ['price', 2],
      ['drive', 2],
    ])
  })

  it('offers what the text says even when it matches nothing', () => {
    expect(ranked([text({ key: 'price', value: 1_000_000 })])).toEqual([
      ['price', 0],
    ])
  })

  it('drops a guess that would leave the suggestions matching nothing', () => {
    expect(
      ranked([
        text({ key: 'seats', value: 7 }),
        model({ key: 'price', value: 7_500_000 }, 0.9),
      ]),
    ).toEqual([['seats', 1]])
  })

  it('drops a guess that narrows nothing', () => {
    expect(ranked([model({ key: 'seats', value: 5 }, 0.9)])).toEqual([])
  })

  it('skips what is already applied, and takes the text over a guess', () => {
    expect(
      ranked(
        [
          text({ key: 'drive', value: ['AWD'] }),
          text({ key: 'seats', value: 7 }),
          model({ key: 'seats', value: 5 }, 0.9),
        ],
        { drive: ['AWD'] },
      ),
    ).toEqual([['seats', 1]])
  })

  it('counts the suggestions together', () => {
    const { combined, count } = rankSuggestions(
      [
        text({ key: 'drive', value: ['AWD'] }),
        model({ key: 'price', value: 8_000_000 }, 0.8),
      ],
      {},
      list,
    )
    expect(combined).toEqual({ drive: ['AWD'], price: 8_000_000 })
    expect(count).toBe(1)
  })

  it('offers no more than fit, and adds together only those', () => {
    const { suggestions, combined } = rankSuggestions(
      [
        text({ key: 'drive', value: ['AWD'] }),
        text({ key: 'seats', value: 5 }),
        text({ key: 'price', value: 20_000_000 }),
        text({ key: 'range', value: 100 }),
        text({ key: 'acceleration', value: 20 }),
      ],
      {},
      list,
    )
    expect(suggestions).toHaveLength(MAX_SUGGESTIONS)
    expect(combined).not.toHaveProperty('acceleration')
  })

  it('keeps price, range and seats when the text says more than fits', () => {
    const { filters } = parseFilterIntent(
      '7 sæta fjórhjóladrifinn undir 10 milljónum 500 km drægni fáanlegur strax 15 km/min 0-100 undir 5 sek',
    )
    const { suggestions } = rankSuggestions(
      suggestionsFromFilters(filters, 'text'),
      {},
    )
    expect(suggestions.map(({ key }) => key)).toEqual([
      'price',
      'range',
      'seats',
      'drive',
    ])
  })
})

describe('readSuggestions', () => {
  it('keeps only what the filters themselves would read', () => {
    expect(
      readSuggestions({
        suggestions: [
          { key: 'price', value: 7_500_000.4, source: 'model', probability: 1 },
          { key: 'drive', value: ['XWD'], source: 'model', probability: 1 },
          { key: 'seats', value: -1, source: 'text', probability: 1 },
          { key: 'toString', value: 1, source: 'text', probability: 1 },
          { key: 'range', value: 400, source: 'oracle', probability: 1 },
          { key: 'range', value: 400, source: 'text', probability: 2 },
          null,
        ],
      }),
    ).toEqual([
      { key: 'price', value: 7_500_000, source: 'model', probability: 1 },
    ])
  })

  it('reads anything else as no suggestions', () => {
    expect(readSuggestions({ error: 'Too many requests' })).toEqual([])
    expect(readSuggestions(null)).toEqual([])
  })
})
