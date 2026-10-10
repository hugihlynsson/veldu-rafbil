import type { FilterKey, Filters, FilterValue } from '@/modules/list/filters'
import { buildIntentQuestions } from './model'

/** The labels of the model's options any one of which reads the request right */
export interface Brackets {
  oneOf: string[]
}

/**
 * A value the filter must hold, the brackets it may land in, or 'any' where
 * only its presence is judged
 */
export type Expectation = {
  [Key in FilterKey]?: FilterValue<Key> | Brackets | 'any'
}

export interface IntentCase {
  text: string
  /**
   * literal: the text states every filter, and the parser must read them all.
   * mixed: it states some and implies others. vague: it states none.
   * number: it gives a number with no unit the parser can place, which a
   * model is offered as it stands. question: one put to the advisor, as the
   * chat input that shows the suggestions mostly receives, which should only
   * rarely become a filter.
   */
  kind: 'literal' | 'mixed' | 'vague' | 'number' | 'question'
  expect: Expectation
  /** Filters a reasonable reader might or might not add, judged neither way */
  allow?: FilterKey[]
}

/**
 * Requests as people type them: inflected, abbreviated, missing the Icelandic
 * letters, and sometimes misspelled. The vague ones name brackets rather than
 * numbers, as the brackets a model picks from are cut from the car data and
 * move with it, or 'any' where every bracket is a fair reading.
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
  // When the car can be had is never suggested
  { text: 'fáanlegur strax, 5 sæti', kind: 'literal', expect: { seats: 5 } },
  { text: 'væntanlegir bílar', kind: 'literal', expect: {} },
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
  { text: 'eitthvað sem er til núna', kind: 'literal', expect: {} },
  {
    text: 'nýjustu bílarnir sem eru á leiðinni',
    kind: 'literal',
    expect: {},
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
    expect: { seats: 7, price: { oneOf: ['cheap', 'mid_priced'] } },
  },
  {
    text: 'Tesla sem kemst til Akureyrar án þess að hlaða',
    kind: 'mixed',
    expect: { name: ['Tesla'], range: 'any' },
  },
  {
    text: 'sportlegur og hraður, undir 12 milljónum',
    kind: 'mixed',
    expect: { price: 12_000_000, acceleration: { oneOf: ['fast', 'fastest'] } },
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
  {
    text: 'sjö sæta og ekki of dýr',
    kind: 'mixed',
    expect: { seats: 7, price: 'any' },
  },
  {
    text: 'fjórhjóladrifinn og hleður hratt',
    kind: 'mixed',
    expect: { drive: ['AWD'], fastcharge: 'any' },
  },
  {
    text: 'Kia sem dugar alla leið til Akureyrar',
    kind: 'mixed',
    expect: { name: ['Kia'], range: 'any' },
  },
  {
    text: 'undir 7 milljónum og snöggur',
    kind: 'mixed',
    expect: { price: 7_000_000, acceleration: 'any' },
  },
  {
    text: 'fáanlegur strax og langdrægur',
    kind: 'vague',
    expect: { range: 'any' },
  },
  {
    text: '5 sæti og mikið fyrir peninginn',
    kind: 'mixed',
    expect: { seats: 5, value: 'any' },
    allow: ['price'],
  },

  {
    text: 'ódýr borgarbíll',
    kind: 'vague',
    expect: { price: { oneOf: ['cheap', 'mid_priced'] } },
  },
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
    expect: { price: { oneOf: ['cheap', 'mid_priced'] } },
    allow: ['value'],
  },
  {
    text: 'mjög snöggur',
    kind: 'vague',
    expect: { acceleration: { oneOf: ['fast', 'fastest'] } },
  },
  {
    text: 'fer oft vestur á firði og norður',
    kind: 'vague',
    expect: { range: 'any' },
    allow: ['drive'],
  },
  {
    text: 'ekkert of dýrt, helst ekki yfir meðallagi',
    kind: 'vague',
    expect: { price: { oneOf: ['cheap', 'mid_priced'] } },
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
    expect: { acceleration: { oneOf: ['fast', 'fastest'] } },
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

  // A word like "hratt" fits several questions, and should answer only one
  { text: 'fljótur að hlaða', kind: 'vague', expect: { fastcharge: 'any' } },
  {
    text: 'hleður hratt á ferðalögum',
    kind: 'vague',
    expect: { fastcharge: 'any' },
    allow: ['range'],
  },
  { text: 'kraftmikill', kind: 'vague', expect: { acceleration: 'any' } },
  {
    text: 'sportbíll',
    kind: 'vague',
    expect: { acceleration: { oneOf: ['fast', 'fastest'] } },
  },
  {
    text: 'snöggur en þarf ekki að hlaða hratt',
    kind: 'vague',
    expect: { acceleration: 'any' },
  },

  // Every price option is a ceiling, so wanting to spend more sets none
  {
    text: 'dýr og flottur',
    kind: 'vague',
    expect: {},
    allow: ['acceleration'],
  },
  {
    text: 'peningar skipta ekki máli',
    kind: 'vague',
    expect: {},
  },

  // Seats are counted with the parents
  { text: 'við erum sex', kind: 'vague', expect: { seats: 7 } },
  { text: 'fimm krakkar', kind: 'vague', expect: { seats: 7 } },
  {
    text: 'tvö börn og hundur',
    kind: 'vague',
    expect: {},
    allow: ['seats'],
  },
  {
    text: 'fjolskyldubill',
    kind: 'vague',
    expect: {},
    allow: ['seats'],
  },

  // Saying little about a need is no need
  {
    text: 'keyri bara innanbæjar',
    kind: 'vague',
    expect: {},
    allow: ['price'],
  },
  { text: 'stutt í vinnuna', kind: 'vague', expect: {}, allow: ['price'] },
  {
    text: 'bý á Ísafirði',
    kind: 'vague',
    expect: {},
    allow: ['drive', 'range'],
  },

  {
    text: 'eitthvað ódýrt',
    kind: 'vague',
    expect: { price: { oneOf: ['cheap', 'mid_priced'] } },
  },
  {
    text: 'ódýrasti bíllinn',
    kind: 'vague',
    expect: { price: { oneOf: ['cheap'] } },
  },
  { text: 'jeppi fyrir fjallvegi', kind: 'vague', expect: { drive: ['AWD'] } },
  { text: 'hálka og brekkur', kind: 'vague', expect: { drive: ['AWD'] } },
  {
    text: 'nýr bíll sem er ekki kominn til landsins',
    kind: 'vague',
    expect: {},
  },
  {
    text: 'mest fyrir peninginn',
    kind: 'vague',
    expect: { value: 'any' },
    allow: ['price'],
  },
  {
    text: 'ódýr en langdrægur',
    kind: 'vague',
    expect: { price: { oneOf: ['cheap', 'mid_priced'] }, range: 'any' },
    allow: ['value'],
  },
  {
    text: 'langdrægur jeppi á góðu verði',
    kind: 'vague',
    expect: { range: 'any', price: 'any' },
    allow: ['drive', 'value'],
  },

  { text: 'kemst 600 á hleðslunni', kind: 'number', expect: { range: 600 } },
  { text: 'við erum 8', kind: 'number', expect: { seats: 8 } },
  {
    text: 'ekki dýrari en 8',
    kind: 'number',
    expect: { price: 8_000_000 },
  },
  {
    text: 'má kosta 6.000.000 og komast 450',
    kind: 'number',
    expect: { price: 6_000_000, range: 450 },
  },
  {
    text: 'kostar 7 og kemst 400',
    kind: 'number',
    expect: { price: 7_000_000, range: 400 },
  },
  {
    text: 'budget upp á 6,5',
    kind: 'number',
    expect: { price: 6_500_000 },
  },
  {
    text: 'snöggur, 5 í hundraðið',
    kind: 'number',
    expect: { acceleration: 5 },
  },
  {
    text: 'langdrægur, helst 500 eða meira',
    kind: 'number',
    expect: { range: 500 },
  },
  {
    text: '600 á einni hleðslu og fjórhjóladrif',
    kind: 'number',
    expect: { range: 600, drive: ['AWD'] },
  },
  {
    text: 'tveir fullorðnir og fjögur börn, ekki yfir 10',
    kind: 'number',
    expect: { price: 10_000_000, seats: 7 },
  },
  {
    text: 'við erum 3 og keyrum 300 á dag',
    kind: 'number',
    expect: { range: 'any' },
    allow: ['seats'],
  },
  {
    text: '5 sæti og ekki meira en 9',
    kind: 'number',
    expect: { seats: 5, price: 9_000_000 },
  },
  {
    text: 'má ekki kosta meira en 6.000.000',
    kind: 'literal',
    expect: { price: 6_000_000 },
  },

  { text: 'hvað kostar að hlaða heima?', kind: 'question', expect: {} },
  { text: 'hvaða bíl mælir þú með?', kind: 'question', expect: {} },
  { text: 'er rafbíll góður á Íslandi?', kind: 'question', expect: {} },
  { text: 'hvað endist rafhlaðan lengi?', kind: 'question', expect: {} },
  { text: 'hvernig virkar rafbílastyrkurinn?', kind: 'question', expect: {} },
  {
    text: 'hvað tekur langan tíma að hlaða?',
    kind: 'question',
    expect: {},
    allow: ['fastcharge'],
  },
  {
    text: 'er hægt að draga kerru?',
    kind: 'question',
    expect: {},
    allow: ['drive'],
  },
  {
    text: 'borgar sig að bíða eftir nýjum bílum?',
    kind: 'question',
    expect: {},
  },
  {
    text: 'hvaða bíll er með mestu drægnina?',
    kind: 'question',
    expect: {},
    allow: ['range'],
  },
  {
    text: 'hver er ódýrasti 7 sæta bíllinn?',
    kind: 'question',
    expect: { seats: 7 },
    allow: ['price'],
  },
  { text: 'hvaða bílar eru til á lager?', kind: 'question', expect: {} },
  {
    text: 'hver er munurinn á Model 3 og Model Y?',
    kind: 'question',
    expect: { name: ['Model 3', 'Model Y'] },
  },

  // Written before the questions were worded against the cases above, and
  // first run only after, as a check that the wording was not fitted to them
  {
    text: 'á viðráðanlegu verði',
    kind: 'vague',
    expect: { price: { oneOf: ['cheap', 'mid_priced'] } },
  },
  {
    text: 'snöggur og ódýr',
    kind: 'vague',
    expect: {
      acceleration: 'any',
      price: { oneOf: ['cheap', 'mid_priced'] },
    },
  },
  {
    text: 'ódýrt og kemst langt',
    kind: 'vague',
    expect: { price: { oneOf: ['cheap', 'mid_priced'] }, range: 'any' },
    allow: ['value'],
  },
  { text: 'sprækur bíll', kind: 'vague', expect: { acceleration: 'any' } },
  {
    text: 'fljótur upp í hundrað',
    kind: 'vague',
    expect: { acceleration: 'any' },
  },
  {
    text: 'stutt hleðslustopp á ferðinni',
    kind: 'vague',
    expect: { fastcharge: 'any' },
    allow: ['range'],
  },
  { text: 'kemst langt á hleðslunni', kind: 'vague', expect: { range: 'any' } },
  { text: 'hjón með fimm börn', kind: 'vague', expect: { seats: 7 } },
  {
    text: 'við erum fimm í fjölskyldunni',
    kind: 'vague',
    expect: {},
    allow: ['seats'],
  },
  { text: 'oft í snjó og hálku', kind: 'vague', expect: { drive: ['AWD'] } },
  { text: 'bíll sem ég get fengið í næstu viku', kind: 'vague', expect: {} },
  { text: 'bíð eftir nýju módelunum', kind: 'vague', expect: {} },
  {
    text: 'besta drægni miðað við verð',
    kind: 'vague',
    expect: { value: 'any' },
    allow: ['price', 'range'],
  },
  { text: 'lúxusbíll', kind: 'vague', expect: {}, allow: ['acceleration'] },
  {
    text: 'hvað kostar ódýrasti bíllinn?',
    kind: 'question',
    expect: {},
    allow: ['price'],
  },
  {
    text: 'eru jeppar betri á veturna?',
    kind: 'question',
    expect: {},
    allow: ['drive'],
  },
  {
    text: 'hvaða bíll hleður hraðast?',
    kind: 'question',
    expect: {},
    allow: ['fastcharge'],
  },
  {
    text: 'get ég hlaðið í fjölbýli?',
    kind: 'question',
    expect: {},
  },

  // Written before numbers in words were offered to the model or questions
  // to the advisor were told apart, and first run only after
  { text: 'við erum átta', kind: 'number', expect: { seats: 8 } },
  { text: 'má kosta sjö', kind: 'number', expect: { price: 7_000_000 } },
  {
    text: 'fimm milljónir hámark',
    kind: 'number',
    expect: { price: 5_000_000 },
  },
  { text: 'með 4 börn', kind: 'number', expect: { seats: 7 } },
  {
    text: 'þrjú börn og hundur',
    kind: 'number',
    expect: {},
    allow: ['seats'],
  },
  {
    text: 'hvaða bíl mælir þú með fyrir fjögurra manna fjölskyldu?',
    kind: 'question',
    expect: { seats: 4 },
  },
  {
    text: 'hvaða rafbíll er með bestu hröðunina?',
    kind: 'question',
    expect: {},
    allow: ['acceleration'],
  },
  {
    text: 'hvað kostar Tesla Model Y?',
    kind: 'question',
    expect: { name: ['Model Y'] },
  },
  {
    text: 'hvaða bíll er ódýrastur?',
    kind: 'question',
    expect: {},
    allow: ['price'],
  },
  {
    text: 'hvernig er drægnin á veturna?',
    kind: 'question',
    expect: {},
    allow: ['range'],
  },
  {
    text: 'er fjórhjóladrif nauðsynlegt á Íslandi?',
    kind: 'question',
    expect: {},
    allow: ['drive'],
  },
  {
    text: 'hvaða bíll hentar best í langferðir?',
    kind: 'question',
    expect: {},
    allow: ['range'],
  },
  { text: 'hvað er WLTP?', kind: 'question', expect: {} },
  {
    text: 'hvaða bílar eru með 7 sætum?',
    kind: 'question',
    expect: { seats: 7 },
  },
  {
    text: 'hversu langt kemst ódýrasti bíllinn?',
    kind: 'question',
    expect: {},
    allow: ['price', 'range'],
  },
  {
    text: 'hvað tekur langan tíma að hlaða á hraðhleðslustöð?',
    kind: 'question',
    expect: {},
    allow: ['fastcharge'],
  },
  {
    text: 'get ég dregið hjólhýsi á rafbíl?',
    kind: 'question',
    expect: {},
    allow: ['drive'],
  },
  {
    text: 'hvaða sjö sæta bíll er ódýrastur?',
    kind: 'question',
    expect: { seats: 7 },
    allow: ['price'],
  },
]

const questions = buildIntentQuestions()

/** The value each bracket label stands for, as the cars are now */
export const bracketValues = (key: FilterKey): Map<string, unknown> =>
  new Map(
    (questions[key]?.options ?? []).map((option) => [
      option.label,
      option.value,
    ]),
  )

const sameValue = (
  key: FilterKey,
  expected: Expectation[FilterKey],
  actual: unknown,
): boolean => {
  if (expected === 'any') return true
  if (expected && typeof expected === 'object' && 'oneOf' in expected) {
    const values = bracketValues(key)
    return expected.oneOf.some((label) =>
      sameValue(key, values.get(label) as Expectation[FilterKey], actual),
    )
  }
  return Array.isArray(expected) && Array.isArray(actual)
    ? [...expected].sort().join() === [...actual].sort().join()
    : expected === actual
}

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
        got[key] !== undefined &&
        sameValue(key, testCase.expect[key], got[key]),
    ),
    wrong: expected.filter(
      (key) =>
        got[key] !== undefined &&
        !sameValue(key, testCase.expect[key], got[key]),
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
