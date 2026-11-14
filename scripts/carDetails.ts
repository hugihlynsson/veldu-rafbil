import { z } from 'zod'

import type { Car } from '@/modules/data/cars'
import type { CarSpecs } from '@/modules/data/evDatabase'
import { carSlug } from '@/modules/data/getCarId'
import { bodyNames, readDetails, type CarDetails } from './reviewPrompt'
import { LIST_URL } from './evDatabaseList'

const litres = z.int().min(0).max(5000).optional()

/**
 * What scripts/carDetails.json holds for a car, by its slug: the figures a
 * review needs that the list does not carry, and where they were read. The
 * bounds are plausibility, as on a car itself
 */
export const detailsEntrySchema = z.strictObject({
  /** The car's ev-database page, its front-page list, or any page read by hand */
  source: z.url({ protocol: /^https$/ }),
  read: z.iso.date(),
  // Written by hand in ev-database's words, which reviewPrompt translates
  body: z
    .string()
    .refine((body) => Object.hasOwn(bodyNames, body), {
      error: 'not a body reviewPrompt has Icelandic words for',
    })
    .optional(),
  segment: z.string().min(1).optional(),
  length: z.int().min(2500).max(6500).optional(),
  cargo: litres,
  cargoMax: litres,
  frunk: litres,
  towing: z.int().min(0).max(5000).optional(),
  warrantyYears: z.int().min(1).max(20).optional(),
  warrantyKm: z.int().min(10_000).max(2_000_000).optional(),
})

// Not inferred from the schema, which a page naming a new body would fail:
// the file's test catches that, rather than the run that read it
export type DetailsEntry = CarDetails & { source: string; read: string }
export type DetailsFile = Record<string, DetailsEntry>

// A car's page changes with a new model year, and reading all of them again
// is what ev-database answers with a block lasting weeks
export const MAX_AGE_DAYS = 365

/** An entry from specs read off ev-database, with only the figures it gave */
export const entryFrom = (
  specs: CarSpecs,
  source: string,
  today: string,
): DetailsEntry => {
  const details = Object.entries(readDetails(specs)).filter(
    ([, value]) => value !== undefined,
  )
  return { source, read: today, ...Object.fromEntries(details) }
}

/** The cars with no entry at all, which a run looks up before writing */
export const lacking = (
  cars: ReadonlyArray<Car>,
  file: Readonly<DetailsFile>,
): Car[] => cars.filter((car) => !file[carSlug(car)])

/**
 * The cars whose ev-database page is worth reading again: those read off the
 * list, which lacks a page's length, frunk and warranty, and those read too
 * long ago. An entry written by hand is kept as it is
 */
export const toRefresh = (
  cars: ReadonlyArray<Car>,
  file: Readonly<DetailsFile>,
  today: string,
): Car[] =>
  cars.filter((car) => {
    const entry = file[carSlug(car)]
    if (!car.evDatabaseUrl || !entry) return Boolean(car.evDatabaseUrl)
    if (entry.source === LIST_URL) return true
    const age = (Date.parse(today) - Date.parse(entry.read)) / 86_400_000
    return entry.source === car.evDatabaseUrl && age > MAX_AGE_DAYS
  })

/** The file as saved: every car on the list, in its order, and no other */
export const pruned = (
  cars: ReadonlyArray<Car>,
  file: Readonly<DetailsFile>,
): DetailsFile =>
  Object.fromEntries(
    cars.flatMap((car) => {
      const entry = file[carSlug(car)]
      return entry ? [[carSlug(car), entry] as const] : []
    }),
  )
