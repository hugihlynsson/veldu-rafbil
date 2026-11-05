import carChanges from '@/modules/data/carChanges'
import { carWithSlug } from '@/modules/data/cars'
import { newsDays, readNews, type NewsDay, type NewsItem } from './news'
import { dayHeadline, type NameOf } from './newsCopy'

// The log runs back to 2020, and each car's page tells its own in full. The
// news starts later: a price from years ago is history, not news, and a page
// for every day of it would be hundreds saying little.
export const NEWS_SINCE = '2026-01-01'

const items = readNews(carChanges)

/** The days with news, newest first */
export const days: ReadonlyArray<NewsDay> = newsDays(items, NEWS_SINCE)

export const dayOn = (date: string): NewsDay | undefined =>
  days.find((day) => day.date === date)

const goneNames = new Map(
  carChanges.flatMap(({ slug, name }) => (name ? [[slug, name] as const] : [])),
)

/** A car by its make and model, whether it is in the data or has left it */
export const nameOf: NameOf = (item) => {
  const car = carWithSlug(item.slug)
  return car
    ? `${car.make} ${car.model}`
    : (goneNames.get(item.slug) ?? item.label)
}

export const headlineOf = (day: NewsDay): string => dayHeadline(day, nameOf)

/** Everything the log tells of one car, newest first, from 2020 on */
export const historyOf = (slug: string): NewsItem[] =>
  items.filter((item) => item.slug === slug).toReversed()
