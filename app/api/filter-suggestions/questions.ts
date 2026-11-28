import type {
  ChoiceQuestion,
  NoulQuestion,
  SystemOneRequest,
} from '@typesafe-ai/sdk'

import type { FilterKey, FilterValue } from '@/modules/list/filters'
import cars, { type Car } from '@/modules/data/cars'
import {
  readGroundClearance,
  readNumber,
  readTowing,
  within,
} from '@/modules/list/filterIntent'

export interface Option<Key extends FilterKey> {
  label: string
  value: FilterValue<Key>
  description: string
  /** The number in the request the option was made from */
  number?: string
}

export interface IntentQuestion<Key extends FilterKey> {
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
  /** The share off "none" it takes, where APPLY_THRESHOLD is too low */
  threshold?: number
}

// "Fast" alongside other wishes is as often a hope as a limit, and a time
// ceiling quietly narrows the list well past what was asked. In November 2026
// "mjög hraður" came to 0.85–0.97, while "big car, 6 people, fast" came to
// 0.60–0.62 and a half-typed "hr" to 0.63–0.69. No question asks about
// charging, so "hleður hratt á ferðalögum" leans here, at 0.69. A bare number
// is held to it too, as "undir 6" is far more often a price than a time.
export const ACCELERATION_THRESHOLD = 0.8

// Nearest rank, so every bracket is a value a car in the list really has
const quantile = (values: number[], share: number): number => {
  const sorted = [...values].sort((a, b) => a - b)
  const value = sorted[Math.round(share * (sorted.length - 1))]
  if (value === undefined) throw new Error('A quantile of no values')
  return value
}

const millions = (kronur: number) => (kronur / 1_000_000).toFixed(1)

// Rounded the way that keeps the car the bracket was cut at
const ceilTo = (value: number, step: number) =>
  Math.ceil(Math.round((value / step) * 1000) / 1000) * step
const floorTo = (value: number, step: number) =>
  Math.floor(Math.round((value / step) * 1000) / 1000) * step
const ceilTenth = (value: number) => ceilTo(value * 10, 1) / 10

// A label is a key the model answers with, so it holds no dot
const slug = (value: number) => String(value).replace('.', '_')

// The request is folded by then, so a number spelled out is shown as a figure
// too: "atta" alone is a word the model has to place first
const theNumber = (text: string) =>
  `The ${/\d/.test(text) ? text : `"${text}" (${readNumber(text)})`} in \`request\``

// The parser's bounds for each unit, so a number is offered to a filter only
// where it would have read it with the unit written out
const statedNumber =
  <Key extends 'range' | 'acceleration'>(
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
      none: 'Drive is not mentioned, and nothing is said about winter, snow, gravel or the highlands; long trips alone need no particular drive, and nor does power, charging or towing',
      options: [
        {
          label: 'all_wheel_drive',
          value: ['AWD'],
          description:
            'All-wheel drive: winter, snow, ice, gravel roads, the highlands',
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
    // Trailer weights rather than brackets cut from the list: a caravan weighs
    // what it weighs, however much the cars on sale can pull
    towing: {
      key: 'towing',
      ordered: true,
      instructions:
        'Does the person in `request` need to tow something? In Icelandic, draga, dregur, dráttargeta, dráttarkrókur, krókur, kerra, hjólhýsi, fellihýsi, tjaldvagn, hestakerra and bátur ask for towing.',
      none: 'Towing is not mentioned: nothing about a trailer, a towbar, a caravan or a boat. A bike rack or a roof box is not towing',
      options: [
        {
          label: 'small_trailer',
          value: 750,
          description:
            'A small trailer, such as a utility trailer (kerra) or a tent trailer, or a towbar with nothing more said: at least 750 kg on a braked trailer',
        },
        {
          label: 'caravan',
          value: 1500,
          description:
            'A caravan (hjólhýsi), a folding camper (fellihýsi), a boat or a horse trailer: at least 1,500 kg on a braked trailer',
        },
        {
          label: 'heavy',
          value: 2000,
          description:
            'A large caravan, a heavy boat or a heavy load: at least 2,000 kg on a braked trailer',
        },
      ],
      // Read as the parser reads a towing number, so "1,5" is a tonne and a
      // half. A whole digit under ten is not offered as tonnes: by "3 börn og
      // hjólhýsi" it counts children, and 3,000 kg leaves a handful of cars.
      fromNumber: (text) => {
        const min =
          /[.,]/.test(text) || Number(text) >= 10 ? readTowing(text) : undefined
        if (min === undefined) return undefined
        return {
          label: `at_least_${min}_kg`,
          value: min,
          description: `${theNumber(text)} as the weight the car must tow: at least ${min} kg on a braked trailer`,
        }
      },
    },
    // Fixed heights rather than brackets cut from the list, like towing: a
    // ford is as deep as it is. Snow and gravel are left to all-wheel drive,
    // which most cars that sit low still have, so a winter car is not also
    // asked to be a high one.
    groundClearance: {
      key: 'groundClearance',
      ordered: true,
      instructions:
        'Does the person in `request` need a car that sits high off the road? In Icelandic, veghæð, hátt undir hann, hátt undir bílinn, hálendið, F-vegir, fjallvegir, slóðar, óbrúaðar ár and vöð ask for ground clearance.',
      none: 'Ground clearance is not mentioned: nothing about sitting high, the highlands, mountain tracks or fording rivers. Winter, snow, ice and gravel roads alone call for all-wheel drive, not a high car, and a jeppi named for its size, comfort or luxury is not one asked to sit high',
      options: [
        {
          label: 'raised',
          value: 160,
          description:
            'Higher than a regular car, for rough gravel roads, or a high car with nothing more said: at least 160 mm',
        },
        {
          label: 'high',
          value: 180,
          description:
            'Mountain roads and F-roads (fjallvegir) in summer: at least 180 mm',
        },
        {
          label: 'highest',
          value: 200,
          description:
            'The rougher highland tracks and fording rivers (óbrúaðar ár, vöð): at least 200 mm',
        },
      ],
      // Only a number as large as a clearance in mm: a bare "20" is far more
      // often something else, and the parser reads it beside "veghæð" itself
      fromNumber: (text) => {
        const min = readGroundClearance(text, 'mm')
        if (min === undefined) return undefined
        return {
          label: `at_least_${min}_mm`,
          value: min,
          description: `${theNumber(text)} as the ground clearance the car needs: at least ${min} mm`,
        }
      },
    },
    acceleration: {
      key: 'acceleration',
      ordered: true,
      threshold: ACCELERATION_THRESHOLD,
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
  }
  return questions
}

export const intentQuestions = buildIntentQuestions()

export type IntentQuestions = typeof intentQuestions

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

export type Questions = Record<string, ChoiceQuestion | NoulQuestion>

// Not a filter key, so it can sit beside them in one request
export const ADVISOR_KEY = 'asksAdvisor'

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
  'Options that name a number are read off `request`. Take one only when the words around that number say it is about this: kosta, verð, dýr and milljónir are price; km, kemst, drægni and keyra are distance; sæti, manna, erum and börn are people; draga, kerra, hjólhýsi, kg and tonn are towing; veghæð, mm and cm are ground clearance; sek and í hundraðið are acceleration.'

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
