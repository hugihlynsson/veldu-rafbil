import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { newCarSchema } from '@/modules/data/newCarSchema'
import carFilter from './carFilter'
import {
  MAX_GROUND_CLEARANCE,
  MAX_INTENT_LENGTH,
  MAX_TOWING,
  MIN_GROUND_CLEARANCE,
  MIN_TOWING,
  needsModel,
  parseFilterIntent,
  readGroundClearance,
  readsAsQuestion,
  readTowing,
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
      range: 500,
    })
  })

  // No filter holds either any more, and a bare 8.2 would be offered as an
  // acceleration: "Hvað þýðir 8,2 km/min" once became a filter
  it('takes a charging rate or a price per km as no number at all', () => {
    expect(parseFilterIntent('8,2 km/min')).toMatchObject({
      filters: {},
      numbers: [],
    })
    expect(parseFilterIntent('12.000 kr/km')).toMatchObject({
      filters: {},
      numbers: [],
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
    expect(read('Kia en ekki Tesla')).toEqual({ make: ['Kia'] })
  })

  it('keeps every drive asked for', () => {
    expect(read('afturhjóladrif eða fjórhjóladrif')).toEqual({
      drive: ['AWD', 'RWD'],
    })
  })

  it('reads a make, inflected', () => {
    expect(read('Kia')).toEqual({ make: ['Kia'] })
    expect(read('Polestarinn')).toEqual({ make: ['Polestar'] })
  })

  it('reads a model that is a number after its make', () => {
    expect(read('Polestar 4')).toEqual({ name: ['Polestar 4'] })
    expect(read('smart #5 eða smart 1')).toEqual({
      name: ['Smart #5', 'Smart #1'],
    })
    expect(read('Polestar 4 eða Kia')).toEqual({
      make: ['Kia'],
      name: ['Polestar 4'],
    })
    expect(read('4 Polestar')).toEqual({ make: ['Polestar'] })
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

  it('reads a towing weight however it is written', () => {
    expect(read('1500 kg dráttargeta')).toEqual({ towing: 1500 })
    expect(read('dráttargeta að minnsta kosti 1800')).toEqual({ towing: 1800 })
    expect(read('getur dregið 1,5 tonn')).toEqual({ towing: 1500 })
    expect(read('dregur 1.600 kg')).toEqual({ towing: 1600 })
    expect(read('kerra 750 kg')).toEqual({ towing: 750 })
  })

  // "dráttargeta 2" says nothing else
  it('reads a towing number under ten as tonnes', () => {
    expect(read('dráttargeta 1,5')).toEqual({ towing: 1500 })
    expect(read('dráttargeta 2 og undir 8 milljónum')).toEqual({
      price: 8_000_000,
      towing: 2000,
    })
  })

  // Left for a model, which can tell a horse trailer from two tonnes
  it('reads no tonnes from a number that counts what follows it', () => {
    expect(read('draga 2 hesta').towing).toBeUndefined()
    expect(read('dregur 2 kerrur').towing).toBeUndefined()
  })

  // A unit left over is a word for a model, and a billed request
  it('reads the unit after a towing number with it, however inflected', () => {
    expect(parseFilterIntent('dráttargeta 2 tonna')).toEqual({
      filters: { towing: 2000 },
      unread: [],
      numbers: [],
    })
    expect(parseFilterIntent('dregur 1500 kílógrömm').unread).toEqual([])
  })

  // A misread is offered as certain, and a wrong filter empties the list
  it('reads no towing from a number that is some other figure', () => {
    for (const text of [
      'dráttarkrókur og 500 lítra skott',
      'dráttarkrók og 400 hestöfl',
      'dregur vel og kostar 2000',
      'léttur bíll, um 1500 kg',
      'burðargeta 500 kg',
      '150 kg á þakið',
    ]) {
      expect(read(text).towing, text).toBeUndefined()
    }
  })

  it('reads a negated floor or ceiling the way it points', () => {
    expect(read('dráttargeta ekki minni en 1500')).toEqual({ towing: 1500 })
    expect(read('dráttargeta ekki meira en 1500')).toEqual({})
    expect(read('dregur ekki 1500 kg').towing).toBeUndefined()
  })

  it('drops a towing ceiling, as no filter holds one', () => {
    expect(read('dráttargeta undir 1000 kg')).toEqual({})
  })

  // Unlike "drægni", which every car has: plenty tow nothing
  it('leaves "dráttargeta" alone for a model', () => {
    expect(parseFilterIntent('dráttargeta').unread).toEqual(['drattargeta'])
  })

  it('reads a ground clearance in mm or cm', () => {
    expect(read('veghæð 200 mm')).toEqual({ groundClearance: 200 })
    expect(read('veghæð minnst 18 cm')).toEqual({ groundClearance: 180 })
    expect(read('veghaed 17,5 sm')).toEqual({ groundClearance: 175 })
    expect(read('veghæð að minnsta kosti 190')).toEqual({
      groundClearance: 190,
    })
    expect(read('20 cm veghæð og fjórhjóladrif')).toEqual({
      groundClearance: 200,
      drive: ['AWD'],
    })
  })

  // Nobody means 20 mm, which no car sits at
  it('reads a clearance number too small for mm as cm', () => {
    expect(read('veghæð 20')).toEqual({ groundClearance: 200 })
    expect(read('veghæð 20 og undir 9 milljónum')).toEqual({
      price: 9_000_000,
      groundClearance: 200,
    })
  })

  // A unit or a clearance word left over is a word for a model
  it('reads the whole of a clearance, leaving nothing for a model', () => {
    for (const text of ['veghæð 18 cm', '200 mm veghæð', 'veghæðin 190 mm']) {
      expect(parseFilterIntent(text), text).toEqual({
        filters: {
          groundClearance: readGroundClearance(
            text.match(/\d+/)![0],
            text.includes('cm') ? 'cm' : 'mm',
          ),
        },
        unread: [],
        numbers: [],
      })
    }
  })

  it('reads a clearance with its unit written onto the number', () => {
    expect(parseFilterIntent('veghæð yfir 200mm')).toEqual({
      filters: { groundClearance: 200 },
      unread: [],
      numbers: [],
    })
  })

  it('reads "hærri en" as a floor', () => {
    expect(read('veghæð hærri en 180')).toEqual({ groundClearance: 180 })
  })

  it('reads a length beside "hátt undir" as a clearance', () => {
    expect(read('hátt undir bílinn, minnst 20 cm')).toEqual({
      groundClearance: 200,
    })
  })

  it('reads no clearance from a length that is about something else', () => {
    expect(read('veghæð 20 tommu felgur').groundClearance).toBeUndefined()
    expect(read('20 cm').groundClearance).toBeUndefined()
    expect(read('veghæð og 500 km drægni')).toEqual({ range: 500 })
    expect(read('veghæð 400 km').groundClearance).toBeUndefined()
  })

  it('reads a clearance ceiling as no filter, and a negated floor as one', () => {
    expect(read('veghæð undir 150 mm')).toEqual({})
    expect(read('veghæð ekki minni en 180')).toEqual({ groundClearance: 180 })
  })

  // Its "undir" asks for more height, so it is no ceiling
  it('reads a length after "hátt undir" as a floor', () => {
    expect(read('hátt undir 200 mm')).toEqual({ groundClearance: 200 })
    expect(read('þarf hátt undir, 20 cm')).toEqual({ groundClearance: 200 })
    expect(read('hátt undir hann, veghæð 190')).toEqual({
      groundClearance: 190,
    })
  })

  // A word left over is a billed request, though the number was read
  it('reads "hærri en" and "lægri en" whole', () => {
    expect(parseFilterIntent('drægni hærri en 400 km')).toEqual({
      filters: { range: 400 },
      unread: [],
      numbers: [],
    })
    expect(parseFilterIntent('veghæð hærri en 180').unread).toEqual([])
  })

  it('leaves "veghæð" alone for a model', () => {
    expect(parseFilterIntent('mikil veghæð').unread).toEqual([
      'mikil',
      'veghaed',
    ])
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

// The parser and the suggestions both read towing through this, so one bound
// cannot drift from the other
describe('readTowing', () => {
  it('takes a number between the bounds, in kg or tonnes', () => {
    expect(readTowing(String(MIN_TOWING))).toBe(MIN_TOWING)
    expect(readTowing(String(MAX_TOWING))).toBe(MAX_TOWING)
    expect(readTowing(String(MIN_TOWING - 1))).toBeUndefined()
    expect(readTowing(String(MAX_TOWING + 1))).toBeUndefined()
    expect(readTowing('1,5')).toBe(1500)
    expect(readTowing('1.500')).toBe(1500)
  })

  // "við erum þrjú með hjólhýsi" would otherwise be offered 3,000 kg
  it('reads no tonnes from a number spelled out', () => {
    expect(readTowing('thrju')).toBeUndefined()
    expect(readTowing('tveir')).toBeUndefined()
  })

  it('reads a weight with its unit by the same bounds', () => {
    expect(read(`${MIN_TOWING - 1} kg kerra`)).toEqual({})
    expect(read(`${MIN_TOWING} kg kerra`)).toEqual({ towing: MIN_TOWING })
  })
})

// The parser and the suggestions read a clearance through this, so the bounds
// cannot drift apart
describe('readGroundClearance', () => {
  it('keeps to the bounds the car data is held to', () => {
    const at = (mm: number) =>
      newCarSchema.shape.groundClearance.safeParse({ mm }).success
    expect(at(MIN_GROUND_CLEARANCE)).toBe(true)
    expect(at(MIN_GROUND_CLEARANCE - 1)).toBe(false)
    expect(at(MAX_GROUND_CLEARANCE)).toBe(true)
    expect(at(MAX_GROUND_CLEARANCE + 1)).toBe(false)
  })

  it('takes a height between the bounds, in mm or cm', () => {
    expect(readGroundClearance(String(MIN_GROUND_CLEARANCE))).toBe(
      MIN_GROUND_CLEARANCE,
    )
    expect(readGroundClearance(String(MAX_GROUND_CLEARANCE))).toBe(
      MAX_GROUND_CLEARANCE,
    )
    expect(
      readGroundClearance(String(MIN_GROUND_CLEARANCE - 1)),
    ).toBeUndefined()
    expect(
      readGroundClearance(String(MAX_GROUND_CLEARANCE + 1)),
    ).toBeUndefined()
    expect(readGroundClearance('18', 'cm')).toBe(180)
    expect(readGroundClearance('18', 'mm')).toBeUndefined()
    expect(readGroundClearance('18,5', 'sentimetrar')).toBe(185)
  })
})
