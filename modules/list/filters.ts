import {
  createLoader,
  createMultiParser,
  createParser,
  createSerializer,
  type MultiParserBuilder,
  type SingleParserBuilder,
} from 'nuqs/server'

import type { Car, Availability } from '@/modules/data/cars'
import type { Drive } from '@/modules/data/newCarSchema'
// Relative: next.config.ts loads this file, and its loader cannot resolve @/
import { drives } from '../data/drives'

/**
 * What Next hands a page as `searchParams`. A parameter given more than once
 * arrives as an array rather than a string, so every reader copes with both.
 */
export type SearchParams = Record<string, string | Array<string> | undefined>

export type Filters = {
  acceleration?: number
  drive?: Drive[]
  fastcharge?: number
  name?: string[]
  price?: number
  range?: number
  seats?: number
  value?: number
  availability?: Availability
}

type Value<Key extends keyof Filters> = NonNullable<Filters[Key]>

interface FilterDefinition<Key extends keyof Filters> {
  // Icelandic, and part of every link to the list that has been shared
  urlKey: string
  parser: SingleParserBuilder<Value<Key>> | MultiParserBuilder<Value<Key>>
  // Built from the value once, so the per-car work is a comparison
  test: (value: Value<Key>) => (car: Car) => boolean
}

// Number() of an unreadable parameter is NaN, and every comparison against NaN
// is false, so it would empty the list rather than filter it.
const positive = (value: string): number | null => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const parseAsPositive = createParser({ parse: positive, serialize: String })

// A price is a whole number of krónur, and the URL can carry a fraction: it
// renders as a price and breaks the zero-padded tiebreak in the name sort.
// Rounding can land on zero, which is no more a price than a negative one is.
const parseAsKronur = createParser({
  parse: (value) => {
    const kronur = Math.round(positive(value) ?? 0)
    return kronur > 0 ? kronur : null
  },
  serialize: String,
})

// A seat count is a whole number of people. The UI offers a short list, but
// the URL can carry anything, and half a seat would render in the chip.
const parseAsSeats = createParser({
  parse: (value) => {
    const parsed = positive(value)
    return parsed === null ? null : Math.ceil(parsed)
  },
  serialize: String,
})

// Written as one comma separated value, read in that form or repeated
const parseAsList = <T extends string>(accept: (entry: string) => entry is T) =>
  createMultiParser<T[]>({
    parse: (values) => {
      const entries = values
        .flatMap((value) => value.split(','))
        .map((entry) => entry.trim())
        .filter(accept)
      return entries.length ? entries : null
    },
    serialize: (entries) => [entries.join(',')],
    eq: (a, b) =>
      a.length === b.length && a.every((entry, i) => entry === b[i]),
  })

/**
 * A lookup rather than parseAsStringLiteral, as the URL words are Icelandic.
 * hasOwn rather than `in`: every object has a `toString`, and it is not one of
 * these, however plausible the URL that asks for it looks.
 */
const parseAsWord = <T extends string>(words: Record<string, T>) =>
  createParser<T>({
    parse: (value) => (Object.hasOwn(words, value) ? words[value] : null),
    serialize: (value) =>
      Object.keys(words).find((word) => words[word] === value) ?? '',
  })

/**
 * Every filter, whole: where it lives in the URL, how it reads from there and
 * what it asks of a car. Mapped over `Filters`, so a new filter does not
 * compile until it has all three. In the order the chips stand in, which the
 * filter suggestions keep as well.
 */
export const filterDefinitions: {
  [Key in keyof Filters]-?: FilterDefinition<Key>
} = {
  name: {
    urlKey: 'nafn',
    parser: parseAsList((entry): entry is string => entry !== ''),
    test: (names) => {
      const lowered = names.map((name) => name.toLowerCase())
      return (car) => {
        const label = car.label.toLowerCase()
        return lowered.some((name) => label.includes(name))
      }
    },
  },
  price: {
    urlKey: 'verd',
    parser: parseAsKronur,
    test: (max) => (car) => car.priceWithGrant <= max,
  },
  range: {
    urlKey: 'draegni',
    parser: parseAsPositive,
    test: (min) => (car) => car.range >= min,
  },
  seats: {
    urlKey: 'saeti',
    parser: parseAsSeats,
    test: (min) => (car) => car.seats >= min,
  },
  drive: {
    urlKey: 'drif',
    parser: parseAsList((entry): entry is Drive =>
      (drives as ReadonlyArray<string>).includes(entry),
    ),
    test: (drives) => (car) => drives.includes(car.drive),
  },
  acceleration: {
    urlKey: 'hrodun',
    parser: parseAsPositive,
    test: (max) => (car) => car.acceleration <= max,
  },
  value: {
    urlKey: 'virdi',
    parser: parseAsKronur,
    test: (max) => (car) => car.pricePerKm <= max,
  },
  fastcharge: {
    urlKey: 'hradhledsla',
    parser: parseAsPositive,
    test: (min) => (car) => car.kmPerMinuteCharged >= min,
  },
  availability: {
    urlKey: 'frambod',
    parser: parseAsWord<Availability>({
      faanlegir: 'available',
      vaentanlegir: 'expected',
    }),
    test: (availability) => (car) => car.availability === availability,
  },
}

