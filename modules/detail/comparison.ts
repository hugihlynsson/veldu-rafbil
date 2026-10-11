import type { Car } from '@/modules/data/cars'
import { carName } from '@/modules/data/getCarId'

// Two is the least that is a comparison; past four the columns no longer fit
// a phone side by side
export const MIN_COMPARED = 2
export const MAX_COMPARED = 4

/** The comparison as the question it asks: "Kia EV3, Skoda Elroq eða Tesla Model Y?" */
export const comparisonTitle = (compared: ReadonlyArray<Car>): string => {
  const names = compared.map((car) => carName(car, compared))
  if (names.length < 2) return names.join('')
  return `${names.slice(0, -1).join(', ')} eða ${names.at(-1)}?`
}
