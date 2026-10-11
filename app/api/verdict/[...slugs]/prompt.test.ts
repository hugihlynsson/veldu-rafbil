import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import cars from '@/modules/data/cars'
import { similarTo } from '@/modules/detail/similar'
import {
  carFacts,
  describeStanding,
  readVerdict,
  verdictPrompt,
} from './prompt'

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

  // The model copies a gap; left to subtract, it gets one wrong now and then
  it('works out every gap for the model', () => {
    expect(facts).toContain('Tesla Model Y 6.029.990 kr. (239.213 kr. dýrari)')
    expect(facts).toContain('Tesla Model Y 505 km (100 km minni drægni)')
    expect(facts).toContain('Kia EV3 Long Range 7.7 s (0.5 s hægari)')
  })

  it('gives the model each page it may look a car up on', () => {
    expect(facts).toContain(`ev-database: ${kia.evDatabaseUrl}`)
  })

  it('quotes the price after the grant', () => {
    expect(facts).toContain('5.790.777 kr. eftir styrk')
  })
})

describe('readVerdict', () => {
  it('reads the answer a paragraph at a time', () => {
    expect(
      readVerdict('Ólíkir bílar.\nHvor á sitt.\n\n  Kia fer lengra. \n'),
    ).toEqual({ paragraphs: ['Ólíkir bílar. Hvor á sitt.', 'Kia fer lengra.'] })
  })

  it('takes out the markdown it was asked not to write', () => {
    expect(readVerdict('## Samanburður\n\n**Kia** fer - lengra')).toEqual({
      paragraphs: ['Samanburður', 'Kia fer - lengra'],
    })
  })

  it('has nothing to show for an empty answer', () => {
    expect(readVerdict(' \n\n ')).toBeNull()
  })
})

describe('verdictPrompt', () => {
  const [a] = cars

  it('reviews one car against its rivals', () => {
    const { system, prompt } = verdictPrompt([a])
    expect(system).toContain('síðu bílsins')
    expect(prompt).toContain('Svipaðir bílar')
    expect(prompt).toContain('Staða hans á listanum:')
    for (const rival of similarTo(a)) expect(prompt).toContain(rival.label)
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

  it('says how many of the others a car leads on each figure', () => {
    // 2 of the other 5 have less range, and 3 cost more
    const standing = describeStanding(middle, field)
    expect(standing).toContain('Drægni: lengri drægni en 40% hinna 5 bílanna')
    expect(standing).toContain('Verð: ódýrari en 60% hinna 5 bílanna')
  })

  it('weighs it against cars at a similar price too, when there are enough', () => {
    expect(describeStanding(middle, field)).toContain(
      'og 40% þeirra 5 sem kosta svipað',
    )
    expect(describeStanding(middle, field.slice(0, 4))).not.toContain(
      'kosta svipað',
    )
  })

  it('leaves price out of the comparison at a similar price', () => {
    expect(describeStanding(middle, field)).toMatch(/Verð: [^\n]*listanum\n/)
  })
})
