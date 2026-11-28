import type { Drive } from '@/modules/data/newCarSchema'
import cars, { type Car } from '@/modules/data/cars'
import {
  normalizeFilters,
  type FilterKey,
  type Filters,
  type FilterValue,
} from './filters'
import { foldText, makeAliases } from './carNames'

// A sentence or two. Shared by the input and the route, which refuses longer.
export const MAX_INTENT_LENGTH = 200

const numberWords: Record<string, number> = {
  tveir: 2,
  tvo: 2,
  tvaer: 2,
  tveggja: 2,
  thrir: 3,
  thrju: 3,
  thrjar: 3,
  thriggja: 3,
  fjorir: 4,
  fjogur: 4,
  fjorar: 4,
  fjogurra: 4,
  fimm: 5,
  sex: 6,
  sjo: 7,
  atta: 8,
  niu: 9,
}

const START = String.raw`(?<![\p{L}\p{N}])`
const END = String.raw`(?![\p{L}\p{N}])`
const NUM = String.raw`(\d+(?:[.,]\d+)*)`
const SMALL = String.raw`(\d|${Object.keys(numberWords).join('|')})`
const MILLION = String.raw`(?:m\.?\s?kr\.?|mkr|milljon\w*|miljon\w*|millj\w*|milj\w*|millu\w*|millur|mill\.?|m)`
const KRONUR = String.raw`(?:kr\.?|kronur\w*|isk)`

const pattern = (source: string) => new RegExp(source, 'gu')

// A rule that reads a number from its match captures that number first
type RuleMatch = RegExpExecArray & { 1: string }

/**
 * A dot is the thousands separator in Icelandic and a comma the decimal one,
 * but plenty write 8.5 too. One dot before three digits is thousands, unless
 * the unit is millions, where 8.500 milljónir can only mean eight and a half.
 */
const parseNumber = (raw: string, preferDecimal = false): number => {
  const groups = raw.split(/[.,]/)
  if (groups.length === 1) return Number(raw)
  if (groups.length > 2) {
    return groups.slice(1).every((group) => group.length === 3)
      ? Number(groups.join(''))
      : NaN
  }
  const [whole = '', fraction = ''] = groups
  const thousands = raw.includes('.') && fraction.length === 3 && !preferDecimal
  return thousands ? Number(whole + fraction) : Number(`${whole}.${fraction}`)
}

/** A number as the parser left it, in digits or spelled out */
export const readNumber = (raw: string, preferDecimal = false): number =>
  numberWords[raw] ?? parseNumber(raw, preferDecimal)

export const within = (value: number, min: number, max: number) =>
  Number.isFinite(value) && value >= min && value <= max

// Below the lightest a car tows and above what the EU allows one. Shared with
// the filter suggestions, so a number reads as towing in both or in neither.
export const MIN_TOWING = 300
export const MAX_TOWING = 3500

/**
 * A towing weight in kg, where a number under ten can only be tonnes. Digits
 * only: a spelled-out "þrjú" counts people or children, not tonnes.
 */
export const readTowing = (raw: string): number | undefined => {
  const value = parseNumber(raw, true)
  const kg = Math.round(value < 10 ? value * 1000 : value)
  return within(kg, MIN_TOWING, MAX_TOWING) ? kg : undefined
}

// "draga", "dregur", "dráttargeta": the words a towing number follows
const TOWING_VERB = String.raw`(?:drag\w*|dreg\w*|dratt\w*)`

// What makes a weight in kg one to tow rather than the car's own. Not "bat"
// as a stem, which "batterí" begins with.
const towingWords = new RegExp(
  String.raw`${START}(?:${TOWING_VERB}|krok\w*|kerr\w*|hjolhys\w*|fellihys\w*|tjaldvag\w*|eftirvag\w*|hestaker\w*|bat|batur|batinn|batnum|bats|batar|batana)${END}`,
  'u',
)

// The schema's bounds, shared with the filter suggestions like the towing ones
export const MIN_GROUND_CLEARANCE = 100
export const MAX_GROUND_CLEARANCE = 350

