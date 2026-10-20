import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { foldText, nameMatcher, splitAtMakes } from './carNames'

describe('foldText', () => {
  it('spells the Icelandic letters out the way a keyboard without them does', () => {
    expect(foldText('Þriggja SÆTA, Ðö fjórhjóladrifinn')).toBe(
      'thriggja saeta, do fjorhjoladrifinn',
    )
  })
})

describe('nameMatcher', () => {
  const finds = (name: string, label: string) => nameMatcher(name)(label)

  it('ignores case, spaces and punctuation', () => {
    expect(finds('TESLA', 'Tesla Model Y')).toBe(true)
    expect(finds('X peng', 'XPENG G6 AWD Performance')).toBe(true)
    expect(finds('id 4', 'Volkswagen ID.4 GTX')).toBe(true)
    expect(finds('citroen', 'Citroën ë-C4')).toBe(true)
  })

  it('reads a make by what people call it', () => {
    expect(finds('Vw', 'Volkswagen ID.4 GTX')).toBe(true)
    expect(finds('vw id4', 'Volkswagen ID.4 GTX')).toBe(true)
    expect(finds('merc c 400', 'Mercedes-Benz C 400 4MATIC')).toBe(true)
    expect(finds('land rover', 'Range Rover Electric')).toBe(true)
  })

  it('finds a label with a word of it left out', () => {
    expect(finds('tesla y', 'Tesla Model Y Long Range')).toBe(true)
    expect(finds('polestar 4 dual', 'Polestar 4 Long Range Dual Motor')).toBe(
      true,
    )
  })

  // Out of order, or a word that only ends one in the label, is too loose a
  // reading to keep: "kia 5" would find every Kia with a 5 in its name
  it('needs each word to start one of the label, in its order', () => {
    expect(finds('y tesla', 'Tesla Model Y Long Range')).toBe(false)
    expect(finds('kia 5', 'Kia EV5 AWD')).toBe(false)
    expect(finds('tesla y', 'Tesla Model 3 Long Range')).toBe(false)
  })

  it('finds nothing with a name of punctuation', () => {
    expect(finds(' - ', 'Tesla Model Y')).toBe(false)
  })

  it('finds every car by its own label', () => {
    expect(
      cars
        .filter((car) => !finds(car.label, car.label))
        .map((car) => car.label),
    ).toEqual([])
  })
})

describe('splitAtMakes', () => {
  const makes = [...new Set(cars.map((car) => car.make))]

  it('cuts a name before each make it names', () => {
    expect(splitAtMakes(['Byd kia Tesla'], makes)).toEqual([
      'Byd',
      'kia',
      'Tesla',
    ])
    expect(splitAtMakes(['Tesla model y range rover'], makes)).toEqual([
      'Tesla model y',
      'range rover',
    ])
  })

  it('keeps a make and its model together', () => {
    expect(splitAtMakes(['Kia ev5 awd', 'Byd sealion'], makes)).toEqual([
      'Kia ev5 awd',
      'Byd sealion',
    ])
  })

  // A model or variant that named a make would be cut into names that each
  // match more than the car they were typed for
  it('keeps every car label whole', () => {
    const cut = cars.filter(
      (car) => splitAtMakes([car.label], makes).length !== 1,
    )
    expect(cut.map((car) => car.label)).toEqual([])
  })

  it('cuts before a make by what people call it', () => {
    expect(splitAtMakes(['Tesla vw'], makes)).toEqual(['Tesla', 'vw'])
  })

  it('leaves a list with no makes in it as it is', () => {
    expect(splitAtMakes(['model y', 'ioniq'], makes)).toEqual([
      'model y',
      'ioniq',
    ])
  })
})
