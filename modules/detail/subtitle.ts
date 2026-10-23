import type { Car } from '@/modules/data/cars'

/** What goes under a car's name on its page and its share image */
export const carSubtitle = (car: Car): string =>
  [
    car.subModel,
    car.expectedDelivery && `Væntanlegur ${car.expectedDelivery.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(' · ')

// Written out rather than read from the runtime's locale, which is not
// Icelandic in node
const months = [
  'janúar',
  'febrúar',
  'mars',
  'apríl',
  'maí',
  'júní',
  'júlí',
  'ágúst',
  'september',
  'október',
  'nóvember',
  'desember',
]

/** What a car no longer sold new says about it, with the month it stopped */
export const deprecatedNotice = (car: Car): string | undefined => {
  if (!car.deprecated) return undefined
  // An ISO date, as the schema holds it to
  const [year, month] = car.deprecated.split('-').map(Number) as [
    number,
    number,
  ]
  return `Ekki seldur nýr síðan í ${months[month - 1]} ${year}`
}
