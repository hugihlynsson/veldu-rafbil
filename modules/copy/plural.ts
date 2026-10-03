// Icelandic: singular for a count ending in 1, *except* one ending in 11 — 21
// bíll, but 11 bílar. CLDR's "one" category for is.
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
