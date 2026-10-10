import type {
  ChoiceQuestion,
  NoulQuestion,
  SystemOneRequest,
} from '@typesafe-ai/sdk'

import type { FilterKey, FilterValue } from '@/modules/list/filters'
import cars, { type Car } from '@/modules/data/cars'
import {
  needsModel,
  parseFilterIntent,
  readNumber,
} from '@/modules/list/filterIntent'
import {
  suggestionsFromFilters,
  type FilterSuggestion,
} from '@/modules/list/filterSuggestions'

interface Option<Key extends FilterKey> {
  label: string
  value: FilterValue<Key>
  description: string
  /** The number in the request the option was made from */
  number?: string
}

interface IntentQuestion<Key extends FilterKey> {
  key: Key
  /**
   * Ordered options run from the loosest filter to the tightest, and the
   * answer is read as a distribution over them. Unordered ones are a pick.
   */
  ordered: boolean
  instructions: string
  none: string
  options: Option<Key>[]
  /** The option a number in the request makes, where it could be this filter */
  fromNumber?: (text: string) => Option<Key> | undefined
  /** Those options, for the request at hand */
  stated?: Option<Key>[]
}

// The share of the probability that has to be off "none" for a filter to be
// suggested at all, and for an unordered one, on the option itself
export const APPLY_THRESHOLD = 0.6

// The most chance we take of picking a bracket tighter than the person meant.
// Too loose shows a few cars too many; too tight hides the ones they wanted.
export const TOO_TIGHT_RISK = 0.2

/**
 * Of brackets ordered loosest first, the tightest that is too tight with a
 * probability of at most `risk`: a quantile from the loose end rather than the
 * likeliest bracket, since a filter that is too tight fails quietly.
 */
export const conservativeIndex = (
  distribution: ReadonlyArray<number>,
  risk = TOO_TIGHT_RISK,
): number => {
  let looser = 0
  let index = 0
  while (index < distribution.length - 1) {
    looser += distribution[index]
    if (looser > risk) break
    index += 1
  }
  return index
}

// Nearest rank, so every bracket is a value a car in the list really has
const quantile = (values: number[], share: number): number => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.round(share * (sorted.length - 1))]
}

const millions = (kronur: number) => (kronur / 1_000_000).toFixed(1)

// Rounded the way that keeps the car the bracket was cut at
const ceilTo = (value: number, step: number) =>
  Math.ceil(Math.round((value / step) * 1000) / 1000) * step
const floorTo = (value: number, step: number) =>
  Math.floor(Math.round((value / step) * 1000) / 1000) * step
const ceilTenth = (value: number) => ceilTo(value * 10, 1) / 10
const floorTenth = (value: number) => floorTo(value * 10, 1) / 10

const within = (value: number, min: number, max: number) =>
  Number.isFinite(value) && value >= min && value <= max

// A label is a key the model answers with, so it holds no dot
const slug = (value: number) => String(value).replace('.', '_')

// The request is folded by then, so a number spelled out is shown as a figure
// too: "atta" alone is a word the model has to place first
const theNumber = (text: string) =>
  `The ${/\d/.test(text) ? text : `"${text}" (${readNumber(text)})`} in \`request\``

// The parser's bounds for each unit, so a number is offered to a filter only
// where it would have read it with the unit written out
const statedNumber =
  <Key extends 'range' | 'acceleration' | 'fastcharge' | 'value'>(
    [min, max]: [number, number],
    label: (value: number) => string,
    description: (value: number) => string,
  ) =>
  (text: string): Option<Key> | undefined => {
    const value = readNumber(text)
    if (!within(value, min, max)) return undefined
    return {
      label: label(value),
      value: value as FilterValue<Key>,
      description: `${theNumber(text)} ${description(value)}`,
    }
  }

/**
 * Every question, with the brackets cut from the cars on the list rather than
 * written out, so "cheap" keeps meaning the cheap end as prices move.
 */