const CENTIMETRES = String.raw`(?:cm|sm|sentimetr\w*|centimetr\w*)`
const CLEARANCE_UNIT = String.raw`(?:mm|millimetr\w*|${CENTIMETRES})`
const centimetreUnit = new RegExp(`^${CENTIMETRES}$`, 'u')

// A number without its unit that is too small to be mm is cm, as "veghæð 20"
// can only mean 20 cm
const inCentimetres = (value: number, unit?: string) =>
  unit ? centimetreUnit.test(unit) : value <= MAX_GROUND_CLEARANCE / 10

/** A ground clearance in mm, written in mm or cm */
export const readGroundClearance = (
  raw: string,
  unit?: string,
): number | undefined => {
  const value = parseNumber(raw, true)
  const mm = Math.round(inCentimetres(value, unit) ? value * 10 : value)
  return within(mm, MIN_GROUND_CLEARANCE, MAX_GROUND_CLEARANCE) ? mm : undefined
}

// Not "hátt undir hann" as the word a number follows: that is left for a
// model. It still makes a length in cm or mm a clearance.
const CLEARANCE_WORD = String.raw`veghaed\w*`
const HIGH_UNDER = String.raw`${START}hatt undir${END}`
const clearanceWords = new RegExp(
  String.raw`${START}${CLEARANCE_WORD}${END}|${HIGH_UNDER}`,
  'u',
)

// The "undir" of "hátt undir" asks for more height, not a ceiling on it, so
// it is hidden from the bound a clearance number takes
const clearanceBefore = (before: string) =>
  before.replace(new RegExp(HIGH_UNDER, 'gu'), (phrase) =>
    ' '.repeat(phrase.length),
  )

// What may stand between a towing or clearance word and its number: bounds
// and little else, so "dráttarkrókur og 500 lítra skott" is not read as towing
const BOUND_GAP =
  'minnst|lagmark|yfir|amk|ad|minnsta|kosti|um|ca|sirka|allt|upp|i|er|undir|hamark|max|mesta|lagi|meira|meiri|haerri|minna|minni|laegri|en|ekki'

// A number followed by one of these is some other figure's
const OTHER_UNIT = String.raw`(?:km|kilometr\w*|kr|kronur\w*|isk|kwh|kw|ho|hestofl\w*|hp|ps|litr\w*|l|sek\w*|s|saet\w*|manna|manns|milljon\w*|miljon\w*|millj\w*|m|mkr|thus\w*)`

// Not "kilo" as a stem, which "kilometra" begins with
const WEIGHT = String.raw`(?:kg|kilo(?:a|in|um|gr\w*)?|tonn\w*)`

// "draga 2 hesta" counts horses, so a bare number under ten is tonnes only
// where no word but a joining one follows it
const countFollows = /^\s+(?!(?:og|eda|en|helst)(?![\p{L}\p{N}]))\p{L}/u

// What a rule has read is blanked with this rather than cut, so later indices
// still hold
const READ = '\u0000'

// Back no further than what a rule has read: the "undir" in "undir 10
// milljónum 500 km" bounds the price, not the range after it
const lastWords = (before: string, count: number): string[] =>
  before
    .slice(before.lastIndexOf(READ) + 1)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .slice(-count)

const lowerBoundWords = new Set(['yfir', 'fra', 'minnst', 'lagmark', 'amk'])
const lowerBoundPhrases = ['minnsta kosti', 'meira en', 'meiri en', 'haerri en']
const upperBoundWords = new Set(['undir', 'hamark', 'max', 'innan'])
const upperBoundPhrases = ['minna en', 'minni en', 'laegri en', 'mesta lagi']

type Bound = 'lower' | 'upper'
const boundVerbs = new Set(['kosta', 'kostar', 'fara', 'vera'])

/**
 * Which way the words just before a number point. "ekki yfir" is a ceiling
 * and "ekki undir" a floor, which is most of what a negation does to a number.
 */
