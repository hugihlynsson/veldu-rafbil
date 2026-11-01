import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import cars, { type Car } from '@/modules/data/cars'
import { similarTo } from '@/modules/detail/similar'
import { writingRules } from '@/modules/detail/writingRules'
import {
  carFacts,
  describeStanding,
  MAX_STARTER_LENGTH,
  QUESTION_COUNT,
  questionsPrompt,
  readDetails,
  readQuestions,
  readReview,
  type DetailsOf,
  reviewFactsKey,
  reviewPrompt,
} from './reviewPrompt'

const base: NewCar = {
  make: 'Kia',
  model: 'EV3',
  subModel: 'Long Range',
  heroImageName: 'kia-ev3',
  evDatabaseUrl: 'https://ev-database.org/car/3004/Kia-EV3-Long-Range',
  price: 6_290_777,
  sellerUrl: 'https://kia.is',
  acceleration: 7.7,
  capacity: 81.4,
  range: 605,
  drive: 'FWD',
  seats: 5,
  timeToCharge10To80: 31,
  power: 150,
}

const kia = deriveCar(base)
const tesla = deriveCar({
  ...base,
  make: 'Tesla',
  model: 'Model Y',
  subModel: undefined,
  price: 6_529_990,
  range: 505,
  acceleration: 7.2,
  drive: 'RWD',
})

describe('carFacts', () => {
  const facts = carFacts(kia, [tesla], [kia, tesla])

  it('names the car and the one like it in full', () => {
    expect(facts).toContain('- Kia EV3 Long Range, ')
    expect(facts).toContain('- Tesla Model Y, ')
  })

  // The model copies a gap; left to subtract, it gets one wrong now and then,
  // and given against the best of several, it quotes it as against this one
  it('works out each similar car against this one', () => {
    expect(facts).toContain(
      '- Tesla Model Y: afturhjóladrif, 240.000 kr. dýrari, 100 km minni drægni',
    )
    expect(facts).toContain('0,5 s sneggri í 0-100 km/klst')
  })

  it('says charging as the stops it makes, never as a speed', () => {
    const quicker = deriveCar({
      ...base,
      make: 'Hraður',
      timeToCharge10To80: 20,
    })
    expect(carFacts(kia, [quicker], [kia, quicker])).toContain(
      '- Hraður EV3 Long Range: um 35% styttri hleðslustopp',
    )
    expect(facts).not.toMatch(/km\/mín|mín\b/)
  })

  // A review is kept for years, and when a car arrives soon reads as dated
  it('says nothing of when a car arrives', () => {
    const expected = deriveCar({ ...base, expectedDelivery: 'Sumar 2026' })
    expect(carFacts(expected, [tesla], [expected, tesla])).not.toMatch(
      /sumar 2026|væntanleg|fáanleg/i,
    )
  })

  it('says what ev-database adds, where it has it', () => {
    const details: DetailsOf = (car) =>
      car === kia
        ? { body: 'SUV', cargo: 460, frunk: 25, towing: 0, warrantyYears: 7 }
        : { body: 'SUV', cargo: 854, towing: 1600, warrantyYears: 8 }
    const withDetails = carFacts(kia, [tesla], [kia, tesla], details)
    expect(withDetails).toContain(
      'yfirbygging: jepplingur eða jeppi, eftir stærð, 460 l farangursrými, 25 l framskott, má ekki draga kerru',
    )
    expect(withDetails).toContain('394 l stærra skott')
    expect(withDetails).toContain('má draga allt að 1.600 kg')
    expect(withDetails).toContain('ábyrgð á rafhlöðu 1 ári lengri')
    expect(facts).toContain('engar nánari upplýsingar af ev-database')
  })

  // "It comes with all-wheel drive too" answers a drawback the review names
  it('lists the other versions of the same model', () => {
    const awd = deriveCar({ ...base, subModel: 'Long Range AWD', drive: 'AWD' })
    expect(carFacts(kia, [tesla], [kia, tesla, awd])).toContain(
      'Aðrar útfærslur hans á listanum:\n- Kia EV3 Long Range AWD',
    )
    expect(carFacts(kia, [tesla], [kia, tesla, awd])).toContain(
      'Hvernig þær eru miðað við hann:\n- Kia EV3 Long Range AWD: fjórhjóladrif',
    )
    expect(facts).not.toContain('Aðrar útfærslur')
  })

  it('quotes the price after the grant, without naming it', () => {
    expect(facts).toContain('5.890.777 kr.')
    expect(facts).not.toContain('styrk')
  })
})