export const buildIntentQuestions = (list: ReadonlyArray<Car> = cars) => {
  const bracket =
    (pick: (car: Car) => number, round: (value: number) => number) =>
    (share: number) =>
      round(quantile(list.map(pick), share))
  const price = bracket(
    (car) => car.priceWithGrant,
    (value) => ceilTo(value, 100_000),
  )
  const range = bracket(
    (car) => car.range,
    (value) => floorTo(value, 10),
  )
  const acceleration = bracket((car) => car.acceleration, ceilTenth)
  const fastcharge = bracket((car) => car.kmPerMinuteCharged, floorTenth)
  const value = bracket(
    (car) => car.pricePerKm,
    (value) => ceilTo(value, 100),
  )

  const questions: { [Key in FilterKey]?: IntentQuestion<Key> } = {
    price: {
      key: 'price',
      ordered: true,
      instructions:
        'Does the person in `request` want a cheap car, or set a limit on what a new electric car in Iceland may cost? In Icelandic, ódýr, ódýrt, ódýrasti, á góðu verði and ekki of dýr ask for a lower price, even alongside other wishes.',
      none: 'No limit on price: nothing is said about cost, or the person wants an expensive, premium or luxury car',
      options: [
        {
          label: 'not_the_priciest',
          value: price(0.75),
          description: `Not among the most expensive: up to about ${millions(price(0.75))} million ISK`,
        },
        {
          label: 'mid_priced',
          value: price(0.5),
          description: `Mid-priced or below: up to about ${millions(price(0.5))} million ISK`,
        },
        {
          label: 'cheap',
          value: price(0.25),
          description: `Cheap, affordable, on a budget: up to about ${millions(price(0.25))} million ISK`,
        },
      ],
      // A bare "8" or "6,5" is a budget in millions, as the parser reads
      // "undir 8"
      fromNumber: (text) => {
        const kronur = readNumber(text)
        const inMillions = Math.round(readNumber(text, true) * 1_000_000)
        const max = within(kronur, 1_000_000, 100_000_000)
          ? kronur
          : within(inMillions, 1_000_000, 60_000_000)
            ? inMillions
            : undefined
        if (max === undefined) return undefined
        return {
          label: `up_to_${max}_isk`,
          value: max,
          description: `${theNumber(text)} as the most the car may cost: up to ${millions(max)} million ISK`,
        }
      },
    },
    range: {
      key: 'range',
      ordered: true,
      instructions:
        'Does the person in `request` need more driving range than usual from an electric car in Iceland? In Icelandic, langdrægur, mikil drægni, kemst langt and langferðir ask for range.',
      none: 'No particular range: neither range nor long trips are mentioned, or the driving is short, such as commuting or in town',
      options: [
        {
          label: 'decent',
          value: range(0.25),
          description: `Enough for commuting and day trips out of town: at least ${range(0.25)} km WLTP`,
        },
        {
          label: 'long_trips',
          value: range(0.5),
          description: `Long trips around the country, such as Reykjavík to Akureyri: at least ${range(0.5)} km WLTP`,
        },
        {
          label: 'longest',
          value: range(0.75),
          description: `As much range as possible: at least ${range(0.75)} km WLTP`,
        },
      ],
      fromNumber: statedNumber(
        [50, 1500],
        (min) => `at_least_${min}_km`,
        (min) =>
          `as the distance the car must go on a charge: at least ${min} km WLTP`,
      ),
    },
    seats: {
      key: 'seats',
      // A pick, not a scale: with two brackets the cautious quantile would
      // want four chances in five before it offered seven
      ordered: false,
      instructions:
        'How many seats does the person in `request` need? Count everyone who rides along: the children and one or two adults.',
      none: 'The number of seats or passengers is not mentioned or implied',
      options: [
        {
          label: 'five',
          value: 5,
          description:
            'Five seats: up to five people, such as two adults and up to three children',
        },
        {
          label: 'seven',
          value: 7,
          description:
            'Seven or more seats: six people or more, such as four or more children, or a third row of seats',
        },
      ],
      // Nearly every car seats five, so a smaller number narrows nothing, and
      // it is mostly a count of the children, which the brackets add up
      fromNumber: (text) => {
        const seats = readNumber(text)
        if (!Number.isInteger(seats) || !within(seats, 6, 9)) return undefined
        return {
          label: `seats_${seats}`,
          value: seats,
          description: `${theNumber(text)} as everyone riding along, adults included: at least ${seats} seats`,
        }
      },
    },
    drive: {
      key: 'drive',
      ordered: false,
      instructions:
        'Which drive does the person in `request` need? In Icelandic, fjórhjóladrif, jeppi, snjór, hálka, ófærð, malarvegir, brekkur and hálendið point to all-wheel drive.',
      none: 'Drive is not mentioned, and nothing is said about winter, snow, gravel, the highlands or towing; long trips alone need no particular drive',
      options: [
        {
          label: 'all_wheel_drive',
          value: ['AWD'],
          description:
            'All-wheel drive: winter, snow, ice, gravel roads, the highlands, towing',
        },
        {
          label: 'rear_wheel_drive',
          value: ['RWD'],
          description: 'Rear-wheel drive',
        },
        {
          label: 'front_wheel_drive',
          value: ['FWD'],
          description: 'Front-wheel drive',
        },
      ],
    },
    acceleration: {
      key: 'acceleration',
      ordered: true,
      instructions:
        'Does the person in `request` want a car that accelerates quickly? Charging fast is charging speed, not acceleration. In Icelandic, snöggur, sprækur, kraftmikill, hraðskreiður, hraður and sportlegur describe a quick car.',
      none: 'Acceleration is not mentioned: nothing about a quick, powerful or sporty car. Fast charging or range is not acceleration',
      options: [
        {
          label: 'brisk',
          value: acceleration(0.5),
          description: `Quicker than average: 0-100 km/h in at most ${acceleration(0.5)} s`,
        },
        {
          label: 'fast',
          value: acceleration(0.25),
          description: `Fast and sporty: at most ${acceleration(0.25)} s`,
        },
        {
          label: 'fastest',
          value: acceleration(0.1),
          description: `Among the fastest, a sports car: at most ${acceleration(0.1)} s`,
        },
      ],
      fromNumber: statedNumber(
        [1.5, 20],
        (max) => `under_${slug(max)}_seconds`,
        (max) => `as acceleration: 0-100 km/h in at most ${max} s`,
      ),
    },
    fastcharge: {
      key: 'fastcharge',
      ordered: true,
      instructions:
        'Does the person in `request` want a car that charges quickly? A quick or fast car is acceleration, not charging speed. In Icelandic, hleður hratt, fljótur að hlaða, hraðhleðsla and stutt hleðslustopp ask for fast charging.',
      none: 'Charging is not mentioned: nothing about charging quickly or charging stops. A quick or powerful car is not charging speed',
      options: [
        {
          label: 'fast',
          value: fastcharge(0.5),
          description: `Charges faster than average: at least ${fastcharge(0.5)} km of range a minute on a fast charger`,
        },
        {
          label: 'fastest',
          value: fastcharge(0.75),
          description: `Among the fastest to charge: at least ${fastcharge(0.75)} km a minute`,
        },
      ],
      fromNumber: statedNumber(
        [1, 60],
        (min) => `${slug(min)}_km_a_minute`,
        (min) =>
          `as charging speed: at least ${min} km of range a minute on a fast charger`,
      ),
    },
    value: {
      key: 'value',
      ordered: true,
      instructions:
        'Does the person in `request` want the most range for the money?',
      none: 'Value for money is not mentioned: nothing about range for the price. A low price alone is not value for money',
      options: [
        {
          label: 'good_value',
          value: value(0.5),
          description: 'Good value: a below-average price per km of range',
        },
        {
          label: 'best_value',
          value: value(0.25),
          description:
            'The best value: among the lowest prices per km of range',
        },
      ],
      fromNumber: statedNumber(
        [1000, 200_000],
        (max) => `${max}_isk_a_km`,
        (max) => `as the price per km of range: at most ${max} ISK a km`,
      ),
    },
  }
  return questions
}

