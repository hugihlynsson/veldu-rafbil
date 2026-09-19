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

export const getFiltersFromQuery = (query: ParsedUrlQuery): Filters => {
  let filters: Filters = {}

  let { hrodun, drif, hradhledsla, nafn, verd, draegni, virdi, frambod } = query

  if (hrodun) filters.acceleration = Number(hrodun)
  if (drif) {
    const drive = parseList(drif) as Array<Drive>
    if (drive.length) filters.drive = drive
  }
  if (hradhledsla) filters.fastcharge = Number(hradhledsla)
  if (nafn) {
    const name = parseList(nafn)
    if (name.length) filters.name = name
  }
  if (verd) filters.price = Number(verd)
  if (draegni) filters.range = Number(draegni)
  if (virdi) filters.value = Number(virdi)
  if (frambod)
    filters.availability = frambod === 'faanlegir' ? 'available' : 'expected'

  return filters
}
