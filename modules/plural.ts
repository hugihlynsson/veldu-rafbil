// Icelandic agreement for a counted noun: the singular is used for a count
// ending in 1, *except* for one ending in 11. So 1, 21 and 101 bíll, but 11 and
// 111 bílar. The regex this replaces matched any count ending in 1 and so read
// "11 bíll passar við".
//
// Same rule as CLDR's "one" category for is: i % 10 = 1 and i % 100 != 11.
export const takesSingular = (count: number): boolean => {
  const n = Math.abs(Math.trunc(count))
  return n % 10 === 1 && n % 100 !== 11
}

/** Picks the form of a word that agrees with `count` */
export const agree = (
  count: number,
  singular: string,
  plural: string,
): string => (takesSingular(count) ? singular : plural)
