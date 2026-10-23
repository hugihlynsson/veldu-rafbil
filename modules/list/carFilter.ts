import { Car } from '@/modules/data/cars'
import { filterDefinitions, type Filters } from './filters'

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

export default carFilter
