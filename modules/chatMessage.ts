import { safeValidateUIMessages, type UIMessage } from 'ai'
import { z } from 'zod'

import { splitFollowUps } from './followUps'

// Bounded because it comes back from the browser with every request. Optional
// as a whole, as most messages carry none: a question, or an answer with no
// follow-ups.
const chatMetadataSchema = z
  .object({
    followUps: z.array(z.string().trim().min(1).max(300)).min(1).max(10),
  })
  .optional()

export type ChatMessage = UIMessage<z.infer<typeof chatMetadataSchema>>

// The input stops typing here and the route refuses past it, so a question is
// never the thing that makes a request expensive
export const MAX_QUESTION_LENGTH = 2_000

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
 * know that shape existed.
 */
export const upgradeStoredMessage = (message: ChatMessage): ChatMessage => {
  if (message.role !== 'assistant' || message.metadata) return message

  const followUps: string[] = []
  const parts = message.parts.map((part) => {
    if (part.type !== 'text' || !part.text.includes('[q:')) return part
    const split = splitFollowUps(part.text)
    followUps.push(...split.questions)
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
