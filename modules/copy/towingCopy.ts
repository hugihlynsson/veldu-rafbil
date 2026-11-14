import type { NewCar } from '@/modules/data/newCarSchema'
import addDecimalSeparators from './addDecimalSeparators'

/** A car's towing as a model is told it, among its other figures */
export const towingText = (towing: NewCar['towing']): string => {
  if (towing === null) return 'dráttargeta óþekkt'
  if (towing === 0) return 'enginn dráttarkrókur'
  return `dráttargeta ${addDecimalSeparators(towing)} kg`
}
