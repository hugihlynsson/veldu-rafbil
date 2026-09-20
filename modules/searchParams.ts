import { SearchParams } from '../types'

type Param = SearchParams[string]

// A parameter given more than once arrives as an array. Nothing the site reads
// is a list at this level — the multi-value filters travel as one comma
// separated value — so the first occurrence is the answer everywhere.
export const first = (value: Param): string | undefined =>
  Array.isArray(value) ? value[0] : value

// The comma separated form, tolerating the repeated one as well
export const list = (value: Param): Array<string> =>
  (value === undefined ? [] : Array.isArray(value) ? value : [value])
    .flatMap((entry) => entry.split(','))
    .map((entry) => entry.trim())
    .filter((entry) => entry)

/**
 * Reads a parameter as one of a known set, so an unknown value is no filter.
 * hasOwn rather than `in`: every object has a `toString`, and it is not one of
 * these, however plausible the URL that asks for it looks.
 */
export const oneOf = <T extends string>(
  value: Param,
  values: Record<string, T>,
): T | undefined => {
  const parsed = first(value)
  return parsed !== undefined && Object.hasOwn(values, parsed)
    ? values[parsed]
    : undefined
}
