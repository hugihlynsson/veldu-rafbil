import getKmPerMinutesCharged from './getKmPerMinutesCharged'
import {
  NewCar,
  SearchParams,
  Sorting,
  SortingDirection,
  SortingQuery,
} from '../types'
import getPriceWithGrant from './getPriceWithGrant'

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

// A repeated parameter arrives as an array; neither of these is a list
const first = (
  value: string | Array<string> | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value)

export const getSortingFromQuery = ({ radaeftir }: SearchParams): Sorting => {
  const value = first(radaeftir)
  return value && value in queryToSorting ? queryToSorting[value] : 'name'
}

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

const padPrice = (car: NewCar): string =>
  getPriceWithGrant(car.price).toString().padStart(9, '0')

// Always ascending on the underlying value, direction is applied afterwards
const ascendingSorter =
  (sorting: Sorting) =>
  (a: NewCar, b: NewCar): number => {
    switch (sorting) {
      case 'name':
        return `${a.make} ${a.model} ${padPrice(a)}`.localeCompare(
          `${b.make} ${b.model} ${padPrice(b)}`,
        )
      case 'price':
        return getPriceWithGrant(a.price) - getPriceWithGrant(b.price)
      case 'range':
        return a.range - b.range
      case 'acceleration':
        return a.acceleration - b.acceleration
      case 'value':
        return (
          getPriceWithGrant(a.price) / a.range -
          getPriceWithGrant(b.price) / b.range
        )
      case 'fastcharge':
        return (
          Number(getKmPerMinutesCharged(a.timeToCharge10T080, a.range)) -
          Number(getKmPerMinutesCharged(b.timeToCharge10T080, b.range))
        )
    }
  }

export const carSorter =
  (sorting: Sorting, direction: SortingDirection = defaultDirection[sorting]) =>
  (a: NewCar, b: NewCar): number => {
    const result = ascendingSorter(sorting)(a, b)
    return direction === 'asc' ? result : -result
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
