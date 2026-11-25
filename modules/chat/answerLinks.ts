import { SITE_URL } from '@/modules/siteUrl'

const parse = (href: string | undefined): URL | undefined => {
  if (!href) return undefined
  try {
    return new URL(href, SITE_URL)
  } catch {
    return undefined
  }
}

/**
 * The path of a link in an answer to a page on the site, which opens in place
 * without reloading the chat. The prompt names the site's pages in full, as
 * production serves them, so on a preview they still stay on the preview.
 */
export const sitePath = (href: string | undefined): string | undefined => {
  if (href?.startsWith('#')) return undefined
  const url = parse(href)
  return url?.origin === SITE_URL
    ? `${url.pathname}${url.search}${url.hash}`
    : undefined
}

/**
 * Whether a link in an answer leaves the site, as a seller's or ev-database's
 * page does. Those open beside the chat rather than in place of it.
 */
export const leavesSite = (href: string | undefined): boolean => {
  const url = parse(href)
  return (
    !!url &&
    (url.protocol === 'https:' || url.protocol === 'http:') &&
    url.origin !== SITE_URL
  )
}

/** The advisor's tool for a seller's page, named here so the browser need not load it */
export const SELLER_LINK_TOOL = 'getSellerLink'

interface Part {
  type: string
  state?: string
  input?: unknown
  output?: unknown
}

const field = (value: unknown, key: string): string | undefined => {
  if (typeof value !== 'object' || value === null || !(key in value)) {
    return undefined
  }
  const found = (value as Record<string, unknown>)[key]
  return typeof found === 'string' ? found : undefined
}

/**
 * The car each seller link in an answer was handed for, by link, so a click
 * on one counts for that car as a click on its price does. Read from the tool
 * calls rather than the link, as many cars share a seller's page.
 */
export const sellerLinkCars = (
  parts: ReadonlyArray<Part>,
): Map<string, string> =>
  new Map(
    parts.flatMap((part) => {
      if (
        part.type !== `tool-${SELLER_LINK_TOOL}` ||
        part.state !== 'output-available'
      ) {
        return []
      }
      const link = field(part.output, 'sellerPage')
      const car = field(part.input, 'car')?.toLowerCase()
      return link && car ? [[link, car] as const] : []
    }),
  )
