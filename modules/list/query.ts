import { createLoader, createSerializer } from 'nuqs/server'

import {
  filterParsers,
  filterUrlKeys,
  filtersFromValues,
  valuesFromFilters,
  type FilterValues,
  type Filters,
} from './filters'
import {
  isDefaultDirection,
  sortingParsers,
  sortingUrlKeys,
  stateFromSortingValues,
  type SortingState,
} from './sorting'
import { viewParsers, viewUrlKeys, type View } from './view'

// The list's state as a query string and back, built from the parsers and
// keys useListState hands nuqs, so a link round-trips here as it does on the
// page. The page itself never imports this: it is what the tests hold the
// URL to, kept out of the modules every visitor downloads.

/**
 * A query as Next hands a page its `searchParams`. A parameter given more
 * than once arrives as an array rather than a string, so every reader copes
 * with both.
 */
export type SearchParams = Record<string, string | Array<string> | undefined>

const loadFilterValues = createLoader(filterParsers, { urlKeys: filterUrlKeys })

export const getFiltersFromQuery = (query: SearchParams): Filters =>
  filtersFromValues(loadFilterValues(query) as FilterValues)

const serializeFilterValues = createSerializer(filterParsers, {
  urlKeys: filterUrlKeys,
})

/** The query string for a set of filters, `?` and all, or '' for none */
export const serializeFilters = (filters: Filters): string =>
  serializeFilterValues(valuesFromFilters(filters))

const loadSortingValues = createLoader(sortingParsers, {
  urlKeys: sortingUrlKeys,
})

export const getSortingFromQuery = (query: SearchParams): SortingState =>
  stateFromSortingValues(loadSortingValues(query))

const serializeSortingValues = createSerializer(sortingParsers, {
  urlKeys: sortingUrlKeys,
})

/** The query string for a sorting, `?` and all, or '' for the default */
export const serializeSorting = ({
  sorting,
  direction,
}: SortingState): string =>
  serializeSortingValues({
    sorting,
    flipped: !isDefaultDirection(sorting, direction),
  })

const loadView = createLoader(viewParsers, { urlKeys: viewUrlKeys })

export const getViewFromQuery = (query: SearchParams): View =>
  loadView(query).view

const serializeViewValues = createSerializer(viewParsers, {
  urlKeys: viewUrlKeys,
})

/** The query string for a view, `?` and all, or '' for the default */
export const serializeView = (view: View): string =>
  serializeViewValues({ view })
