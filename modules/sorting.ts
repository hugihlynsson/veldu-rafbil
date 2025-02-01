import getKmPerMinutesCharged from './getKmPerMinutesCharged'
import { NewCar, Sorting, SortingQuery } from '../types'
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

export const getSortingFromQuery = ({ radaeftir }: Record<string, string>) =>
  radaeftir in queryToSorting ? queryToSorting[radaeftir] : 'name'

const padPrice = (car: NewCar): string =>
  getPriceWithGrant(car.price).toString().padStart(9, '0')

export const carSorter =
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
        return b.range - a.range
      case 'acceleration':
        return a.acceleration - b.acceleration
      case 'value':
        return (
          getPriceWithGrant(a.price) / a.range -
          getPriceWithGrant(b.price) / b.range
        )
      case 'fastcharge':
        return (
          Number(getKmPerMinutesCharged(b.timeToCharge10T080, b.range)) -
          Number(getKmPerMinutesCharged(a.timeToCharge10T080, a.range))
        )
    }
  }
