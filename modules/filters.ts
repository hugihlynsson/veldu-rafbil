import { Drive, Filters, SearchParams } from '../types'

// Multi-value filters travel as a comma separated list, and a repeated
// parameter arrives as an array, so handle both shapes.
const parseList = (value: string | Array<string>): Array<string> =>
  (Array.isArray(value) ? value : [value])
    .flatMap((entry) => entry.split(','))
    .map((entry) => entry.trim())
    .filter((entry) => entry)

// Number() of an unreadable parameter is NaN, and every comparison against NaN
// is false, so it would empty the list rather than filter it.
const parseNumber = (value: string | Array<string>): number | undefined => {
  const parsed = Number(Array.isArray(value) ? value[0] : value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

// A price is a whole number of krónur, and the URL can carry a fraction: it
// renders as a price and breaks the zero-padded tiebreak in the name sort.
const parseKronur = (value: string | Array<string>): number | undefined => {
  const parsed = parseNumber(value)
  if (parsed === undefined) return undefined

  const kronur = Math.round(parsed)
  // Rounding can land on zero, which is no more a price than a negative one is
  return kronur > 0 ? kronur : undefined
}

export const getFiltersFromQuery = (query: SearchParams): Filters => {
  const filters: Filters = {}

  const { hrodun, drif, hradhledsla, nafn, verd, draegni, virdi, frambod } =
    query

  if (hrodun) filters.acceleration = parseNumber(hrodun)
  if (drif) {
    const drive = parseList(drif) as Array<Drive>
    if (drive.length) filters.drive = drive
  }
  if (hradhledsla) filters.fastcharge = parseNumber(hradhledsla)
  if (nafn) {
    const name = parseList(nafn)
    if (name.length) filters.name = name
  }
  if (verd) filters.price = parseKronur(verd)
  if (draegni) filters.range = parseNumber(draegni)
  if (virdi) filters.value = parseKronur(virdi)
  if (frambod)
    filters.availability = frambod === 'faanlegir' ? 'available' : 'expected'

  // "Is there a filter" is asked with Object.keys/values all over the UI
  for (const key of Object.keys(filters) as Array<keyof Filters>) {
    if (filters[key] === undefined) delete filters[key]
  }

  return filters
}

// Cleared before writing, so switching a filter off takes its parameter
export const filterQueryKeys = [
  'nafn',
  'hrodun',
  'frambod',
  'drif',
  'hradhledsla',
  'verd',
  'draegni',
  'virdi',
] as const

export const getQueryFromFilters = (
  filters: Filters,
): Record<string, string> => {
  const query: Record<string, string> = {}

  // A zero or an empty list is no filter, the way the reader treats one too
  const set = (key: string, value: string | number | undefined) => {
    if (value) query[key] = String(value)
  }

  set('nafn', filters.name?.join(','))
  set('hrodun', filters.acceleration)
  set(
    'frambod',
    filters.availability &&
      (filters.availability === 'available' ? 'faanlegir' : 'vaentanlegir'),
  )
  set('drif', filters.drive?.join(','))
  set('hradhledsla', filters.fastcharge)
  set('verd', filters.price)
  set('draegni', filters.range)
  set('virdi', filters.value)

  return query
}
