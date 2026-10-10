import { safeValidateUIMessages, type UIMessage } from 'ai'
import { z } from 'zod'

import { splitMarkers } from './answerMarkers'
import { MAX_COMPARED } from '@/modules/compare/comparison'

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
    // On a question asked on a comparison page: the slugs of the cars it
    // compares, which the route looks up rather than trusts
    comparing: z
      .array(z.string().min(1).max(100))
      .min(1)
      .max(MAX_COMPARED)
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

const sameCars = (a: string[] | undefined, b: string[] | undefined) =>
  (a ?? []).join('/') === (b ?? []).join('/')

/**
 * The questions that bring a comparison into the conversation, by id, with
 * the cars they compare: the first asked on a comparison page, and the first
 * after the cars change. Asked again on the same cars, it is the same one.
 */
export const comparisonsStarted = (
  messages: ChatMessage[],
): Map<string, string[]> => {
  const started = new Map<string, string[]>()
  let before: string[] | undefined

  for (const message of messages) {
    if (message.role !== 'user') continue
    const comparing = message.metadata?.comparing
    if (comparing && !sameCars(comparing, before)) {
      started.set(message.id, comparing)
    }
    before = comparing
  }

  return started
}

/**
 * Whether a question asked now, on a page comparing these cars, brings in a
 * comparison the conversation is not already on: the marker for it shows
 * before it is asked, so the reader knows the advisor can see it
 */
export const isNewComparison = (
  messages: ChatMessage[],
  comparing: string[] | undefined,
): boolean =>
  comparing !== undefined &&
  !sameCars(
    messages.findLast(({ role }) => role === 'user')?.metadata?.comparing,
    comparing,
  )

/**
 * Whether the conversation's last question was asked somewhere else than
 * here: on the list, on another comparison, or on none when this is one. Its
 * follow-ups are about there, and read wrong here.
 */
export const askedElsewhere = (
  messages: ChatMessage[],
  comparing: string[] | undefined,
): boolean => {
  const last = messages.findLast(({ role }) => role === 'user')
  return last !== undefined && !sameCars(last.metadata?.comparing, comparing)
}

/** The same cars, in whatever order */
export const sameCarSet = (
  a: ReadonlyArray<string>,
  b: ReadonlyArray<string>,
) => a.toSorted().join('/') === b.toSorted().join('/')
