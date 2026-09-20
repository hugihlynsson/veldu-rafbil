import getKmPerMinutesCharged from './getKmPerMinutesCharged'
import {
  NewCar,
  SearchParams,
  Sorting,
  SortingDirection,
  SortingQuery,
} from '../types'
import getPriceWithGrant from './getPriceWithGrant'
import { first, oneOf } from './searchParams'

const queryToSorting: Record<string, Sorting> = {
  nafni: 'name',
  verdi: 'price',
  draegni: 'range',
  hrodun: 'acceleration',
  virdi: 'value',
  hradhledslu: 'fastcharge',
}

export const sortingToQuery: Record<Sorting, SortingQuery> = {
  name: 'nafni',
  price: 'verdi',
  range: 'draegni',
  acceleration: 'hrodun',
  value: 'virdi',
  fastcharge: 'hradhledslu',
}

// The direction each sorting starts in, i.e. the "most useful first" order
export const defaultDirection: Record<Sorting, SortingDirection> = {
  name: 'asc',
  price: 'asc',
  range: 'desc',
  acceleration: 'asc',
  value: 'asc',
  fastcharge: 'desc',
}

export const flipDirection = (direction: SortingDirection): SortingDirection =>
  direction === 'asc' ? 'desc' : 'asc'

export const getSortingFromQuery = (query: SearchParams): Sorting =>
  oneOf(query.radaeftir, queryToSorting) ?? 'name'

export const getDirectionFromQuery = (
  query: SearchParams,
): SortingDirection => {
  const base = defaultDirection[getSortingFromQuery(query)]
  return first(query.ofugt) === '1' ? flipDirection(base) : base
}

export const isDefaultDirection = (
  sorting: Sorting,
  direction: SortingDirection,
): boolean => defaultDirection[sorting] === direction

// Zero padded so the name sort can break its ties on price as text
const padPrice = (car: NewCar): string =>
  getPriceWithGrant(car.price).toString().padStart(9, '0')

/**
 * What a car is ranked by, always ascending — the direction is applied to the
 * comparison afterwards. Add a `Sorting` case here and TypeScript's exhaustive
 * switch will flag everywhere else that needs it.
 */
const sortingKey = (sorting: Sorting, car: NewCar): number | string => {
  switch (sorting) {
    case 'name':
      return `${car.make} ${car.model} ${padPrice(car)}`
    case 'price':
      return getPriceWithGrant(car.price)
    case 'range':
      return car.range
    case 'acceleration':
      return car.acceleration
    case 'value':
      return getPriceWithGrant(car.price) / car.range
    case 'fastcharge':
      return getKmPerMinutesCharged(car.timeToCharge10T080, car.range)
  }
}

// localeCompare with no locale answers to whatever the runtime's default is,
// which is not the same in node as in the browser: an Ö or a Þ would sort one
// way on the server and another after hydration. One collator, reused.
const collator = new Intl.Collator('is')

const compareKeys = (a: number | string, b: number | string): number =>
  typeof a === 'string' && typeof b === 'string'
    ? collator.compare(a, b)
    : // A sorting's key has the same type for every car, so this is the number case
      (a as number) - (b as number)

/**
 * The car list in the order the page shows it. Each car's key is derived once
 * rather than inside every comparison, and `sort` is stable by specification,
 * so equal-ranked cars keep the order the data gave them.
 */
export const sortCars = (
  cars: ReadonlyArray<NewCar>,
  sorting: Sorting,
  direction: SortingDirection = defaultDirection[sorting],
): Array<NewCar> => {
  const order = direction === 'asc' ? 1 : -1
  const keyed = cars.map(
    (car) => [car, sortingKey(sorting, car)] as [NewCar, number | string],
  )

  keyed.sort(([, a], [, b]) => order * compareKeys(a, b))

  return keyed.map(([car]) => car)
}

// The two parameters the sorting can occupy, cleared and rewritten together
export const sortingQueryKeys = ['radaeftir', 'ofugt'] as const

// Not a mirror of the readers: the default leaves the URL clean, and the flip
// parameter records a deviation from it rather than "descending".
export const getQueryFromSorting = (
  sorting: Sorting,
  direction: SortingDirection,
): Record<string, string> => {
  const query: Record<string, string> = {}
  const isDefault = isDefaultDirection(sorting, direction)

  if (sorting !== 'name' || !isDefault) {
    query.radaeftir = sortingToQuery[sorting]
  }

  if (!isDefault) query.ofugt = '1'

  return query
}