const boundBefore = (before: string): Bound | undefined => {
  const words = lastWords(before, 4)
  const last = words.at(-1) ?? ''
  const pair = words.slice(-2).join(' ')

  const found: [Bound, number] | undefined = lowerBoundWords.has(last)
    ? ['lower', 1]
    : upperBoundWords.has(last)
      ? ['upper', 1]
      : lowerBoundPhrases.includes(pair)
        ? ['lower', 2]
        : upperBoundPhrases.includes(pair)
          ? ['upper', 2]
          : undefined
  if (!found) return undefined

  // "má ekki kosta meira en" puts a verb between the negation and the bound
  const [bound, length] = found
  const gap = words.at(-length - 1) ?? ''
  const negated =
    gap === 'ekki' || (boundVerbs.has(gap) && words.at(-length - 2) === 'ekki')
  if (!negated) return bound
  return bound === 'lower' ? 'upper' : 'lower'
}

const negations = new Set(['ekki', 'enga', 'engin', 'ekkert', 'an'])
const negatedBefore = (before: string) =>
  lastWords(before, 2).some((word) => negations.has(word))

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const namePattern = (name: string) =>
  foldText(name)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(escape)
    .join(String.raw`[\s-]*`)

// Teslu, Polestarinn: a make is a noun, and it inflects
const feminineEndings = ['a', 'u', 'an', 'una', 'unni', 'unnar']
const otherEndings = ['', 'inn', 'inum', 'ins', 'num', 'nn', 'n', 's', 'i']

const makePattern = (name: string) => {
  const folded = namePattern(name)
  return folded.endsWith('a')
    ? `${folded.slice(0, -1)}(?:${feminineEndings.join('|')})`
    : `${folded}(?:${otherEndings.filter(Boolean).join('|')})?`
}

const inflectionsOf = (make: string) =>
  make.endsWith('a')
    ? feminineEndings.map((ending) => make.slice(0, -1) + ending)
    : otherEndings.map((ending) => make + ending)

/** Whether two words are one swap of neighbouring letters apart */
const oneSwapApart = (a: string, b: string) => {
  if (a.length !== b.length) return false
  const [first, second, ...more] = [...a].flatMap((letter, i) =>
    letter === b[i] ? [] : [i],
  )
  return (
    first !== undefined &&
    second === first + 1 &&
    more.length === 0 &&
    a[first] === b[second] &&
    a[second] === b[first]
  )
}

/** Whether two words are one letter changed, added, dropped or swapped apart */
const oneTypoApart = (a: string, b: string) => {
  if (a === b || Math.abs(a.length - b.length) > 1) return false
  if (a.length === b.length) {
    const differ = [...a].filter((letter, i) => letter !== b[i]).length
    return differ === 1 || oneSwapApart(a, b)
  }
  const [short, long] = a.length < b.length ? [a, b] : [b, a]
  const at = [...short].findIndex((letter, i) => letter !== long[i])
  return at === -1 || short.slice(at) === long.slice(at + 1)
}

// A model called "C" or "3" would match every sentence with a letter or a
// digit in it, so only the ones that read as a name on their own are looked for
const genericModels = new Set(['electric'])
const isNameLike = (model: string) => {
  const folded = foldText(model)
  return (
    /\p{L}/u.test(folded) &&
    (folded.length >= 3 || /\d/.test(folded)) &&
    !genericModels.has(folded)
  )
}

interface NameEntry {
  name: string
  // The make a model belongs to, or the make itself
  makes: ReadonlySet<string>
  isModel: boolean
  source: string
}

