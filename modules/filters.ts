import { ParsedUrlQuery } from 'querystring'
import { Drive, Filters } from '../types'

// The multi-value filters are written to the URL as a comma separated list
// (see useFilters in app/newCars), so they have to be split apart again. A
// repeated param arrives as an array instead, so handle both shapes.
const parseList = (value: string | Array<string>): Array<string> =>
  (Array.isArray(value) ? value : [value])
    .flatMap((entry) => entry.split(','))
    .map((entry) => entry.trim())
    .filter((entry) => entry)

// Every numeric filter is a threshold that gets compared against a car. Number
// of anything unparseable is NaN, and every comparison against NaN is false,
// so one hand-edited or truncated parameter used to empty the whole list and
// put "NaN kr." in the chip above it. A parameter we cannot read is no filter.
const parseNumber = (value: string | Array<string>): number | undefined => {
  const parsed = Number(Array.isArray(value) ? value[0] : value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

export const getFiltersFromQuery = (query: ParsedUrlQuery): Filters => {
  let filters: Filters = {}

  let { hrodun, drif, hradhledsla, nafn, verd, draegni, virdi, frambod } = query

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
  if (verd) filters.price = parseNumber(verd)
  if (draegni) filters.range = parseNumber(draegni)
  if (virdi) filters.value = parseNumber(virdi)
  if (frambod)
    filters.availability = frambod === 'faanlegir' ? 'available' : 'expected'

  // An unreadable number leaves the key behind with undefined against it, and
  // "is there a filter" is asked with Object.keys/values all over the UI
  for (const key of Object.keys(filters) as Array<keyof Filters>) {
    if (filters[key] === undefined) delete filters[key]
  }

  return filters
}
