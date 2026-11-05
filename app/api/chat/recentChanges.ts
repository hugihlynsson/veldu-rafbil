import { carWithSlug } from '@/modules/data/cars'
import { dayText } from '@/modules/copy/dayText'
import type { NewsItem } from '@/modules/news/news'
import { itemText } from '@/modules/news/newsCopy'

/** How far back from the newest change the advisor is told of */
export const CHANGE_DAYS = 60
// A bound on the prompt, which every question pays for, kept by whole days: a
// day like the grant change, when every price moved, would otherwise be as
// long as the car list
export const MAX_CHANGES = 120

const daysBefore = (date: string, days: number) =>
  new Date(Date.parse(`${date}T00:00:00Z`) - days * 86_400_000)
    .toISOString()
    .slice(0, 10)

/**
 * The changes the advisor is told of, newest first. The window is counted
 * back from the newest change rather than from today, so the prompt changes
 * only when the data does and stays the prefix the provider caches.
 */
export const recentChanges = (items: ReadonlyArray<NewsItem>): NewsItem[] => {
  const news = items.filter(({ kind }) => kind !== 'renamed')
  const newest = news.at(-1)?.date
  if (!newest) return []
  const start = daysBefore(newest, CHANGE_DAYS)
  const inWindow = news.filter(({ date }) => date > start).toReversed()
  // Whole days only: half a day would tell the advisor that was all of it
  const kept: NewsItem[] = []
  for (const date of new Set(inWindow.map(({ date }) => date))) {
    const ofDay = inWindow.filter((item) => item.date === date)
    if (kept.length + ofDay.length > MAX_CHANGES) break
    kept.push(...ofDay)
  }
  return kept
}

/**
 * The section of the system prompt that tells the advisor what changed, a day
 * at a time. A car is named as the list above names it now, not as it was
 * called then, so the advisor finds its line and the ref to tag it with there;
 * repeating the ref here would double the section for nothing. A car that has
 * left the data keeps the name it last had.
 */
export const recentChangesSection = (
  items: ReadonlyArray<NewsItem>,
): string => {
  const changes = recentChanges(items)
  const newest = changes[0]
  const oldest = changes.at(-1)
  if (!newest || !oldest) return ''

  const days = [...new Set(changes.map(({ date }) => date))].map((date) => {
    const lines = changes
      .filter((item) => item.date === date)
      .map(
        (item) =>
          `- ${carWithSlug(item.slug)?.label ?? item.label}: ${itemText(item, 'history')}`,
      )
    return `${dayText(date)}:\n${lines.join('\n')}`
  })

  return `Breytingar á listanum frá ${dayText(oldest.date)} til ${dayText(newest.date)}, þær nýjustu fyrst. Verð í þessum hluta eru listaverð FYRIR ríkisstyrk, verðið sem seljandinn setur, en ekki verðin eftir styrk í listanum að ofan, svo berðu þau aldrei beint saman:

${days.join('\n\n')}`
}
