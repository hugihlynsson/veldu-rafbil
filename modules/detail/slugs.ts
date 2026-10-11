import cars, { type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { movedSlugs } from '@/modules/data/publishedSlugs'

const carsBySlug = new Map(cars.map((car) => [carSlug(car), car]))

export interface ResolvedSlugs {
  /** In the order the URL names them */
  cars: Car[]
  /** The path's segments as they should read, which a redirect points at */
  slugs: string[]
  /** How many of the cars the URL names are no longer sold */
  goneCount: number
}

/**
 * The cars a URL names by slug. A renamed car is followed to its new slug,
 * and a gone one is kept in the path, so the page can say a car was there,
 * rather than dropped. A repeat, or a slug no car ever had, is dropped, and
 * so is any past the most the page shows.
 */
export const resolveSlugs = (
  segments: ReadonlyArray<string>,
  max: number = Infinity,
  moved: Readonly<Record<string, string | null>> = movedSlugs,
): ResolvedSlugs => {
  const slugs: string[] = []
  const resolved: Car[] = []
  let goneCount = 0

  for (const segment of segments) {
    if (slugs.length === max) break

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
    resolved.push(car)
  }

  return { cars: resolved, slugs, goneCount }
}
