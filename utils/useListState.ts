import { useQueryStates } from 'nuqs'

import { Filters, Sorting } from '@/types'
import {
  FilterValues,
  filterParsers,
  filterUrlKeys,
  filtersFromValues,
  valuesFromFilters,
} from '@/modules/filters'
import {
  sortingParsers,
  sortingUrlKeys,
  stateFromSortingValues,
} from '@/modules/sorting'

// Shallow, and replacing rather than pushing, both nuqs defaults: a sort or a
// filter is a view of the one page, not a page of its own to go back to
export const useFilters = () => {
  const [values, setValues] = useQueryStates(filterParsers, {
    urlKeys: filterUrlKeys,
  })

  const filters = filtersFromValues(values as FilterValues)

  const setFilters = (next: Filters) => void setValues(valuesFromFilters(next))

  const removeFilter = (name: keyof Filters) => void setValues({ [name]: null })

  return { filters, setFilters, removeFilter }
}

export const useSorting = () => {
  const [values, setValues] = useQueryStates(sortingParsers, {
    urlKeys: sortingUrlKeys,
  })

  const { sorting, direction } = stateFromSortingValues(values)

  // The active sorting flips; another one starts in its default direction
  const toggleSorting = (value: Sorting) =>
    void setValues(
      value === sorting
        ? { flipped: !values.flipped }
        : { sorting: value, flipped: false },
    )

  return { sorting, direction, toggleSorting }
}
