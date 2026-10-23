import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import carFilter from './carFilter'
import {
  MAX_INTENT_LENGTH,
  needsModel,
  parseFilterIntent,
  readsAsQuestion,
} from './filterIntent'

const read = (text: string) => parseFilterIntent(text).filters

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

  it('does not take a negated make as a wish for it', () => {
    expect(read('ekki Tesla')).toEqual({})
    expect(
      read('mig langar í fjórhjóladrifin rafbíl sem er ekki tesla'),
    ).toEqual({ drive: ['AWD'] })
    expect(read('Kia en ekki Tesla')).toEqual({ name: ['Kia'] })
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

  it('reads a model that is a number after its make', () => {
    expect(read('Polestar 4')).toEqual({ name: ['Polestar 4'] })
    expect(read('smart #5 eða smart 1')).toEqual({
      name: ['Smart #5', 'Smart #1'],
    })
    expect(read('Polestar 4 eða Kia')).toEqual({ name: ['Polestar 4', 'Kia'] })
    expect(read('4 Polestar')).toEqual({ name: ['Polestar'] })
  })

  // The name is applied as the list's filter, which reads it as part of a
  // label: "Polestar 4" there must not find the Polestar 4x of a later year
  it('reads each numbered model as a name that finds only that model', () => {
    const numbered = cars.filter((car) => /^#?\d+$/.test(car.model))
    expect(numbered.length).toBeGreaterThan(0)
    for (const car of numbered) {
      const { name } = read(`${car.make} ${car.model}`)
      expect(name).toEqual([`${car.make} ${car.model}`])
      const found = cars.filter(carFilter({ name }))
      expect(found.every((other) => other.model === car.model)).toBe(true)
    }
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

describe('readsAsQuestion', () => {
  it('reads a question by its first word or its question mark', () => {
    expect(readsAsQuestion('Hvaða bíl mælir þú með')).toBe(true)
    expect(readsAsQuestion('hvernig virkar rafbilastyrkurinn')).toBe(true)
    expect(readsAsQuestion('mæliru með Tesla eða Kia')).toBe(true)
    expect(readsAsQuestion('„Hvaða bíll dregur kerru“')).toBe(true)
    expect(readsAsQuestion('7 sæta undir 9 milljónum?')).toBe(true)
  })

  it('reads a wish as no question, however it is put', () => {
    expect(
      readsAsQuestion(
        'Ég vil bíl sem kemst yfir 600km, er awd og kostar ekki of mikið',
      ),
    ).toBe(false)
    expect(readsAsQuestion('fjórhjóladrif, 600')).toBe(false)
    expect(readsAsQuestion('Erum fimm í fjölskyldunni')).toBe(false)
    expect(readsAsQuestion('Má ekki kosta meira en 6.000.000')).toBe(false)
    expect(readsAsQuestion('Er að leita að jeppa sem dregur kerru')).toBe(false)
  })
})
