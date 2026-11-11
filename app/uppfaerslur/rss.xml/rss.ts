import { dayText } from '@/modules/copy/dayText'
import { dayKinds, type NewsDay, type NewsItem } from '@/modules/news/news'
import {
  daySummary,
  itemText,
  kindLabel,
  notesPrice,
  priceNote,
} from '@/modules/news/newsCopy'
import { NEWS_FEED_PATH, NEWS_PATH, newsDayPath } from '@/modules/news/paths'
import { SITE_URL } from '@/modules/siteUrl'

// Enough for a reader that checks in now and then; the site has the rest
const MAX_ITEMS = 50

const escape = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

// The time of day is not kept, and a reader orders by the day alone anyway
const pubDate = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString()

const description = (day: NewsDay, labelOf: LabelOf) => {
  const sections = dayKinds.flatMap((kind) => {
    const items = day.items[kind]
    if (items.length === 0) return []
    const heading = notesPrice(kind)
      ? `${kindLabel(kind, items.length)} (${priceNote})`
      : kindLabel(kind, items.length)
    const lines = items.map(
      (item) =>
        `<li>${escape(`${labelOf(item)}: ${itemText(item, 'news')}`)}</li>`,
    )
    return [`<h3>${escape(heading)}</h3><ul>${lines.join('')}</ul>`]
  })
  return `<p>${escape(`${dayText(day.date)}: ${daySummary(day)}`)}</p>${sections.join('')}`
}

// A car by the name it has now, as the day's page names it, rather than the
// one it had when the entry was written
type LabelOf = (item: NewsItem) => string

/** The news as RSS 2.0, a day to an item, newest first */
export const buildFeed = (
  days: ReadonlyArray<NewsDay>,
  headlineOf: (day: NewsDay) => string,
  labelOf: LabelOf = (item) => item.label,
): string => {
  const items = days.slice(0, MAX_ITEMS).map((day) => {
    const url = `${SITE_URL}${newsDayPath(day.date)}`
    return `    <item>
      <title>${escape(headlineOf(day))}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate(day.date)}</pubDate>
      <description>${escape(description(day, labelOf))}</description>
    </item>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Veldu Rafbíl – Uppfærslur</title>
    <link>${SITE_URL}${NEWS_PATH}</link>
    <atom:link href="${SITE_URL}${NEWS_FEED_PATH}" rel="self" type="application/rss+xml" />
    <description>Nýir rafbílar á Íslandi, verðbreytingar og bílar sem hætta í sölu.</description>
    <language>is</language>
${items.join('\n')}
  </channel>
</rss>
`
}
