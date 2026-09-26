import { Filters } from '@/types'
import { Car } from './cars'
import { filterDefinitions } from './filters'

type Check = (car: Car) => boolean

const carFilter = (filters: Filters): Check => {
  const checks = (Object.keys(filters) as Array<keyof Filters>)
    .filter((name) => filters[name] !== undefined)
    .map((name) =>
      (filterDefinitions[name].test as (value: unknown) => Check)(
        filters[name],
      ),
    )

  if (checks.length === 0) return () => true

  return (car) => checks.every((check) => check(car))
}

export default carFilter
