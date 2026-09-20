import { NewCar, Filters } from '../types'
import { carLabel } from './getCarId'
import getPriceWithGrant from './getPriceWithGrant'
import getKmPerMinutesCharged from './getKmPerMinutesCharged'

type Check = (car: NewCar) => boolean

/**
 * The test one filter puts a car to, built from the value it was given. The
 * switch is exhaustive over `Filters`, so a new filter is flagged here until it
 * has one — and reading the value out here rather than inside the check keeps
 * the per-car work to a comparison.
 */
const checkFor = (filters: Filters, name: keyof Filters): Check => {
  switch (name) {
    case 'acceleration': {
      const max = filters.acceleration ?? Number.MAX_SAFE_INTEGER
      return (car) => car.acceleration <= max
    }
    case 'availability': {
      const expected = filters.availability === 'expected'
      return (car) => Boolean(car.expectedDelivery) === expected
    }
    case 'drive': {
      const drives = filters.drive ?? []
      return (car) => drives.includes(car.drive)
    }
    case 'fastcharge': {
      const min = filters.fastcharge ?? 0
      return (car) =>
        getKmPerMinutesCharged(car.timeToCharge10T080, car.range) >= min
    }
    case 'name': {
      const names = (filters.name ?? []).map((name) => name.toLowerCase())
      return (car) => {
        const label = carLabel(car).toLowerCase()
        return names.some((name) => label.includes(name))
      }
    }
    case 'price': {
      const max = filters.price ?? Number.MAX_SAFE_INTEGER
      return (car) => getPriceWithGrant(car.price) <= max
    }
    case 'range': {
      const min = filters.range ?? 0
      return (car) => car.range >= min
    }
    case 'seats': {
      const min = filters.seats ?? 0
      return (car) => car.seats >= min
    }
    case 'value': {
      const max = filters.value ?? Number.MAX_SAFE_INTEGER
      return (car) => getPriceWithGrant(car.price) / car.range <= max
    }
  }
}

const carFilter = (filters: Filters): Check => {
  const checks = (Object.keys(filters) as Array<keyof Filters>).map((name) =>
    checkFor(filters, name),
  )

  if (checks.length === 0) return () => true

  return (car) => checks.every((check) => check(car))
}

export default carFilter
