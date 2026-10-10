import type { ChatFinish } from './chat'
import type { Deployment } from '../publicEndpoint'
import {
  getFollowUps,
  getMessageText,
  type ChatMessage,
} from '@/modules/chat/message'
import { CHAT_SUGGESTIONS } from '@/modules/chat/suggestions'

/** How an answer ended, if the route saw it end */
export type ChatOutcome = { finish: ChatFinish } | { error: unknown }

export type QuestionSource = 'typed' | 'starter' | 'followUp'

/** What is known about a turn before its answer starts */
export interface ChatTurn extends Deployment {
  timestamp: string
  conversationId: string | undefined
  userMessage: string
  source: QuestionSource
  messageCount: number
  model: string
}

/** Milliseconds from the request arriving */
export interface ChatTiming {
  firstTextMs: number | undefined
  durationMs: number
}

/**
 * Read off the text rather than told by the browser, so there is nothing to
 * trust: a pill sends its text as it is, and the follow-ups offered are on the
 * answer before the question. A question typed to match a pill counts as one.
 */
export const questionSource = (messages: ChatMessage[]): QuestionSource => {
  const question = getMessageText(messages.at(-1))
  if (getFollowUps(messages.at(-2)).includes(question)) return 'followUp'
  if (CHAT_SUGGESTIONS.includes(question)) return 'starter'
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