const intentQuestions = buildIntentQuestions()

type IntentQuestions = typeof intentQuestions

/**
 * The questions for one request, each offered the numbers the parser could
 * not place that could be its filter. So the model says which filter a bare
 * "600" belongs to, and the value is still the one the person typed.
 */
export const withNumbers = (
  numbers: ReadonlyArray<string>,
  questions: IntentQuestions = intentQuestions,
): IntentQuestions =>
  Object.fromEntries(
    Object.entries(questions).map(([key, question]) => {
      const { options, fromNumber } = question as IntentQuestion<FilterKey>
      // "five" is the "fimm" in "fimm milljónir" too, and has to give way to
      // the filter that number is about
      const claimed = options.map((option) => ({
        ...option,
        number: numbers.find((text) => readNumber(text) === option.value),
      }))
      const stated = numbers
        .flatMap((text) => {
          const option = fromNumber?.(text)
          return option ? [{ ...option, number: text }] : []
        })
        .filter(
          (option, index, all) =>
            all.findIndex(({ label }) => label === option.label) === index,
        )
      return [key, { ...question, options: claimed, stated }]
    }),
  )

type Questions = Record<string, ChoiceQuestion | NoulQuestion>

// Not a filter key, so it can sit beside them in one request
export const ADVISOR_KEY = 'asksAdvisor'

