import { carPath } from '@/modules/detail/paths'

export const NEWS_PATH = '/uppfaerslur'

/** A day's news, by the day as 2026-10-31 */
export const newsDayPath = (date: string): string => `${NEWS_PATH}/${date}`

/** A year's news, by the year as 2025 */
export const newsYearPath = (year: string): string => `${NEWS_PATH}/ar/${year}`

export const NEWS_FEED_PATH = `${NEWS_PATH}/rss.xml`

/** One car's updates, which the sheet over the list fetches as it opens */
export const carHistoryPath = (slug: string): string =>
  `${carPath(slug)}/uppfaerslur.json`
