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

/** The language the questions are put in; the request is Icelandic either way */
export type Language = 'en' | 'is'
type Text = Record<Language, string>

interface Option<Key extends FilterKey> {
  label: string
  value: Value<Key>
  description: Text
}

interface IntentQuestion<Key extends FilterKey> {
  key: Key
  /**
   * Ordered options run from the loosest filter to the tightest, and the
   * answer is read as a distribution over them. Unordered ones are a pick.
   */
  ordered: boolean
  instructions: Text
  none: Text
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

const millions = (kronur: number, language: Language) => {
  const figure = (kronur / 1_000_000).toFixed(1)
  return language === 'is' ? figure.replace('.', ',') : figure
}

const tenths = (value: number, language: Language) =>
  language === 'is' ? String(value).replace('.', ',') : String(value)

// Rounded the way that keeps the car the bracket was cut at
const ceilTo = (value: number, step: number) =>
  Math.ceil(Math.round((value / step) * 1000) / 1000) * step
const floorTo = (value: number, step: number) =>
  Math.floor(Math.round((value / step) * 1000) / 1000) * step
const ceilTenth = (value: number) => ceilTo(value * 10, 1) / 10
const floorTenth = (value: number) => floorTo(value * 10, 1) / 10

const both = (describe: (language: Language) => string): Text => ({
  en: describe('en'),
  is: describe('is'),
})

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
      instructions: {
        en: 'How much is the person in `request` willing to pay for a new electric car in Iceland?',
        is: 'Hversu miklu er sá sem skrifar `request` til í að eyða í nýjan rafbíl á Íslandi?',
      },
      none: {
        en: 'No budget or price wish is stated or implied',
        is: 'Ekkert kemur fram um verð eða fjárhag',
      },
      options: [
        {
          label: 'not_the_priciest',
          value: price(0.75),
          description: both((language) =>
            language === 'en'
              ? `Not among the most expensive: up to about ${millions(price(0.75), language)} million ISK`
              : `Ekki með þeim dýrustu: allt að um ${millions(price(0.75), language)} milljónum króna`,
          ),
        },
        {
          label: 'mid_priced',
          value: price(0.5),
          description: both((language) =>
            language === 'en'
              ? `Mid-priced or below: up to about ${millions(price(0.5), language)} million ISK`
              : `Í meðallagi eða ódýrari: allt að um ${millions(price(0.5), language)} milljónum króna`,
          ),
        },
        {
          label: 'cheap',
          value: price(0.25),
          description: both((language) =>
            language === 'en'
              ? `Cheap, affordable, on a budget: up to about ${millions(price(0.25), language)} million ISK`
              : `Ódýr, á viðráðanlegu verði: allt að um ${millions(price(0.25), language)} milljónum króna`,
          ),
        },
      ],
    },
    range: {
      key: 'range',
      ordered: true,
      instructions: {
        en: 'How much driving range does the person in `request` need from an electric car in Iceland?',
        is: 'Hversu mikla drægni þarf sá sem skrifar `request` á rafbíl á Íslandi?',
      },
      none: {
        en: 'Range or trips are not mentioned or implied',
        is: 'Ekkert kemur fram um drægni eða ferðalög',
      },
      options: [
        {
          label: 'decent',
          value: range(0.25),
          description: both((language) =>
            language === 'en'
              ? `Enough for commuting and day trips out of town: at least ${range(0.25)} km WLTP`
              : `Dugar í vinnuna og dagsferðir út úr bænum: minnst ${range(0.25)} km WLTP`,
          ),
        },
        {
          label: 'long_trips',
          value: range(0.5),
          description: both((language) =>
            language === 'en'
              ? `Long trips around the country, such as Reykjavík to Akureyri: at least ${range(0.5)} km WLTP`
              : `Langferðir um landið, til dæmis frá Reykjavík til Akureyrar: minnst ${range(0.5)} km WLTP`,
          ),
        },
        {
          label: 'longest',
          value: range(0.75),
          description: both((language) =>
            language === 'en'
              ? `As much range as possible: at least ${range(0.75)} km WLTP`
              : `Sem allra mesta drægni: minnst ${range(0.75)} km WLTP`,
          ),
        },
      ],
    },
    seats: {
      key: 'seats',
      ordered: true,
      instructions: {
        en: 'How many seats does the person in `request` need?',
        is: 'Hversu mörg sæti þarf sá sem skrifar `request`?',
      },
      none: {
        en: 'The number of seats or passengers is not mentioned or implied',
        is: 'Ekkert kemur fram um fjölda sæta eða farþega',
      },
      options: [
        {
          label: 'five',
          value: 5,
          description: {
            en: 'Five seats: room for a family of four or five',
            is: 'Fimm sæti: pláss fyrir fjögurra eða fimm manna fjölskyldu',
          },
        },
        {
          label: 'seven',
          value: 7,
          description: {
            en: 'Seven or more seats: a large family, a third row of seats',
            is: 'Sjö sæti eða fleiri: stór fjölskylda, þriðja sætaröðin',
          },
        },
      ],
    },
    drive: {
      key: 'drive',
      ordered: false,
      instructions: {
        en: 'Which drive does the person in `request` need?',
        is: 'Hvaða drif þarf sá sem skrifar `request`?',
      },
      none: {
        en: 'Drive is not mentioned or implied',
        is: 'Ekkert kemur fram um drif',
      },
      options: [
        {
          label: 'all_wheel_drive',
          value: ['AWD'],
          description: {
            en: 'All-wheel drive: winter, snow, ice, gravel roads, the highlands, towing',
            is: 'Fjórhjóladrif: vetur, snjór, hálka, malarvegir, hálendið, dráttur',
          },
        },
        {
          label: 'rear_wheel_drive',
          value: ['RWD'],
          description: {
            en: 'Rear-wheel drive',
            is: 'Afturhjóladrif',
          },
        },
        {
          label: 'front_wheel_drive',
          value: ['FWD'],
          description: {
            en: 'Front-wheel drive',
            is: 'Framhjóladrif',
          },
        },
      ],
    },
    availability: {
      key: 'availability',
      ordered: false,
      instructions: {
        en: 'When does the person in `request` want the car?',
        is: 'Hvenær vill sá sem skrifar `request` fá bílinn?',
      },
      none: {
        en: 'Timing is not mentioned or implied',
        is: 'Ekkert kemur fram um hvenær',
      },
      options: [
        {
          label: 'available_now',
          value: 'available',
          description: {
            en: 'Available now: in stock, needed soon',
            is: 'Fáanlegur núna: til á lager, vantar fljótlega',
          },
        },
        {
          label: 'upcoming',
          value: 'expected',
          description: {
            en: 'Upcoming models that are not yet delivered',
            is: 'Væntanlegir bílar sem eru ekki enn komnir',
          },
        },
      ],
    },
    acceleration: {
      key: 'acceleration',
      ordered: true,
      instructions: {
        en: 'How quick does the person in `request` want the car to be?',
        is: 'Hversu snöggan bíl vill sá sem skrifar `request`?',
      },
      none: {
        en: 'Speed or acceleration is not mentioned or implied',
        is: 'Ekkert kemur fram um hraða eða hröðun',
      },
      options: [
        {
          label: 'brisk',
          value: acceleration(0.5),
          description: both((language) =>
            language === 'en'
              ? `Quicker than average: 0-100 km/h in at most ${tenths(acceleration(0.5), language)} s`
              : `Snarpari en gengur og gerist: 0-100 km/klst á mest ${tenths(acceleration(0.5), language)} sek`,
          ),
        },
        {
          label: 'fast',
          value: acceleration(0.25),
          description: both((language) =>
            language === 'en'
              ? `Fast and sporty: at most ${tenths(acceleration(0.25), language)} s`
              : `Hraður og sportlegur: mest ${tenths(acceleration(0.25), language)} sek`,
          ),
        },
        {
          label: 'fastest',
          value: acceleration(0.1),
          description: both((language) =>
            language === 'en'
              ? `Among the fastest, a sports car: at most ${tenths(acceleration(0.1), language)} s`
              : `Með þeim hröðustu, sportbíll: mest ${tenths(acceleration(0.1), language)} sek`,
          ),
        },
      ],
    },
    fastcharge: {
      key: 'fastcharge',
      ordered: true,
      instructions: {
        en: 'How fast does the person in `request` want the car to charge?',
        is: 'Hversu hratt vill sá sem skrifar `request` að bíllinn hlaði?',
      },
      none: {
        en: 'Charging speed is not mentioned or implied',
        is: 'Ekkert kemur fram um hleðsluhraða',
      },
      options: [
        {
          label: 'fast',
          value: fastcharge(0.5),
          description: both((language) =>
            language === 'en'
              ? `Charges faster than average: at least ${tenths(fastcharge(0.5), language)} km of range a minute on a fast charger`
              : `Hleður hraðar en gengur og gerist: minnst ${tenths(fastcharge(0.5), language)} km drægni á mínútu í hraðhleðslu`,
          ),
        },
        {
          label: 'fastest',
          value: fastcharge(0.75),
          description: both((language) =>
            language === 'en'
              ? `Among the fastest to charge: at least ${tenths(fastcharge(0.75), language)} km a minute`
              : `Með þeim sem hlaða hraðast: minnst ${tenths(fastcharge(0.75), language)} km á mínútu`,
          ),
        },
      ],
    },
    value: {
      key: 'value',
      ordered: true,
      instructions: {
        en: 'Does the person in `request` want the most range for the money?',
        is: 'Vill sá sem skrifar `request` sem mesta drægni fyrir peninginn?',
      },
      none: {
        en: 'Value for money is not mentioned or implied',
        is: 'Ekkert kemur fram um hagkvæmni',
      },
      options: [
        {
          label: 'good_value',
          value: value(0.5),
          description: {
            en: 'Good value: a below-average price per km of range',
            is: 'Hagkvæmur: verð á hvern km drægni undir meðallagi',
          },
        },
        {
          label: 'best_value',
          value: value(0.25),
          description: {
            en: 'The best value: among the lowest prices per km of range',
            is: 'Hagkvæmastur: með lægsta verð á hvern km drægni',
          },
        },
      ],
    },
  }
  return questions
}

const intentQuestions = buildIntentQuestions()

type Questions = Record<string, ChoiceQuestion>

const toChoice = (
  question: IntentQuestion<FilterKey>,
  language: Language,
): ChoiceQuestion => ({
  type: 'choice',
  instructions: question.instructions[language],
  criteria: Object.fromEntries([
    ['none', question.none[language]],
    ...question.options.map((option) => [
      option.label,
      option.description[language],
    ]),
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
  language: Language = 'en',
  questions = intentQuestions,
): SystemOneRequest<Questions> => ({
  state: { request: text },
  questions: Object.fromEntries(
    Object.values(questions)
      .filter((question) => !skip.includes(question.key))
      .map((question) => [
        question.key,
        toChoice(question as IntentQuestion<FilterKey>, language),
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
  language: Language = 'en',
): Promise<SuggestionResult> => {
  const parsed = parseFilterIntent(text)
  const fromText = suggestionsFromFilters(parsed.filters, 'text')
  if (!needsModel(parsed)) return { suggestions: fromText, model: 'not-needed' }

  const request = intentRequest(
    text,
    Object.keys(parsed.filters) as FilterKey[],
    language,
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
