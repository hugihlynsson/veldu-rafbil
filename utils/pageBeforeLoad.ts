import { pageKinds, type PageKind } from '@/modules/analytics/visit'

const STORAGE_KEY = 'veldu-rafbil-page-before-load'

/**
 * The page a full load in this tab is asked for from, which the next page
 * would otherwise read as an arrival: a link within the site never reloads,
 * so only a page that loads the next on purpose leaves one.
 */
export const leavePageBeforeLoad = (kind: PageKind) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, kind)
  } catch {
    // Without storage the page reads as an arrival, as it did before
  }
}

/** The page left before this load, read once */
export const takePageBeforeLoad = (): PageKind | undefined => {
  try {
    const kind = sessionStorage.getItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    return pageKinds.find((known) => known === kind)
  } catch {
    return undefined
  }
}
