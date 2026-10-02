import { Filters } from '@/types'

type FilterKey = keyof Filters

/** A value the filter must hold, or 'any' where only its presence is judged */
export type Expectation = {
  [Key in FilterKey]?: NonNullable<Filters[Key]> | 'any'
}

export interface IntentCase {
  text: string
  /**
   * literal: the text states every filter, and the parser must read them all.
   * mixed: it states some and implies others. vague: it states none.
   */
  kind: 'literal' | 'mixed' | 'vague'
  expect: Expectation
  /** Filters a reasonable reader might or might not add, judged neither way */
  allow?: FilterKey[]
}

/**
 * Requests as people type them: inflected, abbreviated, missing the Icelandic
 * letters, and sometimes misspelled. The vague ones expect 'any' for a number,
 * as the brackets a model picks from are cut from the car data and move with it.
 */
export const intentCases: IntentCase[] = [
  { text: 'undir 8 milljónum', kind: 'literal', expect: { price: 8_000_000 } },
  {
    text: 'Tesla undir 7 m.kr.',
    kind: 'literal',
    expect: { name: ['Tesla'], price: 7_000_000 },
  },
  { text: '7 sæta bíll', kind: 'literal', expect: { seats: 7 } },
  {
    text: 'sjö sæta fjórhjóladrifinn',
    kind: 'literal',
    expect: { seats: 7, drive: ['AWD'] },
  },
  {
    text: '4x4 og 7 saeti',
    kind: 'literal',
    expect: { seats: 7, drive: ['AWD'] },
  },
  {
    text: 'fjorhjoladrifin undir 10 milljonum',
    kind: 'literal',
    expect: { drive: ['AWD'], price: 10_000_000 },
  },
  { text: 'drægni yfir 500 km', kind: 'literal', expect: { range: 500 } },
  {
    text: 'að minnsta kosti 450 km drægni',
    kind: 'literal',
    expect: { range: 450 },
  },
  { text: 'Kia EV9', kind: 'literal', expect: { name: ['EV9'] } },
  {
    text: 'polestar eða volvo',
    kind: 'literal',
    expect: { name: ['Polestar', 'Volvo'] },
  },
  {
    text: 'hámark 6.500.000 kr',
    kind: 'literal',
    expect: { price: 6_500_000 },
  },
  { text: 'max 9,5 millj', kind: 'literal', expect: { price: 9_500_000 } },
  {
    text: '0-100 undir 5 sek',
    kind: 'literal',
    expect: { acceleration: 5 },
  },
  {
    text: 'hraðhleðsla yfir 15 km/min',
    kind: 'literal',
    expect: { fastcharge: 15 },
  },
  {
    text: 'fáanlegur strax, 5 sæti',
    kind: 'literal',
    expect: { availability: 'available', seats: 5 },
  },
  {
    text: 'væntanlegir bílar',
    kind: 'literal',
    expect: { availability: 'expected' },
  },
  { text: 'afturhjóladrifinn', kind: 'literal', expect: { drive: ['RWD'] } },
  {
    text: 'framhjóladrif undir 5 milljónum',
    kind: 'literal',
    expect: { drive: ['FWD'], price: 5_000_000 },
  },
  { text: 'VW ID.4', kind: 'literal', expect: { name: ['ID.4'] } },
  { text: 'mig langar í Teslu', kind: 'literal', expect: { name: ['Tesla'] } },
  { text: '5 til 8 milljónir', kind: 'literal', expect: { price: 8_000_000 } },
  {
    text: 'fimm manna fjölskylda, 600 km',
    kind: 'literal',
    expect: { seats: 5, range: 600 },
  },
  { text: 'undir 15.000 kr/km', kind: 'literal', expect: { value: 15_000 } },
  { text: 'BYD Seal U', kind: 'literal', expect: { name: ['Seal U'] } },
  {
    text: 'Mercedes undir 12 milljónum',
    kind: 'literal',
    expect: { name: ['Mercedes-Benz'], price: 12_000_000 },
  },
  {
    text: 'aldrif, 8 sæti',
    kind: 'literal',
    expect: { drive: ['AWD'], seats: 8 },
  },
  {
    text: 'sjo saeta undir 11 mkr',
    kind: 'literal',
    expect: { seats: 7, price: 11_000_000 },
  },
  {
    text: 'Hyundai IONIQ 5 eða Skoda Enyaq',
    kind: 'literal',
    expect: { name: ['IONIQ 5', 'Enyaq'] },
  },
  {
    text: 'þarf ekki fjórhjóladrif, undir 6 milljónum',
    kind: 'literal',
    expect: { price: 6_000_000 },
  },
  { text: 'bíll með 3 sætaröðum', kind: 'literal', expect: { seats: 7 } },
  {
    text: '400+ km drægni og 4wd',
    kind: 'literal',
    expect: { range: 400, drive: ['AWD'] },
  },
  { text: 'budget 9 m', kind: 'literal', expect: { price: 9_000_000 } },
  {
    text: 'ekki yfir 7,9 milljónir',
    kind: 'literal',
    expect: { price: 7_900_000 },
  },
  { text: 'Porsche Taycan', kind: 'literal', expect: { name: ['Taycan'] } },
  {
    text: 'fjórhjóladrifinn undir 9',
    kind: 'literal',
    expect: { drive: ['AWD'], price: 9_000_000 },
  },
  {
    text: 'teslu model y',
    kind: 'literal',
    expect: { name: ['Model Y'] },
  },
  {
    text: 'fjórhjóladrifinn fyrir veturinn, 7 sæti',
    kind: 'literal',
    expect: { drive: ['AWD'], seats: 7 },
  },
  {
    text: 'eitthvað sem er til núna',
    kind: 'literal',
    expect: { availability: 'available' },
  },
  {
    text: 'nýjustu bílarnir sem eru á leiðinni',
    kind: 'literal',
    expect: { availability: 'expected' },
  },

  {
    text: 'fjölskyldubíll undir 8 milljónum sem dugar í langferðir',
    kind: 'mixed',
    expect: { price: 8_000_000, range: 'any' },
    allow: ['seats'],
  },
  {
    text: 'ódýr fjölskyldubíll með 7 sætum',
    kind: 'mixed',
    expect: { seats: 7, price: 'any' },
  },
  {
    text: 'Tesla sem kemst til Akureyrar án þess að hlaða',
    kind: 'mixed',
    expect: { name: ['Tesla'], range: 'any' },
  },
  {
    text: 'sportlegur og hraður, undir 12 milljónum',
    kind: 'mixed',
    expect: { price: 12_000_000, acceleration: 'any' },
  },
  {
    text: 'góður í snjó og ófærð, 5 sæti',
    kind: 'mixed',
    expect: { seats: 5, drive: ['AWD'] },
  },
  {
    text: 'langferdabill fyrir 7',
    kind: 'mixed',
    expect: { seats: 7, range: 'any' },
  },

  { text: 'ódýr borgarbíll', kind: 'vague', expect: { price: 'any' } },
  { text: 'bíll fyrir veturinn', kind: 'vague', expect: { drive: ['AWD'] } },
  {
    text: 'fyrir sveitina, mikið um malarvegi og snjó',
    kind: 'vague',
    expect: { drive: ['AWD'] },
    allow: ['range'],
  },
  { text: 'stór fjölskyldubíll', kind: 'vague', expect: { seats: 7 } },
  { text: 'langdrægur', kind: 'vague', expect: { range: 'any' } },
  { text: 'sem hleður hratt', kind: 'vague', expect: { fastcharge: 'any' } },
  {
    text: 'ég er með fjögur börn',
    kind: 'vague',
    expect: { seats: 7 },
  },
  {
    text: 'hagkvæmur og ódýr',
    kind: 'vague',
    expect: { price: 'any' },
    allow: ['value'],
  },
  { text: 'mjög snöggur', kind: 'vague', expect: { acceleration: 'any' } },
  {
    text: 'fer oft vestur á firði og norður',
    kind: 'vague',
    expect: { range: 'any' },
    allow: ['drive'],
  },
  {
    text: 'ekkert of dýrt, helst ekki yfir meðallagi',
    kind: 'vague',
    expect: { price: 'any' },
  },
  {
    text: 'lúxus jeppi',
    kind: 'vague',
    expect: {},
    allow: ['drive', 'seats', 'acceleration'],
  },
  { text: 'bara eitthvað rafmagns', kind: 'vague', expect: {} },
  { text: 'rafbíll', kind: 'vague', expect: {} },
  {
    text: 'hraðskreiður sportbíll',
    kind: 'vague',
    expect: { acceleration: 'any' },
  },
  {
    text: 'fyrir hundinn og útileguna',
    kind: 'vague',
    expect: {},
    allow: ['range', 'drive', 'seats'],
  },
  {
    text: 'þarf að komast upp á hálendið',
    kind: 'vague',
    expect: { drive: ['AWD'] },
    allow: ['range'],
  },
]

