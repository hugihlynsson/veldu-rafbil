import cars, { type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { movedSlugs } from '@/modules/data/publishedSlugs'

// Two is the least that is a comparison; past four the columns no longer fit
// a phone side by side
export const MIN_COMPARED = 2
export const MAX_COMPARED = 4

export const COMPARISON_PATH = '/samanburdur'

const carsBySlug = new Map(cars.map((car) => [carSlug(car), car]))

export const comparisonPath = (slugs: ReadonlyArray<string>): string =>
  [COMPARISON_PATH, ...slugs].join('/')

/** Where a comparison's share image is drawn */
export const shareImagePath = (slugs: ReadonlyArray<string>): string =>
  ['/mynd/samanburdur', ...slugs].join('/')

export const shareImageSize = { width: 1200, height: 630 }

export const comparisonPathOf = (compared: ReadonlyArray<Car>): string =>
  comparisonPath(compared.map(carSlug))

export interface Comparison {
  /** In the order the URL names them */
  cars: Car[]
  /** The path's segments as they should read, which a redirect points at */
  slugs: string[]
  /** How many of the cars the URL names are no longer sold */
  goneCount: number
}

/**
 * The cars a comparison URL names. A renamed car is followed to its new slug,
 * and a gone one is kept in the path, so the page can say a car was there,
 * rather than dropped. A repeat, or a slug no car ever had, is dropped.
 */
export const resolveComparison = (
  segments: ReadonlyArray<string>,
  moved: Readonly<Record<string, string | null>> = movedSlugs,
): Comparison => {
  const slugs: string[] = []
  const compared: Car[] = []
  let goneCount = 0

  for (const segment of segments) {
    if (slugs.length === MAX_COMPARED) break

    const asked = segment.toLowerCase()
    const slug = asked in moved ? moved[asked] : asked
    if (slug === null) {
      if (!slugs.includes(asked)) {
        slugs.push(asked)
        goneCount++
      }
      continue
    }

    const car = carsBySlug.get(slug)
    if (!car || slugs.includes(slug)) continue
    slugs.push(slug)
    compared.push(car)
  }

  return { cars: compared, slugs, goneCount }
}

/** What a compared car is called: its make and model, or all of its label when another has the same */
export const comparedName = (car: Car, compared: ReadonlyArray<Car>): string =>
  compared.some(
    (other) =>
      other !== car && other.make === car.make && other.model === car.model,
  )
    ? car.label
    : `${car.make} ${car.model}`

/** The comparison as the question it asks: "Kia EV3, Skoda Elroq eða Tesla Model Y?" */
export const comparisonTitle = (compared: ReadonlyArray<Car>): string => {
  const names = compared.map((car) => comparedName(car, compared))
  if (names.length < 2) return names.join('')
  return `${names.slice(0, -1).join(', ')} eða ${names.at(-1)}?`
}
