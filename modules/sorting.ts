import { createLoader, createParser, createSerializer } from 'nuqs/server'

import { SearchParams, Sorting, SortingDirection, SortingQuery } from '@/types'
import { Car } from './cars'

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

export const isDefaultDirection = (
  sorting: Sorting,
  direction: SortingDirection,
): boolean => defaultDirection[sorting] === direction

// Zero padded so the name sort can break its ties on price as text
const padPrice = (car: Car): string =>
  car.priceWithGrant.toString().padStart(9, '0')

/**
 * What a car is ranked by, always ascending — the direction is applied to the
 * comparison afterwards. Add a `Sorting` case here and TypeScript's exhaustive
 * switch will flag everywhere else that needs it.
 */
const sortingKey = (sorting: Sorting, car: Car): number | string => {
  switch (sorting) {
    case 'name':
      return `${car.make} ${car.model} ${padPrice(car)}`
    case 'price':
      return car.priceWithGrant
    case 'range':
      return car.range
    case 'acceleration':
      return car.acceleration
    case 'value':
      return car.pricePerKm
    case 'fastcharge':
      return car.kmPerMinuteCharged
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
  cars: ReadonlyArray<Car>,
  sorting: Sorting,
  direction: SortingDirection = defaultDirection[sorting],
): Array<Car> => {
  const order = direction === 'asc' ? 1 : -1
  const keyed = cars.map(
    (car) => [car, sortingKey(sorting, car)] as [Car, number | string],
  )

  keyed.sort(([, a], [, b]) => order * compareKeys(a, b))

  return keyed.map(([car]) => car)
}

const parseAsSorting = createParser<Sorting>({
  parse: (value) =>
    Object.hasOwn(queryToSorting, value) ? queryToSorting[value] : null,
  serialize: (sorting) => sortingToQuery[sorting],
})

// ofugt records a flip from the sorting's default, not "descending", so the
// default leaves the URL clean whichever way that default points
const parseAsFlip = createParser<boolean>({
  parse: (value) => value === '1',
  serialize: () => '1',
})

// What nuqs is handed, on the server and in the browser alike
export const sortingParsers = {
  sorting: parseAsSorting.withDefault('name'),
  flipped: parseAsFlip.withDefault(false),
}
export const sortingUrlKeys = { sorting: 'radaeftir', flipped: 'ofugt' }

export interface SortingState {
  sorting: Sorting
  direction: SortingDirection
}

export const stateFromSortingValues = ({
  sorting,
  flipped,
}: {
  sorting: Sorting
  flipped: boolean
}): SortingState => ({
  sorting,
  direction: flipped
    ? flipDirection(defaultDirection[sorting])
    : defaultDirection[sorting],
})

export const sortingValuesFromState = ({
  sorting,
  direction,
}: SortingState) => ({
  sorting,
  flipped: !isDefaultDirection(sorting, direction),
})

const loadSortingValues = createLoader(sortingParsers, {
  urlKeys: sortingUrlKeys,
})

export const getSortingFromQuery = (query: SearchParams): SortingState =>
  stateFromSortingValues(loadSortingValues(query))

const serializeSortingValues = createSerializer(sortingParsers, {
  urlKeys: sortingUrlKeys,
})

/** The query string for a sorting, `?` and all, or '' for the default */
export const serializeSorting = (state: SortingState): string =>
  serializeSortingValues(sortingValuesFromState(state))
