import addDecimalSeparators from './addDecimalSeparators'
import {
  grantAmount,
  grantPriceCeiling,
  previousGrantAmount,
  previousGrantPriceCeiling,
} from '@/modules/data/globals'
import { agree } from './plural'

// A number written out in prose is a number nobody remembers to change, so the
// intro and the system prompt take their wording from here.

const amountText = (amount: number) => `${addDecimalSeparators(amount)} kr.`

const millionsText = (ceiling: number) =>
  String(ceiling / 1_000_000).replace('.', ',')

// A ceiling that is not a whole number of millions takes the plural whatever
// it ends in: agree() alone would read the 1 in 1,5 as a singular.
const ceilingText = (ceiling: number, singular: string, plural: string) => {
  const millions = ceiling / 1_000_000
  const word = Number.isInteger(millions)
    ? agree(millions, singular, plural)
    : plural
  return `${millionsText(ceiling)} ${word}`
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

/** The date the current grant took over, by the date an application is approved */
export const grantStartText = '1. nóvember 2026'

export const previousGrantAmountText = amountText(previousGrantAmount)

/** The prices that lost the grant altogether, e.g. "8–10 milljónir" */
export const grantLostRangeText = `${millionsText(grantPriceCeiling)}–${ceilingText(
  previousGrantPriceCeiling,
  'milljón',
  'milljónir',
)}`
