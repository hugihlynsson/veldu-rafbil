import { safeValidateUIMessages, type UIMessage } from 'ai'
import { z } from 'zod'

import cars, { Car } from './cars'
import { splitFollowUps } from './followUps'

const chatMetadata = z.object({
  followUps: z.array(z.string().trim().min(1).max(300)).max(10).optional(),
})

export type ChatMetadata = z.infer<typeof chatMetadata>

// Bounded because it comes back from the browser with every request. Optional
// as a whole: validateUIMessages checks messages without any metadata too.
export const chatMetadataSchema = chatMetadata.optional()

export type ChatMessage = UIMessage<ChatMetadata>

/** The questions the assistant offered to go on with, sent as metadata */
export const getFollowUps = (message: ChatMessage | undefined): string[] =>
  message?.role === 'assistant' ? (message.metadata?.followUps ?? []) : []

/**
 * Answers stored before the follow-ups moved to metadata still carry them as
 * [q:…] markers in their text. Moved over on read, so nothing else has to
 * know that shape existed.
 */
export const upgradeStoredMessage = (message: ChatMessage): ChatMessage => {
  if (message.role !== 'assistant' || message.metadata?.followUps) {
    return message
  }

  const followUps: string[] = []
  const parts = message.parts.map((part) => {
    if (part.type !== 'text' || !part.text.includes('[q:')) return part
    const split = splitFollowUps(part.text)
    followUps.push(...split.questions)
    return { ...part, text: split.text }
  })

  return followUps.length
    ? { ...message, parts, metadata: { ...message.metadata, followUps } }
    : { ...message, parts }
}

/**
 * The text of a message. A message is a list of parts, only some of them text,
 * and everything here — the bubble, the mentioned cars, the follow-ups, what
 * is logged — wants the same joined string out of it.
 */
export const getMessageText = (message: UIMessage | undefined): string =>
  (message?.parts ?? [])
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim()

// Lowercased once: an answer is searched for every car in the list every time
// the row under it renders
const carNames = cars.map((car) => `${car.make} ${car.model}`.toLowerCase())

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

  const validated = await safeValidateUIMessages<ChatMessage>({
    messages,
    metadataSchema: chatMetadataSchema,
  })
  return validated.success ? validated.data.map(upgradeStoredMessage) : []
}

/** In list order, for the row of MiniCars under an answer */
export const findMentionedCars = (text: string): Car[] => {
  const lowerText = text.toLowerCase()
  // A subModel only ever extends the name, so make and model answer for both
  return cars.filter((_car, index) => lowerText.includes(carNames[index]))
}

// Fisher-Yates — sort() with a random comparator is not a shuffle
export const getRandomSuggestions = (
  suggestions: string[],
  count: number = 3,
): string[] => {
  const shuffled = [...suggestions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}
