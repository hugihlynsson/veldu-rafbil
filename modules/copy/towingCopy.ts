import type { NewCar } from '@/modules/data/newCarSchema'
import addDecimalSeparators from './addDecimalSeparators'

// Both forms here, so what 0 and null mean is said in one place: 0 is a car
// that takes no towbar, null one whose figure is not known

/** A car's towing as its page and a comparison show it */
export const towingFigure = (towing: NewCar['towing']): string => {
  if (towing === null) return 'Óþekkt'
  if (towing === 0) return 'Enginn krókur'
  return `${addDecimalSeparators(towing)} kg`
}

/**
 * A car's towing as a review is written from it, in everyday words, as the
 * review is to be: nothing where the figure is not known
 */
export const towingClause = (towing: NewCar['towing']): string | undefined => {
  if (towing === null) return undefined
  if (towing === 0) return 'má ekki draga kerru'
  return `má draga ${addDecimalSeparators(towing)} kg`
}

/** A car's towing as a model is told it, among its other figures */
export const towingText = (towing: NewCar['towing']): string => {
  if (towing === null) return 'dráttargeta óþekkt'
  if (towing === 0) return 'enginn dráttarkrókur'
  return `dráttargeta ${addDecimalSeparators(towing)} kg`
}
