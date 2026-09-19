import { NewCar } from '../types'

// One identity for a car, used as the anchor NewCar puts on its <article>, the
// target MiniCar scrolls to from the chat, and the React key of every list the
// cars are rendered in. Each of those used to build its own, with a comment in
// one asking the others to keep in step.
//
// It has to be unique across the car data or all three break at once: two
// <article>s answer to one id, the chat scrolls to whichever came first, and
// React renders a list it cannot tell apart. A test over the data pins that,
// because the data is what decides it — two variants that differ only in price
// are as indistinguishable to a reader as they are to this.
const getCarId = (car: NewCar): string =>
  `car-${car.make}-${car.model}-${car.subModel || 'base'}`
    .toLowerCase()
    .replace(/\s+/g, '-')

export default getCarId
