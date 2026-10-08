import { startTransition } from 'react'
import { useQueryStates } from 'nuqs'

import type { Filters } from '@/modules/list/filters'
import type { Sorting } from '@/modules/list/sorting'
import {
  FilterValues,
  filterParsers,
  filterUrlKeys,
  filtersFromValues,
  valuesFromFilters,
} from '@/modules/list/filters'
import {
  sortingParsers,
  sortingUrlKeys,
  stateFromSortingValues,
} from '@/modules/list/sorting'

// Shallow, and replacing rather than pushing, both nuqs defaults: a sort or a
// filter is a view of the one page, not a page of its own to go back to.
// Each change is a transition, as only a transition plays the cards'
// <ViewTransition>; nuqs sets its state within the call, so wrapping it does.
const inTransition = (change: () => unknown) =>
  startTransition(() => void change())

export const useFilters = () => {
  const [values, setValues] = useQueryStates(filterParsers, {
    urlKeys: filterUrlKeys,
  })

  const filters = filtersFromValues(values as FilterValues)

  const setFilters = (next: Filters) =>
    inTransition(() => setValues(valuesFromFilters(next)))

  const removeFilter = (name: keyof Filters) =>
    inTransition(() => setValues({ [name]: null }))

  return { filters, setFilters, removeFilter }
}

export const useSorting = () => {
  const [values, setValues] = useQueryStates(sortingParsers, {
    urlKeys: sortingUrlKeys,
  })

  const { sorting, direction } = stateFromSortingValues(values)

  // The active sorting flips; another one starts in its default direction
  const toggleSorting = (value: Sorting) =>
    inTransition(() =>
      setValues(
        value === sorting
          ? { flipped: !values.flipped }
          : { sorting: value, flipped: false },
      ),
    )

  return { sorting, direction, toggleSorting }
}
