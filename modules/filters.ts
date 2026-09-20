import { Drive, Filters, SearchParams } from '../types'

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

// ISK has no subunit: a price is a whole number of krónur, and so is the
// price-per-km these two compare against. Nothing in the UI can produce a
// fraction, but the filters come out of the URL, where a shared or hand-edited
// link can carry one — and a fractional price is not a price. It renders as
// one in the chip offering to remove it, reads out to a screen reader the
// same, and breaks the zero-padded tiebreak in the name sort, which puts a
// 9.5m car after a 12m one. Round it to krónur at the boundary, so nothing
// downstream has to know this can happen.
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

  // An unreadable number leaves the key behind with undefined against it, and
  // "is there a filter" is asked with Object.keys/values all over the UI
  for (const key of Object.keys(filters) as Array<keyof Filters>) {
    if (filters[key] === undefined) delete filters[key]
  }

  return filters
}
