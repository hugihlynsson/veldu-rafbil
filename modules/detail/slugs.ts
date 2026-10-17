import { allCars, type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { movedSlugs } from '@/modules/data/publishedSlugs'

// A car no longer sold keeps its page, so its slug still reads as it
const carsBySlug = new Map(allCars.map((car) => [carSlug(car), car]))

export interface ResolvedSlugs {
  /** In the order the URL names them */
  cars: Car[]
  /** The path's segments as they should read, which a redirect points at */
  slugs: string[]
}

/**
 * The cars a URL names by slug. A renamed car is followed to its new slug. A
 * repeat, or a slug no car ever had, is dropped, and so is any past the most
 * the page shows.
 */
export const resolveSlugs = (
  segments: ReadonlyArray<string>,
  max: number = Infinity,
  moved: Readonly<Record<string, string>> = movedSlugs,
): ResolvedSlugs => {
  const slugs: string[] = []
  const resolved: Car[] = []

  for (const segment of segments) {
    if (slugs.length === max) break

    const asked = segment.toLowerCase()
    const slug = moved[asked] ?? asked
    const car = carsBySlug.get(slug)
    if (!car || slugs.includes(slug)) continue
    slugs.push(slug)
    resolved.push(car)
  }

  return { cars: resolved, slugs }
}
