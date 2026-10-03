import { describe, expect, it } from 'vitest'

import getCarId from './getCarId'
import { NewCar } from '@/types'

const car = (over: Partial<NewCar>): NewCar => ({
  make: 'Tesla',
  model: 'Model Y',
  heroImageName: 'x',
  price: 8_000_000,
  sellerUrl: 'https://example.is',
  acceleration: 6,
  capacity: 75,
  range: 500,
  drive: 'AWD',
  seats: 5,
  timeToCharge10To80: 25,
  power: 250,
  ...over,
})

// It ends up in an HTML id, in getElementById and in a React key
describe('getCarId', () => {
  it('builds an id out of make, model and subModel', () => {
    expect(getCarId(car({ subModel: 'Long Range' }))).toBe(
      'car-tesla-model-y-long-range',
    )
  })

  it('says base for a car with no subModel', () => {
    expect(getCarId(car({}))).toBe('car-tesla-model-y-base')
  })

  it('leaves no whitespace for getElementById to trip over', () => {
    const id = getCarId(
      car({ make: 'Mercedes  Benz', model: 'EQS', subModel: 'SUV 450 4MATIC' }),
    )

    expect(id).not.toMatch(/\s/)
    expect(id).toBe('car-mercedes-benz-eqs-suv-450-4matic')
  })

  // /api/cars publishes the id as /#<id>, and these were in it as typed
  it.each<[Partial<NewCar>, string]>([
    [{ make: 'smart', model: '#1', subModel: 'Pro+' }, 'car-smart-1-pro'],
    [{ make: 'Citroën', model: 'ë-C4' }, 'car-citroen-e-c4-base'],
    [
      { make: 'Porsche', model: 'Cayenne', subModel: 'Coupé' },
      'car-porsche-cayenne-coupe',
    ],
    [
      { make: 'Volkswagen', model: 'ID.3', subModel: 'Pro' },
      'car-volkswagen-id-3-pro',
    ],
    [{ make: 'Toyota', model: 'C-HR+' }, 'car-toyota-c-hr-base'],
  ])('keeps %o to letters, digits and dashes', (over, id) => {
    expect(getCarId(car(over))).toBe(id)
  })

  it('tells two subModels of one model apart', () => {
    expect(getCarId(car({ subModel: 'Long Range' }))).not.toBe(
      getCarId(car({ subModel: 'Performance' })),
    )
  })
})
