import carChanges from '@/modules/data/carChanges'
import { carWithSlug, type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { LIST_SHARE_IMAGE_PATH, shareImagePath } from '@/modules/detail/paths'
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

const items = readNews(carChanges)

/** Every day with news the log tells of, newest first, back to 2020 */
export const days: ReadonlyArray<NewsDay> = newsDays(items, '')

/** How far back the updates page lists the days, a line each */
export const NEWS_MONTHS = 12

// Counted back from the newest day rather than from today: the pages are built
// at the deploy, so they change when the data does and not with the calendar.
// Every day before it still has its page, reached by its year.
const newest = days[0]?.date ?? ''
export const NEWS_SINCE = newest
  ? `${Number(newest.slice(0, 4)) - NEWS_MONTHS / 12}${newest.slice(4)}`
  : ''

/** The days the updates page lists, newest first */
export const recentDays: ReadonlyArray<NewsDay> = days.filter(
  ({ date }) => date > NEWS_SINCE,
)

/** Every year with news, newest first */
export const newsYears: ReadonlyArray<string> = [
  ...new Set(days.map(({ date }) => date.slice(0, 4))),
]

export const daysIn = (year: string): ReadonlyArray<NewsDay> =>
  days.filter(({ date }) => date.startsWith(`${year}-`))

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

/** The share image a day is shown with, of the car it leads with */
export const dayShareImagePath = (day: NewsDay): string => {
  const car = leadCar(day)
  return car ? shareImagePath([carSlug(car)]) : LIST_SHARE_IMAGE_PATH
}

const [latestDay] = days

const leadImage = (day: NewsDay) => {
  const car = leadCar(day)
  return car ? { image: `/images/${car.heroImageName}.jpg` } : {}
}

/**
 * The newest day's news, which the list's front page leads with. It links to
 * all of them rather than to the day, which tops that page anyway.
 */
export const latestNews: LatestNews | undefined = latestDay && {
  date: latestDay.date,
  headline: headlineOf(latestDay),
  path: NEWS_PATH,
  ...leadImage(latestDay),
}
