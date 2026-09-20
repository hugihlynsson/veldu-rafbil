import addDecimalSeparators from './addDecimalSeparators'
import { grantAmount, grantPriceCeiling } from './globals'
import { agree } from './plural'

// A number written out in prose is a number nobody remembers to change, so the
// intro and the system prompt take their wording from here.

/** The grant itself, e.g. "500.000 kr." */
export const grantAmountText = `${addDecimalSeparators(grantAmount)} kr.`

const millions = grantPriceCeiling / 1_000_000

// A ceiling that is not a whole number of millions takes the plural whatever
// it ends in: agree() alone would read the 1 in 1,5 as a singular.
const millionsText = String(millions).replace('.', ',')
const millionsWord = (singular: string, plural: string): string =>
  Number.isInteger(millions) ? agree(millions, singular, plural) : plural

/** The ceiling as "10 milljónir", for "kosta minna en …" */
export const grantCeilingText = `${millionsText} ${millionsWord('milljón', 'milljónir')}`

/** The ceiling as "10 milljónum", for "undir …" */
export const grantCeilingDativeText = `${millionsText} ${millionsWord('milljón', 'milljónum')}`
