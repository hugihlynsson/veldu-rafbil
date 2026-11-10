import type { CarSpecs } from '@/modules/data/evDatabase'

export interface CachedPage {
  specs: CarSpecs
  /** When it was read, in ms since the epoch */
  read: number
}

export type PageCache = Record<string, CachedPage>

// A car's page changes with a new model year, not between two runs of a
// sweep, and ev-database answers 429 after some 200 pages read in a row
export const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

/** The pages a run has to fetch: those not read, or read too long ago */
export const pagesToRead = (
  urls: ReadonlyArray<string>,
  cache: Readonly<PageCache>,
  now: number,
): string[] =>
  urls.filter((url) => {
    const page = cache[url]
    return !page || now - page.read > MAX_AGE_MS
  })