const sameValue = (expected: unknown, actual: unknown) =>
  expected === 'any' ||
  (Array.isArray(expected) && Array.isArray(actual)
    ? [...expected].sort().join() === [...actual].sort().join()
    : expected === actual)

export interface CaseScore {
  /** Expected, present and right */
  right: FilterKey[]
  /** Expected and present, with the wrong value */
  wrong: FilterKey[]
  /** Expected and absent */
  missed: FilterKey[]
  /** Present and neither expected nor allowed */
  extra: FilterKey[]
}

export const scoreCase = (testCase: IntentCase, got: Filters): CaseScore => {
  const expected = Object.keys(testCase.expect) as FilterKey[]
  const present = (Object.keys(got) as FilterKey[]).filter(
    (key) => got[key] !== undefined,
  )
  return {
    right: expected.filter(
      (key) =>
        got[key] !== undefined && sameValue(testCase.expect[key], got[key]),
    ),
    wrong: expected.filter(
      (key) =>
        got[key] !== undefined && !sameValue(testCase.expect[key], got[key]),
    ),
    missed: expected.filter((key) => got[key] === undefined),
    extra: present.filter(
      (key) => !expected.includes(key) && !testCase.allow?.includes(key),
    ),
  }
}

export interface Summary {
  cases: number
  /** Cases with every expected filter right and nothing extra */
  exact: number
  precision: number
  recall: number
}

export const summarize = (scores: CaseScore[]): Summary => {
  const total = (pick: (score: CaseScore) => FilterKey[]) =>
    scores.reduce((sum, score) => sum + pick(score).length, 0)
  const right = total((score) => score.right)
  const suggested =
    right + total((score) => score.wrong) + total((s) => s.extra)
  const expected =
    right + total((score) => score.wrong) + total((s) => s.missed)
  return {
    cases: scores.length,
    exact: scores.filter(
      (score) =>
        score.wrong.length + score.missed.length + score.extra.length === 0,
    ).length,
    precision: suggested ? right / suggested : 1,
    recall: expected ? right / expected : 1,
  }
}
