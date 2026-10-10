import { describe, expect, it } from 'vitest'

import { deriveCar } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import type { NewCar } from '@/modules/data/newCarSchema'
import { readVerdict, verdictFacts, verdictSchema } from './prompt'

const base: NewCar = {
  make: 'Kia',
  model: 'EV3',
  subModel: 'Long Range',
  heroImageName: 'kia-ev3',
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

  it('names each car by the slug the answer has to use', () => {
    expect(facts).toContain(`${carSlug(kia)}: Kia EV3 Long Range`)
    expect(facts).toContain(`${carSlug(tesla)}: Tesla Model Y`)
  })

  // The model copies a gap; left to subtract, it gets one wrong now and then
  it('works out every gap for the model', () => {
    expect(facts).toContain('Tesla Model Y 6.029.990 kr. (239.213 kr. dýrari)')
    expect(facts).toContain('Tesla Model Y 505 km (100 km minni drægni)')
    expect(facts).toContain('Kia EV3 Long Range 7.7 s (0.5 s hægari)')
  })

  it('quotes the price after the grant', () => {
    expect(facts).toContain('5.790.777 kr. eftir styrk')
  })
})

describe('verdictSchema', () => {
  it('takes only the cars compared', () => {
    const schema = verdictSchema([kia, tesla])
    const answer = (car: string) => ({
      summary: 'Ólíkir bílar',
      picks: [{ car, when: 'þú vilt' }],
    })
    expect(schema.safeParse(answer(carSlug(kia))).success).toBe(true)
    expect(schema.safeParse(answer('some-other-car')).success).toBe(false)
  })
})

describe('readVerdict', () => {
  it('keeps one pick a car and ends no sentence twice', () => {
    expect(
      readVerdict(
        {
          summary: '  Ólíkir   bílar. ',
          picks: [
            { car: carSlug(kia), when: 'þú keyrir langt.' },
            { car: carSlug(kia), when: 'eitthvað annað' },
          ],
        },
        [kia, tesla],
      ),
    ).toEqual({
      summary: 'Ólíkir bílar.',
      picks: [{ slug: carSlug(kia), when: 'þú keyrir langt' }],
    })
  })

  it('has nothing to show for an empty answer', () => {
    expect(readVerdict({ summary: ' ', picks: [] }, [kia, tesla])).toBeNull()
  })
})
