import type { Car } from '@/modules/data/cars'

/** What goes under a car's name on its page and its share image */
export const carSubtitle = (car: Car): string =>
  [
    car.subModel,
    car.expectedDelivery && `Væntanlegur ${car.expectedDelivery.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(' · ')
