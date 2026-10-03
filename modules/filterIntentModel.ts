import type { ChoiceQuestion, SystemOneRequest } from '@typesafe-ai/sdk'

import { Filters } from '@/types'
import cars, { Car } from './cars'
import {
  FilterSuggestion,
  needsModel,
  parseFilterIntent,
  suggestionsFromFilters,
} from './filterIntent'

type FilterKey = keyof Filters
type Value<Key extends FilterKey> = NonNullable<Filters[Key]>

interface Option<Key extends FilterKey> {
  label: string
  value: Value<Key>
  description: string
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

/**
 * Every question, with the brackets cut from the cars on the list rather than
 * written out, so "cheap" keeps meaning the cheap end as prices move.
 */
export const buildIntentQuestions = (list: ReadonlyArray<Car> = cars) => {
  const of = (pick: (car: Car) => number) => list.map(pick)
  const price = (share: number) =>
    ceilTo(
      quantile(
        of((car) => car.priceWithGrant),
        share,
      ),
      100_000,
    )
  const range = (share: number) =>
    floorTo(
      quantile(
        of((car) => car.range),
        share,
      ),
      10,
    )
  const acceleration = (share: number) =>
    ceilTenth(
      quantile(
        of((car) => car.acceleration),
        share,
      ),
    )
  const fastcharge = (share: number) =>
    floorTenth(
      quantile(
        of((car) => car.kmPerMinuteCharged),
        share,
      ),
    )
  const value = (share: number) =>
    ceilTo(
      quantile(
        of((car) => car.pricePerKm),
        share,
      ),
      100,
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
    availability: {
      key: 'availability',
      ordered: false,
      instructions:
        'Does the person in `request` say when they want to get the car? In Icelandic, strax, á lager and fljótlega mean now; væntanlegur and á leiðinni mean upcoming.',
      none: 'Nothing is said about when to get the car. A quick car or fast charging describes the car, not when it is wanted, and a season or a trip is not a delivery date',
      options: [
        {
          label: 'available_now',
          value: 'available',
          description: 'Available now: in stock, needed soon',
        },
        {
          label: 'upcoming',
          value: 'expected',
          description: 'Upcoming models that are not yet delivered',
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
    },
  }
  return questions
}

const intentQuestions = buildIntentQuestions()

type Questions = Record<string, ChoiceQuestion>

const toChoice = (question: IntentQuestion<FilterKey>): ChoiceQuestion => ({
  type: 'choice',
  instructions: question.instructions,
  criteria: Object.fromEntries([
    ['none', question.none],
    ...question.options.map((option) => [option.label, option.description]),
  ]),
})

/**
 * One choice per filter the text has not set, each with "none" among its
 * options, so a single pass says both whether a filter applies and where. The
 * name filter is never asked: a make is in the text or it is not.
 */
export const intentRequest = (
  text: string,
  skip: ReadonlyArray<FilterKey>,
  questions = intentQuestions,
): SystemOneRequest<Questions> => ({
  state: { request: text },
  questions: Object.fromEntries(
    Object.values(questions)
      .filter((question) => !skip.includes(question.key))
      .map((question) => [
        question.key,
        toChoice(question as IntentQuestion<FilterKey>),
      ]),
  ),
})

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

/**
 * The model's answers as suggestions. It can only ever pick one of the
 * options it was given, so the worst it can do is a wrong filter from our own
 * list, never a value of its own.
 */
export const suggestionsFromAnswers = (
  answers: Record<string, unknown>,
  questions = intentQuestions,
): FilterSuggestion[] =>
  Object.values(questions).flatMap((question) => {
    const { key, options, ordered } = question as IntentQuestion<FilterKey>
    if (!Object.hasOwn(answers, key)) return []
    const probabilities = readProbabilities(answers[key], [
      'none',
      ...options.map((option) => option.label),
    ])
    if (!probabilities) return []

    const [none, ...rest] = probabilities
    const suggest = (option: Option<FilterKey>, probability: number) =>
      [
        { key, value: option.value, source: 'model', probability },
      ] as FilterSuggestion[]

    if (ordered) {
      const applies = 1 - none
      if (applies < APPLY_THRESHOLD) return []
      const index = conservativeIndex(rest.map((share) => share / applies))
      return suggest(options[index], applies)
    }

    const best = rest.indexOf(Math.max(...rest))
    return rest[best] >= APPLY_THRESHOLD
      ? suggest(options[best], rest[best])
      : []
  })

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

  const request = intentRequest(
    text,
    Object.keys(parsed.filters) as FilterKey[],
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
      suggestions: [...fromText, ...suggestionsFromAnswers(asked)],
      model: 'answered',
    }
  } catch {
    return { suggestions: fromText, model: 'failed' }
  }
}
