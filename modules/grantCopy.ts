import addDecimalSeparators from './addDecimalSeparators'
import { grantAmount, grantPriceCeiling } from './globals'
import { agree } from './plural'

// The wording the page and the assistant's system prompt use for the grant.
// Both numbers are legislation, and a number written out in prose is a number
// nobody remembers to change: the amount was spelled out in the note under the
// intro and again in the system prompt, and the ceiling in both of those and in
// the price helper, so raising either used to leave the site telling buyers, and
// the assistant telling whoever asked it, an amount the prices no longer used.
//
// Icelandic declines the noun after a count, so the ceiling comes in the two
// cases the copy needs, and the count agrees: 10 milljónir, but 21 milljón.

/** The grant itself, e.g. "500.000 kr." */
export const grantAmountText = `${addDecimalSeparators(grantAmount)} kr.`

const millions = grantPriceCeiling / 1_000_000

// Icelandic writes the decimal separator as a comma, and a ceiling that is not
// a whole number of millions takes the plural whatever it ends in: 9,5
// milljónir, where agree() alone would read the 1 in 1,5 as a singular.
const millionsText = String(millions).replace('.', ',')
const millionsWord = (singular: string, plural: string): string =>
  Number.isInteger(millions) ? agree(millions, singular, plural) : plural

/** The ceiling as "10 milljónir", for "kosta minna en …" */
export const grantCeilingText = `${millionsText} ${millionsWord('milljón', 'milljónir')}`

/** The ceiling as "10 milljónum", for "undir …" */
export const grantCeilingDativeText = `${millionsText} ${millionsWord('milljón', 'milljónum')}`
