import { describe, expect, it } from 'vitest'

import { findMentionedCars, getRandomSuggestions } from './chatHelpers'
import cars from './cars'

describe('findMentionedCars', () => {
  const labels = (text: string) =>
    findMentionedCars(text).map((car) => car.label)

  it('finds a car by its full name', () => {
    expect(
      labels('Ég myndi skoða Kia EV3 Long Range, hann dregur langt.'),
    ).toEqual(['Kia EV3 Long Range'])
  })

  it('finds every car in the list by its own label, and nothing else', () => {
    for (const car of cars) {
      expect(findMentionedCars(`Skoðaðu ${car.label}.`)).toEqual([car])
    }
  })

  it('does not care about case', () => {
    expect(labels('KIA EV3 LONG RANGE')).toEqual(['Kia EV3 Long Range'])
  })

  it('finds nothing in text that names no car', () => {
    expect(
      labels('Hvar er best að hlaða? Heima á 11 kW, 3 til 4 klst.'),
    ).toEqual([])
  })

  it('never returns the same car twice', () => {
    const found = findMentionedCars(
      'Kia EV3 Long Range er góður. Aftur: Kia EV3 Long Range, EV3 Long Range.',
    )
    expect(found).toHaveLength(1)
  })

  it('finds a model named without its make', () => {
    expect(
      labels('Model Y er rúmbetri en flestir í þessum verðflokki.'),
    ).toEqual([
      'Tesla Model Y Standard Range',
      'Tesla Model Y Premium Long Range',
      'Tesla Model Y Long Range Dual Motor',
      'Tesla Model Y Performance',
    ])
    expect(labels('EV3 er sá sem ég myndi skoða fyrst.')).toEqual([
      'Kia EV3 Standard Range',
      'Kia EV3 Long Range',
      'Kia EV3 Long Range AWD',
    ])
    expect(labels('ID.4 GTX er fjórhjóladrifinn.')).toEqual([
      'Volkswagen ID.4 GTX',
    ])
    expect(labels('Af Teslunum er Model 3 Performance sneggstur.')).toEqual([
      'Tesla Model 3 Performance',
    ])
  })

  it('needs the make for a model that is a number, a letter or another make’s too', () => {
    expect(labels('Hann tekur 5 í sæti og hleður á 3 klst.')).toEqual([])
    expect(labels('Drægnin minnkar undir 0 C.')).toEqual([])
    expect(labels('Polestar 3 er með meiri drægni en Model 3.')).toEqual([
      'Polestar 3',
      'Tesla Model 3 Afturhjóladrif',
      'Tesla Model 3 Long Range Afturhjóladrif',
      'Tesla Model 3 Long Range Fjórhjóladrif',
      'Tesla Model 3 Performance',
    ])
    expect(labels('Lexus RZ 500e er dýrari.')).toEqual(['Lexus RZ 500e'])
    expect(labels('Hyundai Kona Electric er ódýrari.')).toEqual([
      'Hyundai Kona Electric 65 kWh',
    ])
    expect(labels('Fiat 500e er minnstur.')).toEqual(['Fiat 500e'])
  })

  it('does not find a name inside a longer one', () => {
    expect(labels('BMW iX3 40 er nýr.')).toEqual(['BMW iX3 40'])
    expect(labels('Mazda CX-6e er jepplingur.')).toEqual(['Mazda CX-6e 78 kWh'])
    expect(labels('Volvo EX30 Cross Country er hærri.')).toEqual([
      'Volvo EX30 Cross Country Twin Motor Performance',
    ])
    expect(labels('BYD Seal U er stærri.')).toEqual(['BYD Seal U'])
    expect(labels('Þú gætir líka skoðað ID.3 Neo.')).toEqual([
      'Volkswagen ID.3 Neo 58 kWh',
    ])
    expect(labels('Bíll Ni4 er ekki til, né EV30.')).toEqual([])
  })

  it('finds a model with an Icelandic ending put on with a hyphen', () => {
    expect(labels('Ég myndi velja EV9-bílinn.')).toEqual(['Kia EV9'])
    expect(labels('Kia-bílnum fylgir sjö ára ábyrgð.')).toEqual([])
  })

  it('lists cars in the order the answer names them', () => {
    expect(
      labels(
        'Besti kosturinn er **Skoda Elroq 85**, en Kia EV3 Long Range og BYD Dolphin koma líka til greina.',
      ),
    ).toEqual(['Skoda Elroq 85', 'Kia EV3 Long Range', 'BYD Dolphin'])
  })

  it('keeps to the variant an answer names', () => {
    expect(
      labels(
        'Tesla Model Y Performance er sneggstur. Model Y er líka með stórt skott.',
      ),
    ).toEqual(['Tesla Model Y Performance'])
  })

  it('takes a model named bare as the car with that label, when there is one', () => {
    expect(labels('Kia EV4 er góður kostur.')).toEqual(['Kia EV4'])
    expect(labels('Kia EV4 Fastback er sportlegri en Kia EV4.')).toEqual([
      'Kia EV4 Fastback',
      'Kia EV4',
    ])
  })
})

describe('getRandomSuggestions', () => {
  const pool = ['a', 'b', 'c', 'd', 'e']

  it('returns the number asked for', () => {
    expect(getRandomSuggestions(pool, 3)).toHaveLength(3)
  })

  it('never repeats one', () => {
    for (let run = 0; run < 50; run++) {
      const picked = getRandomSuggestions(pool, 3)
      expect(new Set(picked).size).toBe(3)
    }
  })

  it('leaves the pool it was given alone', () => {
    const original = [...pool]
    getRandomSuggestions(pool, 3)
    expect(pool).toEqual(original)
  })

  it('cannot return more than the pool holds', () => {
    expect(getRandomSuggestions(pool, 99)).toHaveLength(pool.length)
  })
})
