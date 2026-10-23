import { currentCarWithSlug, type Car } from '@/modules/data/cars'

// Picked for their photos and for being cars people know, from the cheapest
// to the dearest
export const showcaseSlugs = [
  'leapmotor-t03-base',
  'tesla-model-y-standard-range',
  'mercedes-benz-glb-350-4matic-eq',
  'range-rover-electric-ev450',
]

/** The cars the list's share image shows it by */
export const showcaseCars = (): Car[] =>
  showcaseSlugs.flatMap((slug) => currentCarWithSlug(slug) ?? [])
