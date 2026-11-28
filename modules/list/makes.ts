import cars from '@/modules/data/cars'
import { makeAliases, makeKey, splitAtMakes } from './carNames'
import type { Filters } from './filters'

export const makes = [...new Set(cars.map((car) => car.make))]

// The locale named, as the runtime's default differs between node and an
// Icelandic browser, and this is rendered on both
export const makesInOrder = [...makes].sort((a, b) => a.localeCompare(b, 'is'))

const carCounts = new Map<string, number>()
for (const car of cars) {
  carCounts.set(car.make, (carCounts.get(car.make) ?? 0) + 1)
}

export const carCountOf = (make: string): number => carCounts.get(make) ?? 0

/**
 * The makes chosen most without the row's help, typed or picked from the sheet
 * of every make, with comparisons breaking a close call; late November 2026,
 * most first. Not taps on the row, which follow a chip's place in it, nor car
 * views, which follow price, as the list opens cheapest first. Fixed
 * rather than counted, so the row never reorders under a thumb, and re-picked
 * from the filters_changed events now and then.
 */
export const rowMakes = [
  'Tesla',
  'XPENG',
  'Skoda',
  'Kia',
  'BYD',
  'Hyundai',
  'BMW',
  'Leapmotor',
  'Volvo',
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
