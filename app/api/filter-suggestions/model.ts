import type { SystemOneRequest } from '@typesafe-ai/sdk'

import type { FilterKey } from '@/modules/list/filters'
import {
  needsModel,
  parseFilterIntent,
  within,
} from '@/modules/list/filterIntent'
import {
  suggestionsFromFilters,
  type FilterSuggestion,
} from '@/modules/list/filterSuggestions'
import {
  ADVISOR_KEY,
  intentQuestions,
  intentRequest,
  withNumbers,
  type IntentQuestion,
  type Option,
  type Questions,
} from './questions'

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

// Above this, the request is a question for the advisor rather than a wish.
// On cases.ts every question but two scored 0.8 or more and every wish but two
// under 0.5; those two, short wishes with no verb, came to 0.55–0.77, so it
// sits close above them.
export const ADVISOR_THRESHOLD = 0.8

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
