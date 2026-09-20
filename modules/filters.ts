import { Availability, Drive, Filters, SearchParams } from '../types'
import { first, list, oneOf } from './searchParams'

// Number() of an unreadable parameter is NaN, and every comparison against NaN
// is false, so it would empty the list rather than filter it.
const parseNumber = (value: SearchParams[string]): number | undefined => {
  const parsed = Number(first(value))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

// A price is a whole number of krónur, and the URL can carry a fraction: it
// renders as a price and breaks the zero-padded tiebreak in the name sort.
const parseKronur = (value: SearchParams[string]): number | undefined => {
  const parsed = parseNumber(value)
  if (parsed === undefined) return undefined

  const kronur = Math.round(parsed)
  // Rounding can land on zero, which is no more a price than a negative one is
  return kronur > 0 ? kronur : undefined
}

const parseNonEmptyList = (
  value: SearchParams[string],
): Array<string> | undefined => {
  const entries = list(value)
  return entries.length ? entries : undefined
}

// A seat count is a whole number of people. The UI offers a short list, but
// the URL can carry anything, and half a seat would render in the chip.
const parseSeats = (value: SearchParams[string]): number | undefined => {
  const parsed = parseNumber(value)
  return parsed === undefined ? undefined : Math.ceil(parsed)
}

const queryToAvailability: Record<string, Availability> = {
  faanlegir: 'available',
  vaentanlegir: 'expected',
}

export const getFiltersFromQuery = (query: SearchParams): Filters => {
  const filters: Filters = {}

  // Assigned only when the parameter reads as a filter, so "is there a filter"
  // can go on being asked with Object.keys/values all over the UI
  const set = <Key extends keyof Filters>(
    key: Key,
    value: Filters[Key] | undefined,
  ) => {
    if (value !== undefined) filters[key] = value
  }

  set('acceleration', parseNumber(query.hrodun))
  set('drive', parseNonEmptyList(query.drif) as Array<Drive> | undefined)
  set('fastcharge', parseNumber(query.hradhledsla))
  set('name', parseNonEmptyList(query.nafn))
  set('price', parseKronur(query.verd))
  set('range', parseNumber(query.draegni))
  set('seats', parseSeats(query.saeti))
  set('value', parseKronur(query.virdi))
  set('availability', oneOf(query.frambod, queryToAvailability))

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
  'saeti',
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
  set('saeti', filters.seats)
  set('virdi', filters.value)

  return query
}
