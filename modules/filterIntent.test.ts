import { describe, expect, it } from 'vitest'

import { deriveCar, Car } from './cars'
import {
  FilterSuggestion,
  foldText,
  MAX_INTENT_LENGTH,
  needsModel,
  parseFilterIntent,
  rankSuggestions,
  readSuggestions,
} from './filterIntent'
import { NewCar } from '@/types'

const read = (text: string) => parseFilterIntent(text).filters

describe('foldText', () => {
  it('spells the Icelandic letters out the way a keyboard without them does', () => {
    expect(foldText('Þriggja SÆTA, Ðö fjórhjóladrifinn')).toBe(
      'thriggja saeta, do fjorhjoladrifinn',
    )
  })
})

describe('parseFilterIntent', () => {
  it('reads a price in every way people write one', () => {
    expect(read('8.000.000 kr')).toEqual({ price: 8_000_000 })
    expect(read('8000000')).toEqual({ price: 8_000_000 })
    expect(read('8,5 milljónir')).toEqual({ price: 8_500_000 })
    expect(read('8.5 milljónir')).toEqual({ price: 8_500_000 })
    expect(read('8 millur')).toEqual({ price: 8_000_000 })
    expect(read('7500 þúsund')).toEqual({ price: 7_500_000 })
  })

  // There is no lowest price to filter on, and a ceiling it is not
  it('drops a price that is a floor', () => {
    expect(read('yfir 5 milljónum')).toEqual({})
    expect(read('meira en 5 milljónir')).toEqual({})
  })

  it('reads "ekki yfir" as a ceiling and "ekki undir" as a floor', () => {
    expect(read('ekki yfir 7 milljónir')).toEqual({ price: 7_000_000 })
    expect(read('ekki undir 400 km')).toEqual({ range: 400 })
    expect(read('undir 300 km')).toEqual({})
  })

  it('keeps a number with a unit for the filter the unit belongs to', () => {
    expect(read('undir 5 sek, 15 km/min, 500 km, 12.000 kr/km')).toEqual({
      acceleration: 5,
      fastcharge: 15,
      range: 500,
      value: 12_000,
    })
  })

  it('reads a range with no unit after the word for it', () => {
    expect(read('drægni yfir 450')).toEqual({ range: 450 })
  })

  it('leaves a number that is implausible for its unit', () => {
    expect(read('12 sæti')).toEqual({})
    expect(read('5000 km')).toEqual({})
  })

  it('does not take a negated drive as a wish for it', () => {
    expect(read('ekki fjórhjóladrifinn')).toEqual({})
    expect(read('án fjórhjóladrifs')).toEqual({})
  })

  it('keeps every drive asked for', () => {
    expect(read('afturhjóladrif eða fjórhjóladrif')).toEqual({
      drive: ['AWD', 'RWD'],
    })
  })

  it('reads a make, inflected', () => {
    expect(read('Kia')).toEqual({ name: ['Kia'] })
    expect(read('Polestarinn')).toEqual({ name: ['Polestar'] })
  })

  it('does not read a bare digit as a model called "3"', () => {
    expect(read('Model 3')).toEqual({ name: ['Model 3'] })
    expect(read('3 börn')).toEqual({})
  })

  it('only reads the first sentence or two', () => {
    const long = `${'a'.repeat(MAX_INTENT_LENGTH)} 7 sæti`
    expect(read(long)).toEqual({})
  })
})

describe('needsModel', () => {
  it('is false when only filler is left over', () => {
    expect(needsModel(parseFilterIntent('mig vantar rafbíl með 7 sætum'))).toBe(
      false,
    )
  })

  it('is true when a word could mean a filter', () => {
    const parsed = parseFilterIntent('ódýr fjölskyldubíll með 7 sætum')
    expect(parsed.unread).toEqual(['odyr', 'fjolskyldubill'])
    expect(needsModel(parsed)).toBe(true)
  })
})

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
