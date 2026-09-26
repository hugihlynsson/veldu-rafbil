import { Filters } from '@/types'
import { Car } from './cars'
import { filterDefinitions } from './filters'

type Check = (car: Car) => boolean

const checkFor = (name: keyof Filters, value: unknown): Check =>
  (filterDefinitions[name].test as (value: unknown) => Check)(value)

const carFilter = (filters: Filters): Check => {
  const checks = (Object.keys(filters) as Array<keyof Filters>)
    .filter((name) => filters[name] !== undefined)
    .map((name) => checkFor(name, filters[name]))

  if (checks.length === 0) return () => true

  return (car) => checks.every((check) => check(car))
}

/**
 * The filters without the ones the car fails, so the list shows it and keeps
 * the rest. The chat can point at any car, including one the list has hidden.
 */
export const filtersShowing = (filters: Filters, car: Car): Filters =>
  Object.fromEntries(
    (Object.keys(filters) as Array<keyof Filters>)
      .filter(
        (name) =>
          filters[name] !== undefined && checkFor(name, filters[name])(car),
      )
      .map((name) => [name, filters[name]]),
  )

export default carFilter
