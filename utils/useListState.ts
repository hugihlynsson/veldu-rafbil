import { useQueryStates } from 'nuqs'

import type { Filters } from '@/modules/list/filters'
import type { Sorting } from '@/modules/list/sorting'
import type { View } from '@/modules/list/view'
import { viewParsers, viewUrlKeys } from '@/modules/list/view'
import {
  FilterValues,
  filterParsers,
  filterUrlKeys,
  filtersFromValues,
  valuesFromFilters,
} from '@/modules/list/filters'
import {
  isDefaultDirection,
  sortingParsers,
  sortingUrlKeys,
  stateFromSortingValues,
  toggledSorting,
  type SortingState,
} from '@/modules/list/sorting'

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

  /** Applies a tap on a sorting's toggle, and says what it led to */
  const toggleSorting = (value: Sorting): SortingState => {
    const next = toggledSorting({ sorting, direction }, value)
    void setValues({
      sorting: next.sorting,
      flipped: !isDefaultDirection(next.sorting, next.direction),
    })
    return next
  }

  return { sorting, direction, toggleSorting }
}

export const useView = () => {
  const [{ view }, setValues] = useQueryStates(viewParsers, {
    urlKeys: viewUrlKeys,
  })

  return { view, setView: (view: View) => void setValues({ view }) }
}
