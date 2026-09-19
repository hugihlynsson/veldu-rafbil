// The rafbílastyrkur: a buyer of a new electric car with a list price under the
// ceiling gets the grant taken off. Both numbers are set by legislation and have
// changed before, and three things read them — the price every part of the site
// displays, sorts and filters on, the note under the intro, and the line in the
// assistant's system prompt. They live here so that a change to the law is a
// change to these two lines. See grantCopy for the user-facing wording.
export const grantAmount = 500_000 // In ISK
export const grantPriceCeiling = 10_000_000 // In ISK, list price, exclusive
