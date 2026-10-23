import addDecimalSeparators from './addDecimalSeparators'
import {
  grantAmount,
  grantPriceCeiling,
  nextGrant,
} from '@/modules/data/globals'
import { agree } from './plural'

// A number written out in prose is a number nobody remembers to change, so the
// intro and the system prompt take their wording from here.

const amountText = (amount: number) => `${addDecimalSeparators(amount)} kr.`

// A ceiling that is not a whole number of millions takes the plural whatever
// it ends in: agree() alone would read the 1 in 1,5 as a singular.
const ceilingText = (ceiling: number, singular: string, plural: string) => {
  const millions = ceiling / 1_000_000
  const word = Number.isInteger(millions)
    ? agree(millions, singular, plural)
    : plural
  return `${String(millions).replace('.', ',')} ${word}`
}

/** The grant itself, e.g. "500.000 kr." */
export const grantAmountText = amountText(grantAmount)

/** The ceiling as "10 milljónir", for "kosta minna en …" */
export const grantCeilingText = ceilingText(
  grantPriceCeiling,
  'milljón',
  'milljónir',
)

/** The ceiling as "10 milljónum", for "undir …" */
export const grantCeilingDativeText = ceilingText(
  grantPriceCeiling,
  'milljón',
  'milljónum',
)

/** When the next grant applies, by the date an application is approved */
export const nextGrantStartText = '1. nóvember'

export const nextGrantAmountText = amountText(nextGrant.amount)

/** The next ceiling as "8 milljónir", for "kosta meira en …" */
export const nextGrantCeilingText = ceilingText(
  nextGrant.priceCeiling,
  'milljón',
  'milljónir',
)