describe('readReview', () => {
  it('reads the answer a paragraph at a time', () => {
    expect(
      readReview('Ólíkir bílar.\nHvor á sitt.\n\n  Kia fer lengra. \n'),
    ).toEqual(['Ólíkir bílar. Hvor á sitt.', 'Kia fer lengra.'])
  })

  it('takes out the markdown it was asked not to write', () => {
    expect(readReview('## Kia EV3\n\n**Kia** fer - lengra')).toEqual([
      'Kia EV3',
      'Kia fer - lengra',
    ])
  })

  it('has nothing to show for an empty answer', () => {
    expect(readReview(' \n\n ')).toBeNull()
  })
})

describe('readQuestions', () => {
  it('reads one question a line, numbered or not', () => {
    expect(
      readQuestions('1. Dugar hann á veturna?\n\n- Er hann hljóðlátur?\n'),
    ).toEqual(['Dugar hann á veturna?', 'Er hann hljóðlátur?'])
  })

  it('takes out the markdown and quotes', () => {
    expect(readQuestions('**„Er hann hljóðlátur?“**')).toEqual([
      'Er hann hljóðlátur?',
    ])
  })

  // A pill does not wrap, and a line that is no question is talk around them
  it('leaves out a line too long for a pill or not a question', () => {
    const long = `Hvernig ${'mjög '.repeat(10)}langt kemst hann?`
    expect(long.length).toBeGreaterThan(MAX_STARTER_LENGTH)
    expect(
      readQuestions(`Hér eru spurningar:\n${long}\nEr hann hljóðlátur?`),
    ).toEqual(['Er hann hljóðlátur?'])
  })

  it('keeps each once, and no more than asked for', () => {
    const lines = Array.from(
      { length: QUESTION_COUNT + 2 },
      (_, index) => `Spurning ${index}?`,
    )
    expect(readQuestions([lines[0], ...lines].join('\n'))).toEqual(
      lines.slice(0, QUESTION_COUNT),
    )
  })
})

describe('questionsPrompt', () => {
  const [a] = cars as readonly [Car, Car, Car, ...Car[]]

  it('gives the review it follows and the cars it can name', () => {
    const { prompt } = questionsPrompt(a, {
      paragraphs: ['Fyrsta efnisgrein.', 'Önnur.'],
      facts: '',
      questions: [],
    })
    expect(prompt).toContain('Umsögnin á síðunni:\nFyrsta efnisgrein.')
    for (const rival of similarTo(a)) expect(prompt).toContain(rival.label)
  })
})

describe('reviewPrompt', () => {
  const [a] = cars as readonly [Car, Car, Car, ...Car[]]

  it('keeps every rule the verdicts are written by', () => {
    const { system } = reviewPrompt(a)
    for (const rule of Object.values(writingRules)) {
      expect(system).toContain(rule)
    }
  })

  it('reviews one car against its rivals', () => {
    const { system, prompt } = reviewPrompt(a)
    expect(system).toContain('síðu bílsins')
    expect(prompt).toContain('Svipaðir bílar')
    expect(prompt).toContain('Staða hans á listanum:')
    for (const rival of similarTo(a)) expect(prompt).toContain(rival.label)
  })
})

describe('reviewFactsKey', () => {
  const [a] = cars as readonly [Car, Car, Car, ...Car[]]

  it('changes with a figure the review quotes', () => {
    expect(reviewFactsKey({ ...a, range: a.range + 1 })).not.toBe(
      reviewFactsKey(a),
    )
  })
})

