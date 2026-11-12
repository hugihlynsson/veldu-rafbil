import type { CarChange } from '@/modules/data/carChanges'
import { newCarSchema, type NewCar } from '@/modules/data/newCarSchema'
import getCarId, { carLabel, carSlug } from '@/modules/data/getCarId'

const fields = Object.keys(newCarSchema.shape) as Array<keyof NewCar>

// What some fields were called in older versions of the data
const formerNames: Readonly<Record<string, keyof NewCar>> = {
  sellerURL: 'sellerUrl',
  evDatabaseURL: 'evDatabaseUrl',
  timeToCharge10T080: 'timeToCharge10To80',
}

// Cars that left the data for never belonging on the list, not for going off
// sale: the N1 vehicles taken out on 2026-11-12, when the list became M1 only.
// The history still has them, so a rebuild would otherwise tell the news they
// came and went.
export const neverListed: ReadonlySet<string> = new Set([
  'jac-t9-ev-base',
  'kgm-musso-ev-4wd',
  'kgm-musso-ev-base',
  'toyota-hilux-base',
  'volkswagen-e-transporter-base',
])

export const withoutNeverListed = (
  entries: ReadonlyArray<CarChange>,
): CarChange[] => entries.filter(({ slug }) => !neverListed.has(slug))

/** A car as one version of newCars.ts had it, under today's field names */
export type CarVersion = Partial<NewCar> & Pick<NewCar, 'make' | 'model'>

/**
 * One version of the data by slug. A field the schema no longer has is left
 * out, and so is a car marked `discontinued`, which is how the data once said
 * what `deprecated` says now, short of keeping the car's page.
 */
export const readVersion = (
  raw: ReadonlyArray<Record<string, unknown>>,
): Map<string, CarVersion> => {
  const version = new Map<string, CarVersion>()
  for (const entry of raw) {
    if (entry.discontinued) continue
    const car: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(entry)) {
      const field = formerNames[key] ?? key
      if (value !== undefined && (fields as string[]).includes(field)) {
        car[field] = value
      }
    }
    const slug = slugOf(car as CarVersion)
    // A copy-paste slip the data once had, before slugs were checked unique
    if (!version.has(slug)) version.set(slug, car as CarVersion)
  }
  return version
}

const slugOf = (car: CarVersion): string =>
  carSlug({ id: getCarId(car as NewCar) })

// One car in place of another in a single change: one gone, one new, and
// alike enough to be the same car under a new name. movedSlugs says so for
// a rename since the cars had pages; before that, the photo and the
// ev-database page are what stayed put.
const pairRenames = (
  gone: Map<string, CarVersion>,
  arrived: Map<string, CarVersion>,
  movedSlugs: Readonly<Record<string, string>>,
): Map<string, string> => {
  const renames = new Map<string, string>()
  const take = (from: string, to: string) => {
    renames.set(from, to)
    gone.delete(from)
    arrived.delete(to)
  }
  for (const from of gone.keys()) {
    const to = movedSlugs[from]
    if (to && arrived.has(to)) take(from, to)
  }
  for (const [from, before] of gone) {
    const match = [...arrived].find(
      ([, after]) =>
        after.make === before.make &&
        ((before.evDatabaseUrl !== undefined &&
          after.evDatabaseUrl === before.evDatabaseUrl) ||
          (after.model === before.model &&
            after.heroImageName === before.heroImageName &&
            after.price === before.price)),
    )
    if (match) take(from, match[0])
  }
  return renames
}

// Only what a buyer would want told. Any other field changing is a
// correction, and the data's own history keeps those.
const changed = (before: CarVersion, after: CarVersion) => {
  const entry: Omit<CarChange, 'date' | 'slug' | 'label'> = {}
  if (before.price !== after.price && after.price !== undefined) {
    entry.price = { from: before.price, to: after.price }
  }
  if (before.expectedDelivery !== after.expectedDelivery) {
    entry.delivery = {
      ...(before.expectedDelivery && { from: before.expectedDelivery }),
      ...(after.expectedDelivery && { to: after.expectedDelivery }),
    }
  }
  if (!before.deprecated && after.deprecated) entry.removed = true
  if (before.deprecated && !after.deprecated) {
    entry.added = true
    // Back on sale says afresh whether it is expected, as going on sale does
    if (after.expectedDelivery && !entry.delivery) {
      entry.delivery = { to: after.expectedDelivery }
    }
  }
  if (carLabel(before as NewCar) !== carLabel(after as NewCar)) {
    entry.renamedFrom = carLabel(before as NewCar)
  }
  return Object.keys(entry).length > 0 ? entry : undefined
}

/**
 * What one change to the data did to each car, and the slugs it renamed,
 * which the entries before it are moved to
 */
export const diffVersions = (
  before: Map<string, CarVersion>,
  after: Map<string, CarVersion>,
  date: string,
  movedSlugs: Readonly<Record<string, string>> = {},
): { entries: CarChange[]; renames: Map<string, string> } => {
  const gone = new Map([...before].filter(([slug]) => !after.has(slug)))
  const arrived = new Map([...after].filter(([slug]) => !before.has(slug)))
  const renames = pairRenames(gone, arrived, movedSlugs)
  const formerSlug = new Map([...renames].map(([from, to]) => [to, from]))

  const entries: CarChange[] = []
  for (const [slug, car] of after) {
    const label = carLabel(car as NewCar)
    const previous = before.get(formerSlug.get(slug) ?? slug)
    if (!previous) {
      entries.push({
        date,
        slug,
        label,
        added: true,
        ...(car.deprecated && { removed: true }),
        ...(car.price !== undefined && { price: { to: car.price } }),
        ...(car.expectedDelivery && {
          delivery: { to: car.expectedDelivery },
        }),
      })
      continue
    }
    const change = changed(previous, car)
    if (change) entries.push({ date, slug, label, ...change })
  }
  for (const [slug, car] of gone) {
    entries.push({
      date,
      slug,
      label: carLabel(car as NewCar),
      name: `${car.make} ${car.model}`,
      removed: true,
    })
  }
  return { entries, renames }
}

/**
 * The log with each renamed car's entries under the slug it has now. A slug
 * a car is renamed to can have been another car's, one that left the data
 * since, and that car's entries keep its own history apart under the slug
 * and the day it left.
 */
export const followRenames = (
  entries: ReadonlyArray<CarChange>,
  renames: Map<string, string>,
): CarChange[] => {
  const retired = new Map<string, string>()
  for (const slug of renames.values()) {
    const last = entries.findLast((entry) => entry.slug === slug)
    if (last && !renames.has(slug)) retired.set(slug, `${slug}~${last.date}`)
  }
  return entries.map((entry) => {
    const slug = renames.get(entry.slug) ?? retired.get(entry.slug)
    return slug ? { ...entry, slug } : entry
  })
}
