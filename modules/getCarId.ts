import { NewCar } from '../types'

// The anchor NewCar puts on its <article> and MiniCar scrolls to from the
// chat. Both used to build it themselves, with a comment in each asking the
// other to keep in step.
const getCarId = (car: NewCar): string =>
  `car-${car.make}-${car.model}-${car.subModel || 'base'}`
    .toLowerCase()
    .replace(/\s+/g, '-')

export default getCarId
