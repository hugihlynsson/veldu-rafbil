import { NewCar } from '../types'

// The anchor on the card, the target the chat scrolls to and the React key, so
// it has to be unique across the car data or all three break at once.
const getCarId = (car: NewCar): string =>
  `car-${car.make}-${car.model}-${car.subModel || 'base'}`
    .toLowerCase()
    .replace(/\s+/g, '-')

export default getCarId
