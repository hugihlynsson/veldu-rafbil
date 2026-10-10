import { describe, expect, it } from 'vitest'

import {
  foldText,
  MAX_INTENT_LENGTH,
  needsModel,
  parseFilterIntent,
} from './filterIntent'

const read = (text: string) => parseFilterIntent(text).filters

describe('foldText', () => {
  it('spells the Icelandic letters out the way a keyboard without them does', () => {
    expect(foldText('Þriggja SÆTA, Ðö fjórhjóladrifinn')).toBe(
      'thriggja saeta, do fjorhjoladrifinn',
    )
  })
})

describe('parseFilterIntent', () => {
  it('reads a bound word only into the number it stands before', () => {
    expect(read('undir 10 milljónum 500 km drægni')).toEqual({
      price: 10_000_000,
      range: 500,
    })
  })

  it('reads a price in every way people write one', () => {
    expect(read('8.000.000 kr')).toEqual({ price: 8_000_000 })
    expect(read('8000000')).toEqual({ price: 8_000_000 })
    expect(read('8,5 milljónir')).toEqual({ price: 8_500_000 })
    expect(read('8.5 milljónir')).toEqual({ price: 8_500_000 })
    expect(read('9 mill')).toEqual({ price: 9_000_000 })
    expect(read('9 mill.')).toEqual({ price: 9_000_000 })
    expect(read('9 mill, awd')).toEqual({ price: 9_000_000, drive: ['AWD'] })
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
    expect(read('má ekki kosta meira en 6.000.000')).toEqual({
      price: 6_000_000,
    })
    expect(read('ekki fjórhjóladrif, undir 6 milljónum')).toEqual({
      price: 6_000_000,
    })
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

  it('reads when the car can be had, but never suggests it', () => {
    expect(parseFilterIntent('fáanlegur strax')).toEqual({
      filters: {},
      unread: [],
      numbers: [],
    })
  })

  it('leaves a number it cannot place for a model, as written', () => {
    expect(parseFilterIntent('kemst 600, 7 sæti, kostar 6,5').numbers).toEqual([
      '600',
      '6,5',
    ])
  })

  it('leaves a number spelled out for a model too', () => {
    expect(parseFilterIntent('við erum átta, 7 sæti').numbers).toEqual(['atta'])
  })

  it('leaves no number in kW or kWh for a model, but the word that asks', () => {
    expect(parseFilterIntent('200kw hleðsla, 80 kWh')).toMatchObject({
      unread: ['kw', 'kwh'],
      numbers: [],
    })
  })

  it('reads 0-100 as the sprint, not as two numbers', () => {
    expect(parseFilterIntent('0-100 á 5 sek')).toEqual({
      filters: { acceleration: 5 },
      unread: [],
      numbers: [],
    })
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

  it('is true when a number is left that no rule could place', () => {
    expect(needsModel(parseFilterIntent('undir 600'))).toBe(true)
  })
})
