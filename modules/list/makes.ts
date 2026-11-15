import cars from '@/modules/data/cars'
import { makeAliases, makeKey, splitAtMakes } from './carNames'
import type { Filters } from './filters'

export const makes = [...new Set(cars.map((car) => car.make))]

// The locale named, as the runtime's default differs between node and an
// Icelandic browser, and this is rendered on both
export const makesInOrder = [...makes].sort((a, b) => a.localeCompare(b, 'is'))

export const carCountOf = (make: string): number =>
  cars.filter((car) => car.make === make).length

/**
 * The makes typed into the search most, October to November 2026, most first.
 * Fixed rather than counted, so the row never reorders under a thumb; the
 * filters_changed events say whether it still holds.
 */
export const rowMakes = [
  'XPENG',
  'Tesla',
  'BYD',
  'Kia',
  'Skoda',
  'BMW',
  'Leapmotor',
  'Volvo',
  'Polestar',
]

const makeByKey = new Map(
  makes.flatMap((make) =>
    [make, ...(makeAliases[make] ?? [])].map(
      (spelling) => [makeKey(spelling), make] as const,
    ),
  ),
)

/**
 * A name that is a make and nothing else is moved to the make filter, so the
 * row shows it chosen: "tesla" typed into the search, or a link from before
 * there was a row. Makes are spelled as the data spells them, which is what
 * the row looks for, and one not on the list is dropped: a link to a make no
 * longer sold shows every car rather than none, and puts no chip in the row.
 */
export const liftMakes = (filters: Filters): Filters => {
  const { make = [], name = [], ...rest } = filters
  const names = splitAtMakes(name, makes)
  const lifted = names.flatMap((entry) => makeByKey.get(makeKey(entry)) ?? [])
  const kept = names.filter((entry) => !makeByKey.has(makeKey(entry)))
  const chosen = [
    ...new Set(
      [...make, ...lifted].flatMap(
        (entry) => makeByKey.get(makeKey(entry)) ?? [],
      ),
    ),
  ]
  return {
    ...rest,
    ...(chosen.length > 0 && { make: chosen }),
    ...(kept.length > 0 && { name: kept }),
  }
}
