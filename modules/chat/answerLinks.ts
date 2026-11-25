import { SITE_URL } from '@/modules/siteUrl'

/**
 * Whether a link in an answer leaves the site, as a seller's or ev-database's
 * page does. Those open beside the chat rather than in place of it.
 */
export const leavesSite = (href: string | undefined): boolean =>
  !!href && /^https?:\/\//i.test(href) && !href.startsWith(`${SITE_URL}/`)
