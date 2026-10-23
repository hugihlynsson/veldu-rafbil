import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'

export const CAR_PATH = '/bill'
export const COMPARISON_PATH = '/samanburdur'

export const comparisonPath = (slugs: ReadonlyArray<string>): string =>
  [COMPARISON_PATH, ...slugs].join('/')

export const comparisonPathOf = (compared: ReadonlyArray<Car>): string =>
  comparisonPath(compared.map(carSlug))

export const carPath = (slug: string): string => `${CAR_PATH}/${slug}`

/** The page about these cars: one car's own, or a comparison of several */
export const pagePath = (slugs: ReadonlyArray<string>): string => {
  const [only] = slugs
  return only && slugs.length === 1 ? carPath(only) : comparisonPath(slugs)
}

export const carPathOf = (car: Car): string => pagePath([carSlug(car)])

/** Where the share image for the list is drawn */
export const LIST_SHARE_IMAGE_PATH = '/mynd'

/** Where the share image for the page about these cars is drawn */
export const shareImagePath = (slugs: ReadonlyArray<string>): string =>
  ['/mynd', ...pagePath(slugs).split('/').slice(1)].join('/')

export const shareImageSize = { width: 1200, height: 630 }
