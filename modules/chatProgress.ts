import { APICallError, type ChatStatus } from 'ai'

import type { ChatMessage } from './chatMessage'

// What /api/chat answers a 429 with, and what the chat shows for one
export const rateLimitedText =
  'Aðeins of margar fyrirspurnir, reyndu aftur eftir augnablik'

/** An answer is on its way and none of its text has arrived to show */
export const isAwaitingText = (
  messages: ChatMessage[],
  status: ChatStatus,
): boolean => {
  if (status === 'submitted') return true
  if (status !== 'streaming') return false

  const last = messages.at(-1)
  return (
    last?.role !== 'assistant' ||
    !last.parts.some((part) => part.type === 'text')
  )
}

/**
 * Why the last question has no answer and none is coming, or null. A question
 * is stored as it is sent, so one whose answer never arrived — the request
 * failed, or the page closed first — is still the last message when the chat
 * is next opened, with the status back at ready rather than at error.
 */
export const unansweredReason = (
  messages: ChatMessage[],
  status: ChatStatus,
  error: Error | undefined,
): string | null => {
  if (status === 'error') {
    return APICallError.isInstance(error) && error.statusCode === 429
      ? rateLimitedText
      : 'Úps, eitthvað fór úrskeiðis'
  }

  if (status === 'ready' && messages.at(-1)?.role === 'user') {
    return 'Spurningunni var ekki svarað'
  }

  return null
}
