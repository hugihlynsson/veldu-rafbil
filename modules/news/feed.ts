import carChanges from '@/modules/data/carChanges'
import { carWithSlug, type Car } from '@/modules/data/cars'
import {
  dayKinds,
  newsDays,
  readNews,
  type LatestNews,
  type NewsDay,
  type NewsItem,
} from './news'
import { dayHeadline, type NameOf } from './newsCopy'
import { NEWS_PATH } from './paths'

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

/** A car by its full name as the data has it now, or as it last was */
export const labelOf = (item: NewsItem): string =>
  carWithSlug(item.slug)?.label ?? item.label

/**
 * The car a day leads with, for its photo wherever the day is shown: the first
 * the day tells of that still has a page, in the order the headline names
 * them, so a new car before a new price
 */
export const leadCar = (day: NewsDay): Car | undefined =>
  dayKinds
    .flatMap((kind) => day.items[kind])
    .map(({ slug }) => carWithSlug(slug))
    .find((car) => car !== undefined)

const [newest] = days

const leadImage = (day: NewsDay) => {
  const car = leadCar(day)
  return car ? { image: `/images/${car.heroImageName}.jpg` } : {}
}

/**
 * The newest day's news, which the list's front page leads with. It links to
 * all of them rather than to the day, which tops that page anyway.
 */
export const latestNews: LatestNews | undefined = newest && {
  date: newest.date,
  headline: headlineOf(newest),
  path: NEWS_PATH,
  ...leadImage(newest),
}
