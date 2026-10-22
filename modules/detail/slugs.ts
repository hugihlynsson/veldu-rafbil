import { carWithSlug, type Car } from '@/modules/data/cars'
import { movedSlugs } from '@/modules/data/movedSlugs'
import { MAX_COMPARED } from './comparison'
import { CAR_PATH } from './paths'

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
    const car = carWithSlug(slug)
    if (!car || slugs.includes(slug)) continue
    slugs.push(slug)
    resolved.push(car)
  }

  return { cars: resolved, slugs }
}

/**
 * The cars a comparison's path names, read as resolveSlugs reads them, and no
 * more than fit side by side
 */
export const resolveCompared = (
  segments: ReadonlyArray<string>,
): ResolvedSlugs => {
  const { cars, slugs } = resolveSlugs(segments.map(readSegment))
  return {
    cars: cars.slice(0, MAX_COMPARED),
    slugs: slugs.slice(0, MAX_COMPARED),
  }
}

/** The car whose own page a path is, which the list opens over itself */
export const carAtPath = (pathname: string): Car | undefined => {
  const [, root, segment, ...rest] = pathname.split('/')
  if (`/${root}` !== CAR_PATH || !segment || rest.length > 0) return undefined
  return resolveSlugs([readSegment(segment)]).cars[0]
}
