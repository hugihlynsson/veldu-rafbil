import { safeValidateUIMessages, type UIMessage } from 'ai'
import { z } from 'zod'

import { splitMarkers } from './answerMarkers'

// The most cars an answer tags. The route sends no more than this, as a
// stored answer over any bound here would have the next request refused.
export const MAX_TAGGED_CARS = 10

// Bounded because it comes back from the browser with every request. Optional
// as a whole, as most messages carry none: a question, or an answer with no
// follow-ups and no cars.
const chatMetadataSchema = z
  .object({
    followUps: z
      .array(z.string().trim().min(1).max(300))
      .min(1)
      .max(10)
      .optional(),
    // Car ids, which the browser looks up rather than trusts
    cars: z
      .array(z.string().min(1).max(100))
      .min(1)
      .max(MAX_TAGGED_CARS)
      .optional(),
  })
  .optional()

export type ChatMessage = UIMessage<z.infer<typeof chatMetadataSchema>>

type Tools = NonNullable<
  Parameters<typeof safeValidateUIMessages<ChatMessage>>[0]['tools']
>

/** The messages, if every one of them is a chat message we could have sent */
export const validateChatMessages = async (
  messages: unknown,
  tools?: Tools,
): Promise<ChatMessage[] | null> => {
  const validated = await safeValidateUIMessages<ChatMessage>({
    messages,
    metadataSchema: chatMetadataSchema,
    tools,
  })
  return validated.success ? validated.data : null
}

/**
 * The text of a message. A message is a list of parts, only some of them text,
 * and everything here — the bubble, the mentioned cars, what is logged — wants
 * the same joined string out of it.
 */
export const getMessageText = (message: ChatMessage | undefined): string =>
  (message?.parts ?? [])
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim()

/** The questions the assistant offered to go on with */
export const getFollowUps = (message: ChatMessage | undefined): string[] =>
  message?.role === 'assistant' ? (message.metadata?.followUps ?? []) : []

/**
 * Answers stored before the follow-ups moved to metadata still carry them as
 * [q:…] markers in their text. Moved over on read, so nothing else has to
 * know that shape existed. No answer was ever stored with car markers in it.
 */
export const upgradeStoredMessage = (message: ChatMessage): ChatMessage => {
  if (message.role !== 'assistant' || message.metadata) return message

  const followUps: string[] = []
  const parts = message.parts.map((part) => {
    if (part.type !== 'text' || !part.text.includes('[q:')) return part
    const split = splitMarkers(part.text)
    followUps.push(...split.followUps)
    return { ...part, text: split.text }
  })

  return followUps.length
    ? { ...message, parts, metadata: { followUps } }
    : { ...message, parts }
}

/**
 * A history as localStorage holds it, or none. Anything that fails to
 * validate reads as empty: sent back with the next question, it would be
 * refused, and the chat with it.
 */
export const parseStoredMessages = async (
  stored: string,
): Promise<ChatMessage[]> => {
  let messages: unknown
  try {
    messages = JSON.parse(stored)
  } catch {
    return []
  }

  return (await validateChatMessages(messages))?.map(upgradeStoredMessage) ?? []
}

/**
 * The messages grouped by question: each turn starts at a user message and
 * runs up to the next. Anything before the first question is a turn of its
 * own.
 */
export const groupIntoTurns = (messages: ChatMessage[]): ChatMessage[][] =>
  messages.reduce<ChatMessage[][]>((turns, message) => {
    const current = turns.at(-1)
    if (message.role === 'user' || !current) turns.push([message])
    else current.push(message)
    return turns
  }, [])