export type FilterKey = keyof Filters

export const filterKeys = Object.keys(filterDefinitions) as Array<FilterKey>

const mapDefinitions = <T>(
  pick: (definition: FilterDefinition<FilterKey>) => T,
): Record<FilterKey, T> =>
  Object.fromEntries(
    filterKeys.map((key) => [
      key,
      pick(filterDefinitions[key] as FilterDefinition<FilterKey>),
    ]),
  ) as Record<FilterKey, T>

// What nuqs is handed, on the server and in the browser alike
export const filterParsers = mapDefinitions(
  (definition) => definition.parser,
) as {
  [Key in FilterKey]: (typeof filterDefinitions)[Key]['parser']
}
export const filterUrlKeys = mapDefinitions((definition) => definition.urlKey)

/** nuqs speaks in nulls; the rest of the site in absent keys */
export type FilterValues = { [Key in FilterKey]: Value<Key> | null }

// Assigned only when the parameter reads as a filter, so "is there a filter"
// can go on being asked with Object.keys/values all over the UI
export const filtersFromValues = (values: FilterValues): Filters =>
  Object.fromEntries(
    filterKeys.flatMap((key) =>
      values[key] === null ? [] : [[key, values[key]]],
    ),
  )

/**
 * The other way, every key present so the ones switched off are cleared. A
 * value is put through its own parser first: one that would not read back — a
 * zero, an empty list — is the absence of a filter, and must not reach the URL.
 */
export const valuesFromFilters = (filters: Filters): FilterValues =>
  Object.fromEntries(
    filterKeys.map((key) => {
      const value = filters[key]
      if (value === undefined) return [key, null]

      const { parser } = filterDefinitions[key] as FilterDefinition<FilterKey>
      const written = parser.serialize(value as never)
      return [key, parser.parse(written as never)]
    }),
  ) as FilterValues

/**
 * The filters as the list will apply them once they are in the URL, so a
 * suggestion is counted against what the list would really show.
 */
export const normalizeFilters = (filters: Filters): Filters =>
  filtersFromValues(valuesFromFilters(filters))

const loadFilterValues = createLoader(filterParsers, { urlKeys: filterUrlKeys })

export const getFiltersFromQuery = (query: SearchParams): Filters =>
  filtersFromValues(loadFilterValues(query) as FilterValues)

const serializeFilterValues = createSerializer(filterParsers, {
  urlKeys: filterUrlKeys,
})

/** The query string for a set of filters, `?` and all, or '' for none */
export const serializeFilters = (filters: Filters): string =>
  serializeFilterValues(valuesFromFilters(filters))

/**
 * The filter modal's fields, as typed. Each is read by its filter's own URL
 * parser, so a field means what the same text in a link would, and a zero or
 * a lone comma typed on the way to something else is no filter.
 */
export type FilterFields = Partial<Record<FilterKey, string>>

/** A value as its field holds it, which for a select is the option's value */
export const fieldFromFilter = <Key extends FilterKey>(
  key: Key,
  value: Value<Key>,
): string => {
  // As people type a list, where the URL leaves out the space
  if (Array.isArray(value)) return value.join(', ')
  const { parser } = filterDefinitions[key] as FilterDefinition<FilterKey>
  return parser.serialize(value as never) as string
}

export const fieldsFromFilters = (filters: Filters): FilterFields =>
  Object.fromEntries(
    filterKeys.flatMap((key) => {
      const value = filters[key]
      return value === undefined ? [] : [[key, fieldFromFilter(key, value)]]
    }),
  )

const loadFilterFields = createLoader(filterParsers)

export const filtersFromFields = (fields: FilterFields): Filters =>
  filtersFromValues(loadFilterFields(fields) as FilterValues)
