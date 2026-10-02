import { Drive, Filters } from '@/types'
import cars, { Car } from './cars'
import carFilter from './carFilter'
import { filterDefinitions, normalizeFilters } from './filters'

type FilterKey = keyof Filters
type Value<Key extends FilterKey> = NonNullable<Filters[Key]>

// A sentence or two. Shared by the input and the route, which refuses longer.
export const MAX_INTENT_LENGTH = 200

/**
 * Lower case without accents, þ, æ or ð, so "sæti", "saeti" and "Sæti" read
 * alike. People type Icelandic on keyboards without the letters, and the
 * patterns below are written against this form only.
 */
export const foldText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/þ/g, 'th')
    .replace(/æ/g, 'ae')
    .replace(/ð/g, 'd')
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')

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
const MILLION = String.raw`(?:m\.?\s?kr\.?|mkr|milljon\w*|miljon\w*|millj\w*|milj\w*|millu\w*|millur|m)`
const KRONUR = String.raw`(?:kr\.?|kronur\w*|isk)`

const pattern = (source: string) => new RegExp(source, 'gu')

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
  const [whole, fraction] = groups
  const thousands = raw.includes('.') && fraction.length === 3 && !preferDecimal
  return thousands ? Number(whole + fraction) : Number(`${whole}.${fraction}`)
}

const smallNumber = (raw: string): number =>
  numberWords[raw] ?? parseNumber(raw)

const within = (value: number, min: number, max: number) =>
  Number.isFinite(value) && value >= min && value <= max

const lastWords = (before: string, count: number): string[] =>
  before
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .slice(-count)

const lowerBoundWords = new Set(['yfir', 'fra', 'minnst', 'lagmark', 'amk'])
const lowerBoundPhrases = ['minnsta kosti', 'meira en']
const upperBoundWords = new Set(['undir', 'hamark', 'max', 'innan'])
const upperBoundPhrases = ['minna en', 'mesta lagi']

type Bound = 'lower' | 'upper'

/**
 * Which way the words just before a number point. "ekki yfir" is a ceiling
 * and "ekki undir" a floor, which is most of what a negation does to a number.
 */
