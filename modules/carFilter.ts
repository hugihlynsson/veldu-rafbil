import { NewCar, Filters } from '../types'
import getPriceWithGrant from './getPriceWithGrant'
import getKmPerMinutesCharged from './getKmPerMinutesCharged'

const carFilter =
  (filters: Filters) =>
  (car: NewCar): boolean => {
    if (Object.keys(filters).length === 0) return true
    return Object.keys(filters).every((name): boolean => {
      switch (name as keyof Filters) {
        case 'acceleration':
          return (
            car.acceleration <=
            (filters.acceleration ?? Number.MAX_SAFE_INTEGER)
          )
        case 'availability':
          return (
            Boolean(car.expectedDelivery) ===
            (filters.availability === 'expected')
          )
        case 'drive':
          return filters.drive?.includes(car.drive) || false
        case 'fastcharge':
          return (
            Number(getKmPerMinutesCharged(car.timeToCharge10T080, car.range)) >=
            (filters.fastcharge ?? 0)
          )
        case 'name':
          return (
            filters.name?.some((nameFilter) =>
              `${car.make} ${car.model} ${car.subModel}`
                .toLowerCase()
                .includes(nameFilter.toLowerCase()),
            ) || false
          )
        case 'price':
          return (
            getPriceWithGrant(car.price) <=
            (filters.price ?? Number.MAX_SAFE_INTEGER)
          )
        case 'range':
          return car.range >= (filters.range ?? 0)
        case 'value':
          return (
            getPriceWithGrant(car.price) / car.range <=
            (filters.value ?? Number.MAX_SAFE_INTEGER)
          )
      }
    })
  }

export default carFilter