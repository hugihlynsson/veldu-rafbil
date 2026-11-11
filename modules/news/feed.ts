import carChanges from '@/modules/data/carChanges'
import { carWithSlug, type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { LIST_SHARE_IMAGE_PATH, shareImagePath } from '@/modules/detail/paths'
import {
  dayKinds,
  newsDays,
  pageBefore,
  readNews,
  type LatestNews,
  type NewsDay,
  type NewsItem,
  type NewsPage,
} from './news'
import { dayHeadline, type NameOf } from './newsCopy'
import { NEWS_PATH, newsPagePath } from './paths'

const items = readNews(carChanges)

/** Every day with news the log tells of, newest first, back to 2020 */
export const days: ReadonlyArray<NewsDay> = newsDays(items, '')

// A day in full is its photos and a row per car, so twenty made the updates
// page some 700 KB; ten keep it near half that
export const NEWS_PAGE_DAYS = 10

/** The days the updates page shows, newest first */
export const frontDays: ReadonlyArray<NewsDay> = days.slice(0, NEWS_PAGE_DAYS)

/** The days before the updates page's, by their cursor */
export const olderThanFront = frontDays.at(-1)?.date

/** A page of older days, and the cursors either side, from a cursor */
export const olderPage = (cursor: string): NewsPage =>
  pageBefore(days, cursor, NEWS_PAGE_DAYS)

/** Every year with news, newest first, at the page that ends it */
export const newsYears: ReadonlyArray<{ year: string; path: string }> = [
  ...new Set(days.map(({ date }) => date.slice(0, 4))),
].map((year, index) => ({
  year,
  path: index === 0 ? NEWS_PATH : newsPagePath(`${Number(year) + 1}-01-01`),
}))

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