const buildNameEntries = (list: ReadonlyArray<Car>): NameEntry[] => {
  const makesByModel = new Map<string, Set<string>>()
  for (const car of list) {
    if (!isNameLike(car.model)) continue
    const makes = makesByModel.get(car.model) ?? new Set()
    makes.add(car.make)
    makesByModel.set(car.model, makes)
  }
  const makes = [...new Set(list.map((car) => car.make))]
  const spellingsOf = (make: string) => [make, ...(makeAliases[make] ?? [])]

  // A Polestar 4 or a Smart #5 is a number on its own, which only reads as
  // that model right after its make
  const numbered = [
    ...new Map(
      list
        .filter((car) => /^#?\d+$/.test(car.model))
        .map((car) => [`${car.make} ${car.model}`, car] as const),
    ),
  ].map(([name, car]) => {
    const makes = spellingsOf(car.make).map(makePattern).join('|')
    const number = car.model.replace('#', '')
    return {
      name,
      makes: new Set([car.make]),
      isModel: true,
      source: String.raw`${START}(?:${makes})[\s-]*#?\s*${number}${END}`,
      length: foldText(name).length,
    }
  })

  const entries: Array<NameEntry & { length: number }> = [
    ...numbered,
    ...[...makesByModel].map(([model, makes]) => ({
      name: model,
      makes,
      isModel: true,
      source: `${START}${namePattern(model)}${END}`,
      length: foldText(model).length,
    })),
    ...makes.flatMap((make) =>
      spellingsOf(make).map((spelling) => ({
        name: make,
        makes: new Set([make]),
        isModel: false,
        source: `${START}${makePattern(spelling)}${END}`,
        length: foldText(spelling).length,
      })),
    ),
  ]
  // Longest first, so "Seal U" is read before "Seal" can take half of it
  return entries.sort((a, b) => b.length - a.length)
}

const nameEntries = buildNameEntries(cars)

// Each one-word spelling of a make, inflected, with how far a typo may stray
// from it. A short make takes only a swap, as one changed letter turns Smart
// into "snart" and Mazda into words no one meant as a car.
const makeForms = (() => {
  const spellings = [...new Set(cars.map((car) => car.make))].flatMap((make) =>
    [make, ...(makeAliases[make] ?? [])].map((spelling) => ({
      make,
      folded: foldText(spelling),
    })),
  )
  return spellings
    .filter(({ folded }) => /^\p{L}+$/u.test(folded) && folded.length >= 5)
    .flatMap(({ make, folded }) =>
      inflectionsOf(folded).map((form) => ({
        make,
        form,
        isNear: folded.length >= 6 ? oneTypoApart : oneSwapApart,
      })),
    )
})()

// A word that is already a make's or a model's own name is never a typo
const knownWords = new Set([
  ...makeForms.map(({ form }) => form),
  ...cars.flatMap((car) => foldText(`${car.make} ${car.model}`).split(/\W+/)),
])

/**
 * "Polstar" and "Hongqui" spelled as the make, so the rules after read them as
 * they read the make. Only where one make is that near, as a word near two is
 * no make in particular.
 */
const correctMakes = (text: string) =>
  text.replace(/\p{L}+/gu, (word) => {
    if (word.length < 5 || knownWords.has(word) || fillerWords.has(word))
      return word
    const [nearest, ...others] = makeForms.filter(({ form, isNear }) =>
      isNear(word, form),
    )
    if (!nearest || others.some(({ make }) => make !== nearest.make))
      return word
    return nearest.form
  })

/**
 * Words that say nothing a filter could use, so a request made of nothing
 * else needs no model. The topic words are here too: "drægni" alone asks for
 * nothing, and "drægni yfir 500 km" has had its number read already.
 */
const fillerWords = new Set(
  `
  og eda en sem er eru ad a i um med fyrir til fra af vid mig mer eg okkur ma
  vantar langar leita leitum vil viljum thad helst gjarnan takk kaupa nyjan
  nyr nytt ca bil bill bilinn bilnum bila bilar bilum bils rafbil rafbill
  rafbila rafbilar rafmagnsbil rafmagnsbill kr krona kronur sirka uth
  eitthvad undir yfir hamark lagmark max minnst amk meira minna minnsta kosti
  mesta lagi upp ekki innan verd verdi kostar kosta budget draegni saeti
  saeta saetum drif drifi hrodun sek hledsla hradhledsla hradhledslu km
  kilometra manna tharf bara rafmagns bilarnir bilana kg kilo kiloa tonn
  tonnum haerri laegri
  `
    .trim()
    .split(/\s+/),
)

export interface ParsedIntent {
  /** What the text says outright, as the list would apply it */
  filters: Filters
  /** Words no rule read, and that are not filler */
  unread: string[]
  /** Numbers no rule read, as written, for a model to place */
  numbers: string[]
}

/**
 * The filters a request states in so many words: numbers with their units,
 * seat counts, drive, makes and models. Exact and free, so whatever it reads
 * is never asked of a model, and it never guesses — a word it does not know is
 * left in `unread`, and a number it cannot place in `numbers`, for one that can.
 */
export const parseFilterIntent = (text: string): ParsedIntent => {
  let rest = correctMakes(foldText(text.slice(0, MAX_INTENT_LENGTH)))
  const aboutTowing = towingWords.test(rest)
  const aboutClearance = clearanceWords.test(rest)
  const filters: Filters = {}
  const drives: Drive[] = []
  const names: Array<{ index: number; entry: NameEntry }> = []

  const take = (
    source: string,
    read: (match: RuleMatch, before: string) => boolean | void,
  ) => {
    for (const match of rest.matchAll(pattern(source))) {
      const before = rest.slice(0, match.index)
      if (read(match as RuleMatch, before) === false) continue
      rest =
        before +
        READ.repeat(match[0].length) +
        rest.slice(match.index + match[0].length)
    }
  }

  const set = <Key extends FilterKey>(key: Key, value: FilterValue<Key>) => {
    filters[key] ??= value
  }

  // The 0 and 100 of "0-100" name the sprint, not a value of any filter
  take(
    String.raw`${START}0\s*(?:-|–|i|til|upp i)\s*100(?:\s*km\s*(?:\/|a|per)?\s*(?:klst|kl|h|t))?${END}`,
    () => {},
  )

  // Charging power or battery size, which no filter holds. The number is no
  // value of any filter, but the word is left for a model, as "200 kW
  // hleðsla" still asks for fast charging.
  take(
    String.raw`${START}${NUM}(?=\s*(?:kwh|kw|kilowott\w*|kilovott\w*)${END})`,
    () => {},
  )

  take(String.raw`${START}${NUM}\s*km\s*(?:\/|a|per)\s*min\w*`, ([, raw]) => {
    const min = parseNumber(raw)
    if (within(min, 1, 60)) set('fastcharge', min)
  })

  take(
    String.raw`${START}${NUM}\s*(thus\w*\s*)?${KRONUR}?\s*(?:\/|a|per)\s*(?:km|kilometr\w*)${END}`,
    ([, raw, thousand]) => {
      const max = parseNumber(raw) * (thousand ? 1000 : 1)
      if (within(max, 1000, 200_000)) set('value', max)
    },
  )

  // Three rows of seats is a seven seater, whatever the number says
  take(
    String.raw`${START}(?:3|thrjar|thriggja|thrju|thridj\w*)\s*saetarod\w*`,
    () => set('seats', 7),
  )

  // "dregur 1500" or "dráttargeta minnst 2000", the unit left out or not.
  // There is no filter for the most a car tows, so "undir 1000" is read and
  // dropped.
  take(
    String.raw`${START}${TOWING_VERB}(?:[\s:]+(?:${BOUND_GAP})){0,3}[\s:]+${NUM}${END}(?!\s*${OTHER_UNIT}${END})(?:\s*(${WEIGHT})${END})?`,
    (match, before) => {
      const [text, raw, unit] = match
      const after = match.input.slice(match.index + text.length)
      if (!unit && parseNumber(raw, true) < 10 && countFollows.test(after))
        return false
      const min = readTowing(raw)
      if (min === undefined) return false
      const lead = text.slice(0, text.lastIndexOf(raw))
      const bound = boundBefore(before + lead)
      // "dregur ekki 1500" says what it cannot tow, which is no floor
      if (!bound && negatedBefore(before + lead)) return false
      if (bound !== 'upper') set('towing', min)
    },
  )

  // A weight is only a weight to tow where the request is about towing, as
  // "um 1500 kg" alone is the car's own. "1,5 tonn" can only mean a tonne and
  // a half.
  take(
    String.raw`${START}${NUM}\s*(${WEIGHT})${END}(?:\s+dratt\w*)?`,
    (match, before) => {
      if (!aboutTowing) return false
      const tonnes = (match[2] ?? '').startsWith('tonn')
      const min = Math.round(
        parseNumber(match[1], tonnes) * (tonnes ? 1000 : 1),
      )
      if (!within(min, MIN_TOWING, MAX_TOWING)) return false
      const bound = boundBefore(before)
      if (!bound && negatedBefore(before)) return false
      if (bound !== 'upper') set('towing', min)
    },
  )

  // "veghæð 20 cm" or "veghæð minnst 180", read like a towing weight. No
  // filter holds the lowest a car may sit, so "undir 150" is read and dropped.
  take(
    String.raw`${START}${CLEARANCE_WORD}(?:[\s:]+(?:${BOUND_GAP})){0,3}[\s:]+${NUM}(?:${END}|(?=${CLEARANCE_UNIT}${END}))(?!\s*${OTHER_UNIT}${END})(?:\s*(${CLEARANCE_UNIT})${END})?`,
    (match, before) => {
      const [text, raw, unit] = match
      // "veghæð 20 tommu felgur" is a wheel, so a bare cm is read only where
      // no word but a joining one follows it
      const after = match.input.slice(match.index + text.length)
      if (
        !unit &&
        inCentimetres(parseNumber(raw, true)) &&
        countFollows.test(after)
      )
        return false
      const min = readGroundClearance(raw, unit)
      if (min === undefined) return false
      const lead = clearanceBefore(
        before + text.slice(0, text.lastIndexOf(raw)),
      )
      const bound = boundBefore(lead)
      if (!bound && negatedBefore(lead)) return false
      if (bound !== 'upper') set('groundClearance', min)
    },
  )

  // "200 mm veghæð": a length is only a clearance where the request is about
  // one, as "20 cm" alone could be anything
  take(
    String.raw`${START}${NUM}\s*(${CLEARANCE_UNIT})${END}(?:\s+veghaed\w*)?`,
    (match, before) => {
      if (!aboutClearance) return false
      const min = readGroundClearance(match[1], match[2])
      if (min === undefined) return false
      const lead = clearanceBefore(before)
      const bound = boundBefore(lead)
      if (!bound && negatedBefore(lead)) return false
      if (bound !== 'upper') set('groundClearance', min)
    },
  )

  // The lower end of "5 til 8 milljónir" is no filter, so it is read with the
  // ceiling rather than left for a model to place
  take(
    String.raw`${START}(?:\d+(?:[.,]\d+)*\s*(?:-|–|til)\s*)?${NUM}\s*${MILLION}${END}`,
    ([, raw], before) => {
      const max = parseNumber(raw, true) * 1_000_000
      // There is no lowest price to filter on, so "yfir 5 milljónum" is read
      // and dropped rather than mistaken for a ceiling
      if (
        within(max, 1_000_000, 100_000_000) &&
        boundBefore(before) !== 'lower'
      )
        set('price', max)
    },
  )

  take(
    String.raw`${START}${NUM}\s*(?:thusund\w*|thus\.?)\s*${KRONUR}?${END}`,
    ([, raw], before) => {
      const max = parseNumber(raw) * 1000
      if (!within(max, 1_000_000, 100_000_000)) return false
      if (boundBefore(before) !== 'lower') set('price', max)
    },
  )

  take(String.raw`${START}${NUM}\s*${KRONUR}?${END}`, ([, raw], before) => {
    const max = parseNumber(raw)
    if (!within(max, 1_000_000, 100_000_000)) return false
    if (boundBefore(before) !== 'lower') set('price', max)
  })

  take(
    String.raw`${START}${NUM}\s*\+?\s*(?:km|kilometr\w*)${END}(?!\s*(?:\/|a|per)\s*(?:klst|kl|h|t|min))`,
    ([, raw], before) => {
      const min = parseNumber(raw)
      if (!within(min, 50, 1500)) return false
      if (boundBefore(before) !== 'upper') set('range', min)
    },
  )

  take(
    String.raw`(?:draegni|draegi)\w*\s+(?:\p{L}+\s+){0,3}${NUM}${END}`,
    ([, raw]) => {
      const min = parseNumber(raw)
      if (!within(min, 50, 1500)) return false
      set('range', min)
    },
  )

  take(
    String.raw`${START}${SMALL}\s*\+?\s*(?:saet\w*|sati|sata|seta|seti|manna|manns|farthega\w*)${END}`,
    ([, raw]) => {
      const min = readNumber(raw)
      if (!within(min, 2, 9)) return false
      set('seats', min)
    },
  )

  take(String.raw`${START}fyrir\s+${SMALL}${END}`, ([, raw]) => {
    const min = readNumber(raw)
    if (!within(min, 2, 9)) return false
    set('seats', min)
  })

  take(String.raw`${START}${NUM}\s*(?:sek\w*|s)${END}`, ([, raw]) => {
    const max = parseNumber(raw)
    if (!within(max, 1.5, 20)) return false
    set('acceleration', max)
  })

  // "undir 9" with no unit left after the rules above is a budget in millions
  take(
    String.raw`${START}(?:undir|hamark|max|budget|ekki yfir)\s+(?:um\s+|ca\.?\s+)?${NUM}${END}`,
    ([, raw]) => {
      const max = parseNumber(raw, true) * 1_000_000
      if (!within(max, 1_000_000, 60_000_000)) return false
      set('price', max)
    },
  )

  const drivePatterns: Array<[Drive, string]> = [
    [
      'AWD',
      String.raw`(?:fjor|4)\s?hjola\s?dri\w*|fjorhjola\w*|4x4|4wd|awd|aldrif\w*|quattro|xdrive|4motion|dual motor`,
    ],
    ['RWD', String.raw`afturhjola\s?dri\w*|afturdrif\w*|rwd`],
    ['FWD', String.raw`framhjola\s?dri\w*|framdrif\w*|fwd`],
  ]
  for (const [drive, source] of drivePatterns) {
    take(`${START}(?:${source})${END}`, (_match, before) => {
      if (!negatedBefore(before) && !drives.includes(drive)) drives.push(drive)
    })
  }
  if (drives.length) set('drive', drives)

  // When the car can be had is not suggested, as it says little about which
  // car someone wants. The words are still read, so they ask no model.
  take(
    String.raw`${START}(?:faanleg\w*|a lager\w*|lagerbil\w*|strax|sem fyrst|til afhendingar|til nuna|vaentanleg\w*|a leidinni)${END}`,
    () => {},
  )

  for (const entry of nameEntries) {
    // There is no filter that leaves a make out, so "ekki Tesla" is read as nothing
    take(entry.source, (match, before) => {
      if (!negatedBefore(before)) names.push({ index: match.index, entry })
    })
  }
  // "Kia EV9" asks for the EV9, not for every Kia
  const modelMakes = new Set(
    names.flatMap(({ entry }) => (entry.isModel ? [...entry.makes] : [])),
  )
  const read = names
    .filter(({ entry }) => entry.isModel || !modelMakes.has(entry.name))
    .sort((a, b) => a.index - b.index)
  // A make alone goes where the row shows it, so a make already chosen there
  // is not offered again as a name
  const namesOf = (isModel: boolean) => [
    ...new Set(
      read
        .filter(({ entry }) => entry.isModel === isModel)
        .map(({ entry }) => entry.name),
    ),
  ]
  const makeList = namesOf(false)
  const modelList = namesOf(true)
  if (makeList.length) set('make', makeList)
  if (modelList.length) set('name', modelList)

  const unread = rest
    .split(/[^\p{L}]+/u)
    .filter((word) => word.length > 1 && !fillerWords.has(word))

  const numbers = [
    ...new Set(rest.match(pattern(`${START}(?:${NUM}|${SMALL})${END}`)) ?? []),
  ].filter((raw) => readNumber(raw) > 0)

  return { filters: normalizeFilters(filters), unread, numbers }
}

/** Whether anything is left that only a model could read */
export const needsModel = (parsed: ParsedIntent): boolean =>
  parsed.unread.length > 0 || parsed.numbers.length > 0

// Folded, as foldText leaves them. Only words that open nothing but a
// question: "má", "er" or "get" open as many wishes ("má ekki kosta meira
// en…"), and a model is asked about those whenever it is asked at all.
const questionOpeners = new Set(
  `hvad hvada hver hverjir hverja hvernig hversu hvort hvar hvenaer hvers hvi
  maeli maelir maelid maeliru`
    .trim()
    .split(/\s+/),
)

/**
 * Whether the text reads as a question for the advisor rather than a wish for
 * the list, judged on its first word and a closing question mark. Both are
 * free, so this stands where no model was asked, and alongside one that was.
 */
export const readsAsQuestion = (text: string): boolean => {
  const trimmed = text.trim()
  if (trimmed.endsWith('?')) return true
  const first = foldText(trimmed)
    .split(/[^\p{L}]+/u)
    .find((word) => word !== '')
  return first !== undefined && questionOpeners.has(first)
}
