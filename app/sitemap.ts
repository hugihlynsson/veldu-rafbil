import type { MetadataRoute } from 'next'

import { allCars } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPath } from '@/modules/detail/paths'
import { SITE_URL } from '@/modules/siteUrl'

// The list and every car's page, those no longer sold included, as each is
// built and searched for. Not the comparisons: any set of cars is one, and a
// crawler finds those people share by their links. No lastModified, as the
// data keeps no date per car and a wrong one is worse than none.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    ...allCars.map((car) => ({ url: `${SITE_URL}${carPath(carSlug(car))}` })),
  ]
}
