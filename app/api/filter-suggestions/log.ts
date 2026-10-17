import { parseFilterIntent } from '@/modules/list/filterIntent'
import { ADVISOR_KEY } from './questions'
import type { SuggestionResult } from './model'
import type { Deployment } from '../publicEndpoint'

/** What is known about a request once its suggestions are answered */
export interface SuggestionsTurn extends Deployment {
  timestamp: string
  text: string
  /** The client's, so its outcome events can be joined to this one */
  id: string | undefined
  /**
   * The request before it that the client typed past unanswered, so never
   * shown. Told by the client, as Vercel does not pass on the abort.
   */
  supersedes: string | undefined
  result: SuggestionResult
  /** The model's answers, when it was asked and answered */
  answers: Record<string, unknown> | undefined
  inputTokens: number | undefined
  millis: number
  model: string
}

// Two decimals say all a threshold is tuned on, and the rest of a
// distribution is mostly zeros
const round = (share: number) => Math.round(share * 100) / 100

const sharesOf = (answer: unknown): Array<[string, unknown]> => {
  if (!answer || typeof answer !== 'object') return []
  if ('noul' in answer) return [['yes', answer.noul]]
  if (!('probabilities' in answer)) return []
  const { probabilities } = answer
  return probabilities && typeof probabilities === 'object'
    ? Object.entries(probabilities)
    : []
}

/**
 * Every answer as one row per option, in a list. Axiom makes a column of every
 * key in an object, and the options cut from a request's numbers would add
 * new ones without end, to a dataset the chat logs to as well.
 */
const answerRows = (answers: Record<string, unknown>) =>
  Object.entries(answers).flatMap(([question, answer]) =>
    sharesOf(answer).flatMap(([label, share]) =>
      typeof share === 'number' && round(share) > 0
        ? [{ question, label, share: round(share) }]
        : [],
    ),
  )

/**
 * The event a request is logged as: the text, what the parser read and left,
 * what the model answered to each question, and what was suggested. Enough to
 * turn a request that went wrong into a case in cases.ts.
 */
export const suggestionsLogEvent = (turn: SuggestionsTurn) => {
  const { filters, unread, numbers } = parseFilterIntent(turn.text)
  const advisor = sharesOf(turn.answers?.[ADVISOR_KEY])[0]?.[1]

  return {
    type: 'filter_suggestions',
    timestamp: turn.timestamp,
    text: turn.text,
    id: turn.id,
    supersedes: turn.supersedes,
    parsed: { filters, unread, numbers },
    modelStatus: turn.result.model,
    answers: turn.answers && answerRows(turn.answers),
    asksAdvisor: typeof advisor === 'number' ? round(advisor) : undefined,
    suggestions: turn.result.suggestions,
    millis: turn.millis,
    inputTokens: turn.inputTokens,
    model: turn.model,
    environment: turn.environment,
    commit: turn.commit,
  }
}
