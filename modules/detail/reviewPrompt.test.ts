import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import cars from '@/modules/data/cars'
import { similarTo } from '@/modules/detail/similar'
import {
  carFacts,
  describeStanding,
  readReview,
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
      '- Tesla Model Y: 240.000 kr. dýrari, 100 km minni drægni',
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

  it('gives the model each page it may look a car up on', () => {
    expect(facts).toContain(`ev-database: ${kia.evDatabaseUrl}`)
  })

  it('quotes the price after the grant', () => {
    expect(facts).toContain('5.790.777 kr. eftir styrk')
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

describe('reviewPrompt', () => {
  const [a] = cars

  it('reviews one car against its rivals', () => {
    const { system, prompt } = reviewPrompt(a)
    expect(system).toContain('síðu bílsins')
    expect(prompt).toContain('Svipaðir bílar')
    expect(prompt).toContain('Staða hans á listanum:')
    for (const rival of similarTo(a)) expect(prompt).toContain(rival.label)
  })
})

describe('reviewFactsKey', () => {
  const [a] = cars

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
  const middle = field[2]

  it('says in words where a car stands on each figure', () => {
    // 2 of the other 5 have less range, and 3 cost more
    const standing = describeStanding(middle, field)
    expect(standing).toContain('Drægni — af öllum: drífur styttra en flestir')
    expect(standing).toContain('Verð — af öllum: ódýrari en flestir')
    expect(describeStanding(field[0], field)).toContain(
      'Verð — af öllum: ódýrastur',
    )
  })

  // A share is what the model would quote, and nobody reads it as advice
  it('never as a share of them', () => {
    expect(describeStanding(middle, field)).not.toContain('%')
  })

  it('weighs it against cars at a similar price too, when there are enough', () => {
    expect(describeStanding(middle, field)).toContain(
      'á svipuðu verði: drífur styttra en flestir',
    )
    expect(describeStanding(middle, field.slice(0, 4))).not.toContain(
      'svipuðu verði',
    )
  })

  it('leaves price out of the comparison at a similar price', () => {
    expect(describeStanding(middle, field)).toMatch(
      /Verð — af öllum: [^\n;]*\n/,
    )
  })
})
