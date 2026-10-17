import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'

export const CAR_PATH = '/bill'

export const carPath = (slug: string): string => `${CAR_PATH}/${slug}`

export const carPathOf = (car: Car): string => carPath(carSlug(car))

/** Where the share image for a car's page is drawn */
export const shareImagePath = (slug: string): string => `/mynd${carPath(slug)}`

export const shareImageSize = { width: 1200, height: 630 }
