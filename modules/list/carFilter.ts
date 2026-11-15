import cars, { type Car } from '@/modules/data/cars'
import { filterDefinitions, type FilterValue, type Filters } from './filters'

type Check = (car: Car) => boolean

const checkFor = (name: keyof Filters, value: unknown): Check =>
  (filterDefinitions[name].test as (value: unknown) => Check)(value)

/**
 * A name that finds a car of a chosen make narrows those makes, as Skoda and
 * "enyaq" ask for the Enyaq, and Kia and "long range" for the Kias that are
 * one. Any other adds its cars, as Kia and "model y" ask for both: anded, that
 * would be no car at all, and "Tesla, Kia EV9" typed in the search is that
 * once the Tesla is a make.
 */
const makeAndName = (
  makes: FilterValue<'make'>,
  names: FilterValue<'name'>,
  list: ReadonlyArray<Car>,
): Check => {
  const inMake = checkFor('make', makes)
  const chosenCars = list.filter(inMake)
  const narrowing = names.filter((name) =>
    chosenCars.some(checkFor('name', [name])),
  )
  const adding = names.filter((name) => !narrowing.includes(name))
  const matchesAny = (some: string[]): Check =>
    some.length ? checkFor('name', some) : () => false
  const narrows = matchesAny(narrowing)
  const adds = matchesAny(adding)
  const narrowed = new Set(chosenCars.filter(narrows).map((car) => car.make))
  return (car) =>
    adds(car) || (inMake(car) && (!narrowed.has(car.make) || narrows(car)))
}

/** `list` is the cars a name is looked for in to tell which makes it narrows */
const carFilter = (
  filters: Filters,
  list: ReadonlyArray<Car> = cars,
): Check => {
  const { make, name } = filters
  const both = make !== undefined && name !== undefined
  const checks = (Object.keys(filters) as Array<keyof Filters>)
    .filter((key) => filters[key] !== undefined)
    .filter((key) => !both || (key !== 'make' && key !== 'name'))
    .map((key) => checkFor(key, filters[key]))
  if (both) checks.push(makeAndName(make, name, list))

  if (checks.length === 0) return () => true

  return (car) => checks.every((check) => check(car))
}

export default carFilter
