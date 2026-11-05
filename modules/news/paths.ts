export const NEWS_PATH = '/uppfaerslur'

/** A day's news, by the day as 2026-10-31 */
export const newsDayPath = (date: string): string => `${NEWS_PATH}/${date}`

export const NEWS_FEED_PATH = `${NEWS_PATH}/rss.xml`
