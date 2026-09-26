import { NewCar } from '@/types'

/** Make, model and subModel — what a car is called, and its identity with it */
export const carLabel = (car: NewCar): string =>
  `${car.make} ${car.model}${car.subModel ? ` ${car.subModel}` : ''}`

// The anchor on the card, the target the chat scrolls to and the React key, so
// it has to be unique across the car data or all three break at once. /api/cars
// publishes it in a URL fragment too, where a # or a + does not read the same
// in every parser, so it keeps to a-z, 0-9 and dashes.
const getCarId = (car: NewCar): string =>
  `car-${car.make}-${car.model}-${car.subModel || 'base'}`
    .toLowerCase()
    // Splits ë into e and its accent, so the accent can go on its own
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '')

export default getCarId