const boundBefore = (before: string): Bound | undefined => {
  const words = lastWords(before, 3)
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

  const [bound, length] = found
  if (words.at(-length - 1) !== 'ekki') return bound
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
const makePattern = (name: string) => {
  const folded = namePattern(name)
  return folded.endsWith('a')
    ? `${folded.slice(0, -1)}(?:a|u|an|una|unni|unnar)`
    : `${folded}(?:inn|inum|ins|num|nn|n|s|i)?`
}

const makeAliases: Record<string, string[]> = {
  'Mercedes-Benz': ['mercedes', 'benz', 'merc'],
  Volkswagen: ['vw', 'folksvagen'],
  'Range Rover': ['land rover'],
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

  const entries: Array<NameEntry & { length: number }> = [
    ...[...makesByModel].map(([model, makes]) => ({
      name: model,
      makes,
      isModel: true,
      source: `${START}${namePattern(model)}${END}`,
      length: foldText(model).length,
    })),
    ...makes.flatMap((make) =>
      [make, ...(makeAliases[make] ?? [])].map((spelling) => ({
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

/**
 * Words that say nothing a filter could use, so a request made of nothing
 * else needs no model. The topic words are here too: "drægni" alone asks for
 * nothing, and "drægni yfir 500 km" has had its number read already.
 */
const fillerWords = new Set(
  `
  og eda en sem er eru ad a i um med fyrir til fra af vid mig mer eg okkur
  vantar langar leita leitum vil viljum thad helst gjarnan takk kaupa nyjan
  nyr nytt ca bil bill bilinn bilnum bila bilar bilum bils rafbil rafbill
  rafbila rafbilar rafmagnsbil rafmagnsbill kr krona kronur sirka uth
  eitthvad undir yfir hamark lagmark max minnst amk meira minna minnsta kosti
  mesta lagi upp ekki innan verd verdi kostar kosta budget draegni saeti
  saeta saetum drif drifi hrodun sek hledsla hradhledsla hradhledslu km
  kilometra manna tharf bara rafmagns bilarnir bilana
  `
    .trim()
    .split(/\s+/),
)

export interface ParsedIntent {
  /** What the text says outright, as the list would apply it */
  filters: Filters
  /** Words no rule read, and that are not filler */
  unread: string[]
}

/**
 * The filters a request states in so many words: numbers with their units,
 * seat counts, drive, availability, makes and models. Exact and free, so
 * whatever it reads is never asked of a model, and it never guesses — a word
 * it does not know is left in `unread` for one that can.
 */
export const parseFilterIntent = (text: string): ParsedIntent => {
  let rest = foldText(text.slice(0, MAX_INTENT_LENGTH))
  const filters: Filters = {}
  const drives: Drive[] = []
  const names: Array<{ index: number; entry: NameEntry }> = []

  // Read spans are blanked rather than cut, so later indices still hold
  const take = (
    source: string,
    read: (match: RegExpExecArray, before: string) => boolean | void,
  ) => {
    for (const match of rest.matchAll(pattern(source))) {
      const before = rest.slice(0, match.index)
      if (read(match, before) === false) continue
      rest =
        before +
        ' '.repeat(match[0].length) +
        rest.slice(match.index + match[0].length)
    }
  }

  const set = <Key extends FilterKey>(key: Key, value: Value<Key>) => {
    filters[key] ??= value
  }

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

  take(String.raw`${START}${NUM}\s*${MILLION}${END}`, ([, raw], before) => {
    const max = parseNumber(raw, true) * 1_000_000
    // There is no lowest price to filter on, so "yfir 5 milljónum" is read
    // and dropped rather than mistaken for a ceiling
    if (within(max, 1_000_000, 100_000_000) && boundBefore(before) !== 'lower')
      set('price', max)
  })

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
      const min = smallNumber(raw)
      if (!within(min, 2, 9)) return false
      set('seats', min)
    },
  )

  take(String.raw`${START}fyrir\s+${SMALL}${END}`, ([, raw]) => {
    const min = smallNumber(raw)
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

  take(
    String.raw`${START}(?:faanleg\w*|a lager\w*|lagerbil\w*|strax|sem fyrst|til afhendingar|til nuna)${END}`,
    () => set('availability', 'available'),
  )
  take(String.raw`${START}(?:vaentanleg\w*|a leidinni)${END}`, () =>
    set('availability', 'expected'),
  )

  for (const entry of nameEntries) {
    take(entry.source, (match) => {
      names.push({ index: match.index, entry })
    })
  }
  // "Kia EV9" asks for the EV9, not for every Kia
  const modelMakes = new Set(
    names.flatMap(({ entry }) => (entry.isModel ? [...entry.makes] : [])),
  )
  const nameList = [
    ...new Set(
      names
        .filter(({ entry }) => entry.isModel || !modelMakes.has(entry.name))
        .sort((a, b) => a.index - b.index)
        .map(({ entry }) => entry.name),
    ),
  ]
  if (nameList.length) set('name', nameList)

  const unread = rest
    .split(/[^\p{L}]+/u)
    .filter((word) => word.length > 1 && !fillerWords.has(word))

  return { filters: normalizeFilters(filters), unread }
}

/** Whether anything is left that only a model could read */
export const needsModel = (parsed: ParsedIntent): boolean =>
  parsed.unread.length > 0

export type SuggestionSource = 'text' | 'model'

export type FilterSuggestion = {
  [Key in FilterKey]: {
    key: Key
    value: Value<Key>
    source: SuggestionSource
    /** 1 for what the text says outright */
    probability: number
  }
}[FilterKey]

const filterKeys = Object.keys(filterDefinitions) as FilterKey[]

export const suggestionsFromFilters = (
  filters: Filters,
  source: SuggestionSource,
  probability = 1,
): FilterSuggestion[] =>
  filterKeys.flatMap((key) =>
    filters[key] === undefined
      ? []
      : [{ key, value: filters[key], source, probability } as FilterSuggestion],
  )

export const withSuggestion = (
  filters: Filters,
  suggestion: Pick<FilterSuggestion, 'key' | 'value'>,
): Filters => ({ ...filters, [suggestion.key]: suggestion.value })

const sameValue = (a: unknown, b: unknown) =>
  Array.isArray(a) && Array.isArray(b)
    ? [...a].sort().join() === [...b].sort().join()
    : a === b

/**
 * Suggestions as they arrive from the route, each put through the filter's own
 * parser: anything that would not survive the URL is no suggestion.
 */
export const readSuggestions = (json: unknown): FilterSuggestion[] => {
  const list =
    json && typeof json === 'object' && 'suggestions' in json
      ? json.suggestions
      : undefined
  if (!Array.isArray(list)) return []

  return list.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') return []
    const { key, value, source, probability } = item as Record<string, unknown>
    if (typeof key !== 'string' || !Object.hasOwn(filterDefinitions, key))
      return []
    if (source !== 'text' && source !== 'model') return []
    if (typeof probability !== 'number' || !within(probability, 0, 1)) return []
    const parsed = normalizeFilters({ [key]: value })[key as FilterKey]
    if (parsed === undefined) return []
    return [{ key, value: parsed, source, probability } as FilterSuggestion]
  })
}

export type RankedSuggestion = FilterSuggestion & {
  /** Cars the list would show with this added to the current filters */
  count: number
}

/**
 * The suggestions worth a chip, best first, each counted against the filters
 * already set. What the text says is always offered, even when it matches
 * nothing, since that is an answer. A model's guess is dropped when it narrows
 * nothing, or when it would take the suggestions together to zero: a wrong
 * filter quietly empties the list, and offering one is how it gets applied.
 */
export const rankSuggestions = (
  suggestions: ReadonlyArray<FilterSuggestion>,
  current: Filters,
  list: ReadonlyArray<Car> = cars,
): { suggestions: RankedSuggestion[]; combined: Filters; count: number } => {
  const count = (filters: Filters) =>
    list.filter(carFilter(normalizeFilters(filters))).length
  const currentCount = count(current)

  const ordered = [...suggestions].sort(
    (a, b) =>
      Number(b.source === 'text') - Number(a.source === 'text') ||
      b.probability - a.probability,
  )

  let combined = current
  const kept: RankedSuggestion[] = []
  for (const suggestion of ordered) {
    if (sameValue(current[suggestion.key], suggestion.value)) continue
    if (kept.some(({ key }) => key === suggestion.key)) continue

    const alone = count(withSuggestion(current, suggestion))
    const together = count(withSuggestion(combined, suggestion))
    if (
      suggestion.source === 'model' &&
      (together === 0 || alone === currentCount)
    )
      continue

    combined = withSuggestion(combined, suggestion)
    kept.push({ ...suggestion, count: alone })
  }

  return { suggestions: kept, combined, count: count(combined) }
}