// Above this, the request is a question for the advisor rather than a wish.
// On cases.ts every question but two scored 0.8 or more and every wish but two
// under 0.5; those two, short wishes with no verb, came to 0.55–0.77, so it
// sits close above them.
export const ADVISOR_THRESHOLD = 0.8

const advisorQuestion: NoulQuestion = {
  type: 'noul',
  instructions:
    'Is `request` a question put to an advisor on electric cars, rather than a description of the car the person wants? In Icelandic, hvað, hvaða, hver, hvernig, hversu, er and get ég open a question.',
  criteria: {
    true: 'A question: it asks for facts, a comparison or a recommendation',
    false:
      'A wish: it says what the car should have or what the person needs, even in a few words',
  },
}

// Every question is answered on its own, so each is told what the words
// around a number mean, or a "7" that is a price is read as seats too
const statedInstructions =
  'Options that name a number are read off `request`. Take one only when the words around that number say it is about this: kosta, verð, dýr and milljónir are price; km, kemst, drægni and keyra are distance; sæti, manna, erum and börn are people; sek and í hundraðið are acceleration.'

const toChoice = (question: IntentQuestion<FilterKey>): ChoiceQuestion => {
  const stated = question.stated ?? []
  return {
    type: 'choice',
    instructions: stated.length
      ? `${question.instructions} ${statedInstructions}`
      : question.instructions,
    criteria: Object.fromEntries([
      ['none', question.none],
      ...[...question.options, ...stated].map((option) => [
        option.label,
        option.description,
      ]),
    ]),
  }
}

/**
 * One choice per filter the text has not set, each with "none" among its
 * options, so a single pass says both whether a filter applies and where, and
 * whether the request is a question for the advisor at all. The name filter
 * is never asked: a make is in the text or it is not.
 */
export const intentRequest = (
  text: string,
  skip: ReadonlyArray<FilterKey>,
  questions = intentQuestions,
): SystemOneRequest<Questions> => {
  const filters = Object.values(questions)
    .filter((question) => !skip.includes(question.key))
    .map((question) => [
      question.key,
      toChoice(question as IntentQuestion<FilterKey>),
    ])
  return {
    state: { request: text },
    questions: Object.fromEntries(
      filters.length ? [...filters, [ADVISOR_KEY, advisorQuestion]] : [],
    ),
  }
}

// The response is whatever came back over the wire, so it is read defensively
const readProbabilities = (
  answer: unknown,
  labels: string[],
): number[] | null => {
  if (!answer || typeof answer !== 'object') return null
  const probabilities = (answer as { probabilities?: unknown }).probabilities
  if (!probabilities || typeof probabilities !== 'object') return null
  const values = labels.map((label) => {
    const value = (probabilities as Record<string, unknown>)[label]
    return typeof value === 'number' && Number.isFinite(value) && value >= 0
      ? value
      : 0
  })
  const total = values.reduce((sum, value) => sum + value, 0)
  return total > 0 ? values.map((value) => value / total) : null
}

const readNoul = (answer: unknown): number | null => {
  if (!answer || typeof answer !== 'object') return null
  const noul = (answer as { noul?: unknown }).noul
  return typeof noul === 'number' && within(noul, 0, 1) ? noul : null
}

/**
 * The model's answers as suggestions. It can only ever pick one of the
 * options it was given, so the worst it can do is a wrong filter from our own
 * list or from the request's own numbers, never a value of its own.
 */
