import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'veldu-rafbil-list-search'

/**
 * Keeps the list's sort, filters and view as someone leaves it for a
 * comparison, so the way back is to the list they left. In this tab only: a
 * comparison opened from a link someone sent goes back to the plain list.
 */
export const rememberListSearch = (search: string) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, search)
  } catch {
    // Without storage the way back is the plain list, which is fine
  }
}

const readListHref = (): string => {
  try {
    const search = sessionStorage.getItem(STORAGE_KEY)
    return search?.startsWith('?') ? `/${search}` : '/'
  } catch {
    return '/'
  }
}

const noSubscription = () => () => {}

/** The list as it was left; the plain list on the server and until hydrated */
export const useListHref = (): string =>
  useSyncExternalStore(noSubscription, readListHref, () => '/')
