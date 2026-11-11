import type { MetadataRoute } from 'next'

import { allCars } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPath } from '@/modules/detail/paths'
import { days } from '@/modules/news/feed'
import { NEWS_PATH, newsDayPath } from '@/modules/news/paths'
import { SITE_URL } from '@/modules/siteUrl'

// The list, every car's page, those no longer sold included, and the news, its
// page and every day's, as each is built and searched for. Not the pages of
// older days, which hold nothing a day's own page does not, nor the
// comparisons: any set of cars is one, and a crawler finds those people
// share by their links.
//
// Only the news has a date. A car's page changes with more than its own entry
// in the log — the grant, the cars like it, its review — and a wrong date is
// worse than none; a day's news is what it was on the day.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    ...allCars.map((car) => ({ url: `${SITE_URL}${carPath(carSlug(car))}` })),
    { url: `${SITE_URL}${NEWS_PATH}`, lastModified: days[0]?.date },
    ...days.map(({ date }) => ({
      url: `${SITE_URL}${newsDayPath(date)}`,
      lastModified: date,
    })),
  ]
}
