import cars from '@/modules/data/cars'
import { foldText, makeAliases, splitAtMakes } from './carNames'
import type { Filters } from './filters'

export const makes = [...new Set(cars.map((car) => car.make))]

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
]

// "Range Rover", "range-rover" and "rangerover" are one make
const makeKey = (text: string) => foldText(text).replace(/[^\p{L}\p{N}]/gu, '')

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
 * the row looks for.
 */
export const liftMakes = (filters: Filters): Filters => {
  const { make = [], name = [], ...rest } = filters
  const names = splitAtMakes(name, makes)
  const lifted = names.flatMap((entry) => makeByKey.get(makeKey(entry)) ?? [])
  const kept = names.filter((entry) => !makeByKey.has(makeKey(entry)))
  const chosen = [
    ...new Set(
      [...make, ...lifted].map(
        (entry) => makeByKey.get(makeKey(entry)) ?? entry,
      ),
    ),
  ]
  return {
    ...rest,
    ...(chosen.length > 0 && { make: chosen }),
    ...(kept.length > 0 && { name: kept }),
  }
}