describe('describeStanding', () => {
  const field = [1, 2, 3, 4, 5, 6].map((step) =>
    deriveCar({
      ...base,
      make: `Make ${step}`,
      price: 6_000_000 + step * 100_000,
      range: 400 + step * 20,
    }),
  )
  const middle = field[2]!

  it('says in words where a car stands on each figure', () => {
    // 2 of the other 5 have less range, and 3 cost more
    const standing = describeStanding(middle, field)
    expect(standing).toContain('Drægni — af öllum: drífur fremur stutt')
    expect(standing).toContain('Verð — af öllum: fremur ódýr')
    expect(describeStanding(field[0]!, field)).toContain(
      'Verð — af öllum: ódýrastur allra',
    )
  })

  // A share is what the model would quote, and nobody reads it as advice
  it('never as a share of them', () => {
    expect(describeStanding(middle, field)).not.toContain('%')
  })

  it('weighs it against cars at a similar price too, when there are enough', () => {
    expect(describeStanding(middle, field)).toContain(
      'miðað við aðra á svipuðu verði: drífur styttra en flestir',
    )
    expect(describeStanding(middle, field.slice(0, 4))).not.toContain(
      'svipuðu verði',
    )
  })

  // Most cars have the same battery warranty, and one with it is ordinary
  it('puts a car tied with most of them in the middle', () => {
    const details: DetailsOf = (car) => ({
      warrantyYears: car === field[5] ? 10 : 8,
    })
    expect(describeStanding(middle, field, details)).toContain(
      'Ábyrgð á rafhlöðu — af öllum: í meðallagi',
    )
    expect(describeStanding(field[5]!, field, details)).toContain(
      'með lengstu ábyrgð allra á rafhlöðunni',
    )
  })

  // A buyer with a trailer rules it out on that alone
  it('says outright that a car cannot tow', () => {
    const details: DetailsOf = (car) => ({ towing: car === middle ? 0 : 750 })
    expect(describeStanding(middle, field, details)).toContain(
      'Dráttargeta — af öllum: má ekki draga kerru',
    )
  })

  it('leaves out what ev-database has nothing on', () => {
    expect(describeStanding(middle, field)).not.toContain('Farangursrými')
  })

  it('leaves price out of the comparison at a similar price', () => {
    expect(describeStanding(middle, field)).toMatch(
      /Verð — af öllum: [^\n;]*\n/,
    )
  })
})

describe('readDetails', () => {
  it('reads the numbers out of the page as the site writes them', () => {
    expect(
      readDetails({
        length: '4440 mm',
        cargoVolume: '404 L',
        towingBraked: '1800 kg',
        batteryWarrantyPeriod: '10 years',
        batteryWarrantyMileage: '1,000,000 km',
      }),
    ).toMatchObject({
      length: 4440,
      cargo: 404,
      towing: 1800,
      warrantyYears: 10,
      warrantyKm: 1_000_000,
    })
  })

  // The XPENG X9's page gives 2,386 l, which is with the seats folded
  it('drops a boot figure that can only be the seats folded', () => {
    expect(readDetails({ cargoVolume: '2386 L' }).cargo).toBeUndefined()
    expect(
      readDetails({ cargoVolume: '2386 L', cargoVolumeMax: '4800 L' }).cargo,
    ).toBe(2386)
    expect(readDetails({ cargoVolume: '633 L' }).cargo).toBe(633)
  })

  it('reads no boot out of a pickup, whose figure is its bed', () => {
    expect(
      readDetails({ carBody: 'Pickup Truck', cargoVolume: '907 L' }).cargo,
    ).toBeUndefined()
  })

  it('drops a folded figure the seats could not fold to', () => {
    expect(
      readDetails({ cargoVolume: '421 L', cargoVolumeMax: '452 L' }),
    ).toMatchObject({ cargo: 421, cargoMax: undefined })
  })

  it('takes a car that takes no hitch to tow nothing', () => {
    expect(readDetails({ towHitch: 'No' }).towing).toBe(0)
    expect(readDetails({}).towing).toBeUndefined()
  })
})
