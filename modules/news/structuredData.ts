import { carWithSlug } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'
import { SITE_URL } from '@/modules/siteUrl'
import { breadcrumbList, siteOrganization } from '@/modules/structuredData'
import { dayShareImagePath, headlineOf, labelOf } from './feed'
import { dayKinds, type NewsDay } from './news'
import { dayDescription } from './newsCopy'
import { NEWS_PATH, newsDayPath } from './paths'

/** The trail down to the updates, and to a page under them */
export const newsBreadcrumbs = (page?: { name: string; path: string }) =>
  breadcrumbList([
    { name: 'Uppfærslur', path: NEWS_PATH },
    ...(page ? [page] : []),
  ])

/**
 * A day's page as a news article, about the cars it tells of that still have
 * a page. The day is all the log keeps of when, so it is published that day
 * and never modified after.
 */
export const dayArticle = (day: NewsDay) => {
  const url = `${SITE_URL}${newsDayPath(day.date)}`
  const cars = [
    ...new Set(
      dayKinds
        .flatMap((kind) => day.items[kind])
        .map(({ slug }) => carWithSlug(slug))
        .filter((car) => car !== undefined),
    ),
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: headlineOf(day),
    description: dayDescription(day, labelOf),
    url,
    mainEntityOfPage: url,
    inLanguage: 'is',
    datePublished: day.date,
    image: `${SITE_URL}${dayShareImagePath(day)}`,
    author: siteOrganization,
    publisher: siteOrganization,
    about: cars.map((car) => ({
      '@type': 'Car',
      name: car.label,
      url: `${SITE_URL}${carPathOf(car)}`,
    })),
  }
}
