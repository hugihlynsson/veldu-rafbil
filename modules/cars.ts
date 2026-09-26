import { Availability, NewCar } from '@/types'
import newCars from './newCars'
import getCarId, { carLabel } from './getCarId'
import getPriceWithGrant from './getPriceWithGrant'
import getKmPerMinutesCharged from './getKmPerMinutesCharged'

/**
 * A car with the figures every view ranks, filters or prints worked out once,
 * so the list, the API and the assistant cannot each derive them differently.
 */
export interface Car extends NewCar {
  id: string
  label: string
  // What a buyer pays, and what the site shows everywhere
  priceWithGrant: number
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
    pricePerKm: priceWithGrant / car.range,
    kmPerMinuteCharged: getKmPerMinutesCharged(
      car.timeToCharge10To80,
      car.range,
    ),
    availability: car.expectedDelivery ? 'expected' : 'available',
  }
}

const cars: ReadonlyArray<Car> = newCars.map(deriveCar)

export default cars
