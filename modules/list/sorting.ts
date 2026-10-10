import { createLoader, createParser, createSerializer } from 'nuqs/server'

import { parseAsWord, type SearchParams } from './filters'
import type { Car } from '@/modules/data/cars'

export type Sorting =
  | 'name'
  | 'price'
  | 'range'
  | 'acceleration'
  | 'value'
  | 'fastcharge'

export type SortingDirection = 'asc' | 'desc'

interface SortingDefinition {
  // As the toggle reads, after "Raða eftir:"
  label: string
  // Icelandic, and part of every link to a sorted list that has been shared
  urlWord: string
  // The direction it starts in, i.e. the "most useful first" order
  defaultDirection: SortingDirection
  // What a car is ranked by, ascending; the direction is applied afterwards.
  // The same type for every car.
  rank: (car: Car) => number | string
}

// Zero padded so the name sort can break its ties on price as text
const padPrice = (car: Car): string =>
  car.priceWithGrant.toString().padStart(9, '0')

// A new sorting is offered only once it has a place in CarList's toggles
export const sortingDefinitions: Record<Sorting, SortingDefinition> = {
  name: {
    label: 'Nafni',
    urlWord: 'nafni',
    defaultDirection: 'asc',
    rank: (car) => `${car.make} ${car.model} ${padPrice(car)}`,
  },
  price: {
    label: 'Verði',
    urlWord: 'verdi',
    defaultDirection: 'asc',
    rank: (car) => car.priceWithGrant,
  },
  range: {
    label: 'Drægni',
    urlWord: 'draegni',
    defaultDirection: 'desc',
    rank: (car) => car.range,
  },
  acceleration: {
    label: 'Hröðun',
    urlWord: 'hrodun',
    defaultDirection: 'asc',
    rank: (car) => car.acceleration,
  },
  value: {
    label: 'Verði á km',
    urlWord: 'virdi',
    defaultDirection: 'asc',
    rank: (car) => car.pricePerKm,
  },
  fastcharge: {
    label: 'Hraðhleðslu',
    urlWord: 'hradhledslu',
    defaultDirection: 'desc',
    rank: (car) => car.kmPerMinuteCharged,
  },
}

export const sortings = Object.keys(sortingDefinitions) as Array<Sorting>

const defaultDirection = (sorting: Sorting): SortingDirection =>
  sortingDefinitions[sorting].defaultDirection

export const flipDirection = (direction: SortingDirection): SortingDirection =>
  direction === 'asc' ? 'desc' : 'asc'

export const isDefaultDirection = (
  sorting: Sorting,
  direction: SortingDirection,
): boolean => defaultDirection(sorting) === direction

// localeCompare with no locale answers to whatever the runtime's default is,
// which is not the same in node as in the browser: an Ö or a Þ would sort one
// way on the server and another after hydration. One collator, reused.
const collator = new Intl.Collator('is')

const compareKeys = (a: number | string, b: number | string): number =>
  typeof a === 'string' && typeof b === 'string'
    ? collator.compare(a, b)
    : (a as number) - (b as number)

/**
 * The car list in the order the page shows it. Each car's key is derived once
 * rather than inside every comparison, and `sort` is stable by specification,
 * so equal-ranked cars keep the order the data gave them.
 */
export const sortCars = (
  cars: ReadonlyArray<Car>,
  sorting: Sorting,
  direction: SortingDirection = defaultDirection(sorting),
): Array<Car> => {
  const order = direction === 'asc' ? 1 : -1
  const { rank } = sortingDefinitions[sorting]
  const keyed = cars.map((car) => [car, rank(car)] as const)

  keyed.sort(([, a], [, b]) => order * compareKeys(a, b))

  return keyed.map(([car]) => car)
}

const parseAsSorting = parseAsWord<Sorting>(
  Object.fromEntries(
    sortings.map((sorting) => [sortingDefinitions[sorting].urlWord, sorting]),
  ),
)

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
    ? flipDirection(defaultDirection(sorting))
    : defaultDirection(sorting),
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
