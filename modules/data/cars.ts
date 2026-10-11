import type { NewCar } from './newCarSchema'
import newCars from './newCars'
import getCarId, { carLabel } from './getCarId'
import getPriceWithGrant from './getPriceWithGrant'
import getKmPerMinutesCharged from './getKmPerMinutesCharged'

export type Availability = 'available' | 'expected'

/**
 * A car with the figures every view ranks, filters or prints worked out once,
 * so the list, the API and the assistant cannot each derive them differently.
 */
export interface Car extends NewCar {
  id: string
  label: string
  // What a buyer pays, and what the site shows everywhere
  priceWithGrant: number
  // Whether the grant came off, which the price shown has to say
  hasGrant: boolean
  pricePerKm: number
  kmPerMinuteCharged: number
  availability: Availability
}

export const deriveCar = (car: NewCar): Car => {
  const priceWithGrant = getPriceWithGrant(car.price)

  return {
    ...car,
    id: getCarId(car),
    label: carLabel(car),
    priceWithGrant,
    hasGrant: priceWithGrant < car.price,
    pricePerKm: priceWithGrant / car.range,
    kmPerMinuteCharged: getKmPerMinutesCharged(
      car.timeToCharge10To80,
      car.range,
    ),
    availability: car.expectedDelivery ? 'expected' : 'available',
  }
}

/** Every car with a page, those no longer sold new included */
export const allCars: ReadonlyArray<Car> = newCars.map(deriveCar)

/** The cars sold new now: the list, the advisor and the published data */
const cars: ReadonlyArray<Car> = allCars.filter((car) => !car.deprecated)

export default cars
