import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import type { NewCar } from '@/modules/data/newCarSchema'
import { readVerdict, verdictFacts } from './prompt'

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

describe('verdictFacts', () => {
  const facts = verdictFacts([kia, tesla])

  it('names each car in full', () => {
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
