// Relative: filters.ts reads this, and next.config.ts loads filters.ts
import { carSlug } from '../data/getCarId'
import { bodyTypeBySlug } from './bodyTypeData'

// What Icelanders call the car rather than how a brochure files it, so an SUV
// is a jepplingur or a jeppi by its size: two thirds of the list are SUVs, and
// "jeppi" alone would narrow nothing
export const bodyTypes = [
  'small',
  'saloon',
  'compactSuv',
  'suv',
  'estate',
  'van',
] as const

export type BodyType = (typeof bodyTypes)[number]

/** The URL's words, which every shared link to a body type spells */
export const bodyTypeWords: Record<string, BodyType> = {
  smabill: 'small',
  folksbill: 'saloon',
  jepplingur: 'compactSuv',
  jeppi: 'suv',
  skutbill: 'estate',
  fjolnotabill: 'van',
}

export const bodyTypeLabels: Record<BodyType, string> = {
  small: 'Smábíll',
  saloon: 'Fólksbíll',
  compactSuv: 'Jepplingur',
  suv: 'Jeppi',
  estate: 'Skutbíll',
  van: 'Fjölnotabíll',
}

export const bodyTypeWord = (type: BodyType): string =>
  Object.keys(bodyTypeWords).find((word) => bodyTypeWords[word] === type) ?? ''

export const bodyTypeOf = (car: { id: string }): BodyType | undefined =>
  bodyTypeBySlug.get(carSlug(car))
