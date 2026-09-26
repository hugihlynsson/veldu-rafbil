/**
 * What Next hands a page as `searchParams`. A parameter given more than once
 * arrives as an array rather than a string, so every reader copes with both.
 */
export type SearchParams = Record<string, string | Array<string> | undefined>

import type { Drive, NewCar } from './modules/newCarSchema'

export type { Drive, NewCar }

export type Availability = 'available' | 'expected'

export type Filters = {
  acceleration?: number
  drive?: Drive[]
  fastcharge?: number
  name?: string[]
  price?: number
  range?: number
  seats?: number
  value?: number
  availability?: Availability
}

export type Sorting =
  | 'name'
  | 'price'
  | 'range'
  | 'acceleration'
  | 'value'
  | 'fastcharge'

export type SortingDirection = 'asc' | 'desc'

export type SortingQuery =
  | 'nafni'
  | 'verdi'
  | 'draegni'
  | 'hrodun'
  | 'virdi'
  | 'hradhledslu'
