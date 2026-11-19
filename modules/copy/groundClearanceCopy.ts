import type { NewCar } from '@/modules/data/newCarSchema'

// The forms side by side, so what `adjustable` and null mean is said in one
// place: the first is a raised air-suspension level, often allowed only at low
// speed, the second a car whose figure is not known

/** A car's ground clearance as a comparison shows it, its label beneath */
export const groundClearanceFigure = (
  clearance: NewCar['groundClearance'],
): string => (clearance ? `${clearance.mm} mm` : 'Óþekkt')

/** What a comparison writes under the figure, for a raised level */
export const groundClearanceDetail = (
  clearance: NewCar['groundClearance'],
): string | undefined => (clearance?.adjustable ? 'Hæsta stilling' : undefined)

/** A car's ground clearance as it reads under the drive on its own page */
export const groundClearanceLine = (
  clearance: NewCar['groundClearance'],
): string => {
  if (!clearance) return 'Veghæð óþekkt'
  if (clearance.adjustable) return `Veghæð allt að ${clearance.mm} mm`
  return `Veghæð ${clearance.mm} mm`
}

/** A car's ground clearance as a model is told it, among its other figures */
export const groundClearanceText = (
  clearance: NewCar['groundClearance'],
): string => {
  if (!clearance) return 'veghæð óþekkt'
  if (clearance.adjustable) {
    return `veghæð ${clearance.mm} mm í hæstu stillingu loftpúðafjöðrunar`
  }
  return `veghæð ${clearance.mm} mm`
}
