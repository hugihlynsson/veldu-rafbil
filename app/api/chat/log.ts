import type { ChatFinish } from './chat'
import type { Deployment } from '../publicEndpoint'
import {
  getFollowUps,
  getMessageText,
  type ChatMessage,
} from '@/modules/chat/message'
import {
  CHAT_SUGGESTIONS,
  comparisonSuggestions,
} from '@/modules/chat/suggestions'
import carReviews, { type CarReview } from '@/modules/data/carReviews'
import { resolveSlugs } from '@/modules/detail/slugs'

/** How an answer ended, if the route saw it end */
export type ChatOutcome = { finish: ChatFinish } | { error: unknown }

export type QuestionSource = 'typed' | 'starter' | 'followUp'

/** What is known about a turn before its answer starts */
export interface ChatTurn extends Deployment {
  timestamp: string
  conversationId: string | undefined
  userMessage: string
  source: QuestionSource
  /** The slug of the car whose page it was asked on */
  carPage: string | undefined
  messageCount: number
  model: string
}

/** Milliseconds from the request arriving */
export interface ChatTiming {
  firstTextMs: number | undefined
  durationMs: number
}

// Looked up as the page's own URL is, so only real slugs are logged
const pageSlugs = (messages: ChatMessage[]): string[] => {
  const about = messages.at(-1)?.metadata?.about
  return about ? resolveSlugs(about).slugs : []
}

/** The car whose own page it was asked on; nothing on a comparison */
export const carPage = (messages: ChatMessage[]): string | undefined => {
  const slugs = pageSlugs(messages)
  return slugs.length === 1 ? slugs[0] : undefined
}

/**
 * Read off the text rather than told by the browser, so there is nothing to
 * trust: a pill sends its text as it is, the follow-ups offered are on the
 * answer before the question, and a car page's starters are in its review.
 * A question typed to match a pill counts as one.
 */
export const questionSource = (
  messages: ChatMessage[],
  reviews: Readonly<Record<string, CarReview>> = carReviews,
): QuestionSource => {
  const question = getMessageText(messages.at(-1))
  if (getFollowUps(messages.at(-2)).includes(question)) return 'followUp'
  const slugs = pageSlugs(messages)
  const [page] = slugs
  const starters =
    slugs.length > 1
      ? comparisonSuggestions(slugs.length)
      : page
        ? reviews[page]?.questions
        : CHAT_SUGGESTIONS
  if (starters?.includes(question)) return 'starter'
  return 'typed'
}

// A provider's error can carry a whole response body
const MAX_ERROR_LENGTH = 1_000

const errorText = (error: unknown) =>
  (error instanceof Error ? error.message : String(error)).slice(
    0,
    MAX_ERROR_LENGTH,
  )

/**
 * The event a turn is logged as, whichever way it ended. With no outcome the
 * response closed before the answer did, which is the visitor leaving: the
 * SDK drops an answer nobody is reading, so it neither finishes nor errors.
 */
export const chatLogEvent = (
  turn: ChatTurn,
  outcome: ChatOutcome | undefined,
  timing: ChatTiming,
) => {
  if (!outcome) {
    return {
      type: 'chat_response_unfinished',
      reason: 'disconnected',
      ...turn,
      ...timing,
    }
  }

  if ('error' in outcome) {
    return {
      type: 'chat_response_unfinished',
      reason: 'error',
      error: errorText(outcome.error),
      ...turn,
      ...timing,
    }
  }

  const { finish } = outcome
  return {
    type: 'chat_response_finished',
    ...turn,
    ...timing,
    assistantResponse: finish.text,
    followUps: finish.followUps,
    cars: finish.cars,
    tokenUsage: finish.usage,
    toolCalls: finish.toolCalls,
  }
}
