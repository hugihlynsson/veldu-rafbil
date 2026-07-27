import getKmPerMinutesCharged from './getKmPerMinutesCharged'
import {
  NewCar,
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

export const getSortingFromQuery = ({ radaeftir }: Record<string, string>) =>
  radaeftir in queryToSorting ? queryToSorting[radaeftir] : 'name'

export const getDirectionFromQuery = (
  query: Record<string, string>,
): SortingDirection => {
  const base = defaultDirection[getSortingFromQuery(query)]
  return query.ofugt === '1' ? flipDirection(base) : base
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
