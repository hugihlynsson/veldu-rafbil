import { UsedCar } from '../types'

const carBlacklist = [
  'hybrid', // Want BEV only
  'tazzari', // This is not a general use vehicle
]

export default (cars: Array<UsedCar>): Array<UsedCar> =>
  cars.filter((car) =>
    carBlacklist.every(
      (make) =>
        !car.make.toLowerCase().includes(make) &&
        !car.model.toLowerCase().includes(make) &&
        !car.modelExtra.toLowerCase().includes(make),
    ),
  )
