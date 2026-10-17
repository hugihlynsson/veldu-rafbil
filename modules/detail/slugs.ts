import { allCars, type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { movedSlugs } from '@/modules/data/movedSlugs'

// A car no longer sold keeps its page, so its slug still reads as it
const carsBySlug = new Map(allCars.map((car) => [carSlug(car), car]))

export interface ResolvedSlugs {
  /** In the order the URL names them */
  cars: Car[]
  /** The path's segments as they should read, which a redirect points at */
  slugs: string[]
}

/**
 * A path segment as a slug. A stray % names no car, so it is left as it came
 * to be dropped as one, rather than thrown on as a server error.
 */
export const readSegment = (segment: string): string => {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

/**
 * The cars a URL names by slug. A renamed car is followed to its new slug. A
 * repeat, or a slug no car ever had, is dropped.
 */
export const resolveSlugs = (
  segments: ReadonlyArray<string>,
  moved: Readonly<Record<string, string>> = movedSlugs,
): ResolvedSlugs => {
  const slugs: string[] = []
  const resolved: Car[] = []

  for (const segment of segments) {
    const asked = segment.toLowerCase()
    const slug = moved[asked] ?? asked
    const car = carsBySlug.get(slug)
    if (!car || slugs.includes(slug)) continue
    slugs.push(slug)
    resolved.push(car)
  }

  return { cars: resolved, slugs }
}