export const suggestionsFromAnswers = (
  answers: Record<string, unknown>,
  questions = intentQuestions,
): FilterSuggestion[] => {
  const picks = Object.values(questions).flatMap((question) => {
    const {
      key,
      options,
      ordered,
      stated = [],
    } = question as IntentQuestion<FilterKey>
    if (!Object.hasOwn(answers, key)) return []
    const all = [...options, ...stated]
    const probabilities = readProbabilities(answers[key], [
      'none',
      ...all.map((option) => option.label),
    ])
    if (!probabilities) return []

    const [none, ...rest] = probabilities
    const pick = (
      option: Option<FilterKey>,
      probability: number,
      share = probability,
    ) => [
      {
        suggestion: {
          key,
          value: option.value,
          source: 'model',
          probability,
        } as FilterSuggestion,
        number: option.number,
        share,
      },
    ]

    if (ordered) {
      const applies = 1 - none
      if (applies < APPLY_THRESHOLD) return []
      const brackets = rest.slice(0, options.length)
      const numbers = rest.slice(options.length)
      const onBrackets = brackets.reduce((sum, share) => sum + share, 0)
      // What the person typed is taken as it stands, rather than leaned loose
      // like a bracket: there is no reading of it to be too tight about
      const likeliest = numbers.indexOf(Math.max(...numbers))
      if (numbers.length && numbers[likeliest] >= onBrackets)
        return pick(stated[likeliest], applies, numbers[likeliest])
      const index = conservativeIndex(
        brackets.map((share) => share / onBrackets),
      )
      return pick(options[index], applies)
    }

    // "seven" and the 7 in the request are one answer, and count as one
    const byValue = all.map((option) =>
      all.reduce(
        (sum, other, index) =>
          other.value === option.value ? sum + rest[index] : sum,
        0,
      ),
    )
    const best = byValue.indexOf(Math.max(...byValue))
    if (byValue[best] < APPLY_THRESHOLD) return []
    const option =
      stated.find(({ value }) => value === all[best].value) ?? all[best]
    return pick(option, byValue[best])
  })

  // A question states no wish, so what the model reads into one is no filter;
  // a number the person typed in it still is
  const asksAdvisor = (readNoul(answers[ADVISOR_KEY]) ?? 0) >= ADVISOR_THRESHOLD

  // A number says one thing, so it goes to the filter surest it is about it
  return picks
    .filter(
      ({ number, share }) =>
        (number !== undefined || !asksAdvisor) &&
        (number === undefined ||
          !picks.some(
            (other) => other.number === number && other.share > share,
          )),
    )
    .map(({ suggestion }) => suggestion)
}

export type ModelStatus = 'answered' | 'not-needed' | 'unavailable' | 'failed'

export type AskModel = (
  request: SystemOneRequest<Questions>,
) => PromiseLike<{ answers: Record<string, unknown> }>

export interface SuggestionResult {
  suggestions: FilterSuggestion[]
  model: ModelStatus
}

/**
 * What the text says, and when words are left that the parser could not read,
 * what a model makes of them, for the filters the text did not set. Without a
 * model, or when it fails, the text alone still answers.
 */
export const suggestFilters = async (
  text: string,
  ask: AskModel | undefined,
): Promise<SuggestionResult> => {
  const parsed = parseFilterIntent(text)
  const fromText = suggestionsFromFilters(parsed.filters, 'text')
  if (!needsModel(parsed)) return { suggestions: fromText, model: 'not-needed' }

  const questions = withNumbers(parsed.numbers)
  const request = intentRequest(
    text,
    Object.keys(parsed.filters) as FilterKey[],
    questions,
  )
  if (Object.keys(request.questions).length === 0)
    return { suggestions: fromText, model: 'not-needed' }
  if (!ask) return { suggestions: fromText, model: 'unavailable' }

  try {
    const { answers } = await ask(request)
    const asked = Object.fromEntries(
      Object.keys(request.questions).map((key) => [key, answers[key]]),
    )
    return {
      suggestions: [...fromText, ...suggestionsFromAnswers(asked, questions)],
      model: 'answered',
    }
  } catch {
    return { suggestions: fromText, model: 'failed' }
  }
}
