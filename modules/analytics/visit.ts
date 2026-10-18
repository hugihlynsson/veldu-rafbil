import { CAR_PATH, COMPARISON_PATH } from '@/modules/detail/paths'
import { MAX_COMPARED } from '@/modules/detail/comparison'

// What the browser can say about a visit without the schema that checks it,
// which waits on the server with zod

export const pageKinds = ['list', 'car', 'comparison', 'other'] as const
export type PageKind = (typeof pageKinds)[number]

/** Which of the site's pages a path is, and the cars it is about */
export interface Page {
  kind: PageKind
  slugs: string[]
}

export const devices = ['phone', 'tablet', 'desktop'] as const
export type Device = (typeof devices)[number]

/** The most events one request carries, as the route reads them */
export const MAX_BATCH = 20

// The slugs as the path has them, unresolved: resolving them would bring the
// whole car list into every page that tracks anything
const slugsUnder = (pathname: string, base: string): string[] | undefined => {
  if (!pathname.startsWith(`${base}/`)) return undefined
  return pathname
    .slice(base.length + 1)
    .split('/')
    .filter(Boolean)
    .slice(0, MAX_COMPARED)
    .map((segment) => {
      try {
        return decodeURIComponent(segment).toLowerCase()
      } catch {
        return segment.toLowerCase()
      }
    })
}

export const pageOf = (pathname: string): Page => {
  // app/with-query is the list, rewritten to from a URL with a query
  if (pathname === '/' || pathname === '/with-query') {
    return { kind: 'list', slugs: [] }
  }
  const car = slugsUnder(pathname, CAR_PATH)
  if (car?.length === 1) return { kind: 'car', slugs: car }
  const compared = slugsUnder(pathname, COMPARISON_PATH)
  if (compared && compared.length > 0) {
    return { kind: 'comparison', slugs: compared }
  }
  return { kind: 'other', slugs: [] }
}

// The widths the layout itself changes at: md for a tablet, lg for a desktop
export const deviceOf = (width: number): Device =>
  width < 768 ? 'phone' : width < 1024 ? 'tablet' : 'desktop'

/**
 * How far down the page the bottom of the window has reached, in whole
 * percent. A page shorter than the window is read to its end.
 */
export const scrollDepth = (
  scrollTop: number,
  windowHeight: number,
  pageHeight: number,
): number => {
  if (pageHeight <= windowHeight) return 100
  const share = (scrollTop + windowHeight) / pageHeight
  return Math.min(100, Math.max(0, Math.round(share * 100)))
}

/** Where a visitor came from, when it was another site: the host alone */
export const referrerHost = (
  referrer: string,
  ownHost: string,
): string | undefined => {
  try {
    const { host } = new URL(referrer)
    return host && host !== ownHost ? host : undefined
  } catch {
    return undefined
  }
}
