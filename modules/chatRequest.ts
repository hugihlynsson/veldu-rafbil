import { z } from 'zod'

import { MAX_QUESTION_LENGTH, type ChatMessage } from './chatMessage'

// The input sends a question as one text part, and nothing else in one is ours
// to pay for: a file part would reach the model as an upload
const questionSchema = z
  .object({
    role: z.literal('user'),
    parts: z
      .array(
        z
          .object({
            type: z.literal('text'),
            text: z.string().max(MAX_QUESTION_LENGTH),
          })
          .loose(),
      )
      .length(1),
  })
  .loose()

const answerSchema = z
  .object({
    role: z.literal('assistant'),
    parts: z.array(z.object({ type: z.string() }).loose()).max(50),
  })
  .loose()

/**
 * One message as /api/chat will take it. Only its size is bounded here; its
 * shape is validateUIMessages' to check. No `system`: the instructions are
 * ours, and a client sending its own is refused rather than failing inside
 * streamText.
 */
export const boundedMessageSchema = z.discriminatedUnion('role', [
  questionSchema,
  answerSchema,
])

export const MAX_MESSAGES = 100

// Characters of JSON, roughly 30k tokens, where the body limit alone would let
// a forged history bill close to a million
const HISTORY_BUDGET = 100_000

/**
 * The newest messages that fit, oldest dropped first: within the budget and
 * the count, and none that /api/chat would refuse. The browser cuts a
 * conversation with this before sending it, since the one it stores grows
 * without end, and the route cuts again before the model sees it. A long
 * conversation goes on with the model having forgotten its start rather than
 * being refused whole. The last message, the question, is always kept.
 */
export const trimHistory = (messages: ChatMessage[]): ChatMessage[] => {
  let start = messages.length - 1
  let size = JSON.stringify(messages[start]).length

  while (start > 0 && messages.length - start < MAX_MESSAGES) {
    const previous = messages[start - 1]
    size += JSON.stringify(previous).length
    if (size > HISTORY_BUDGET) break
    if (!boundedMessageSchema.safeParse(previous).success) break
    start -= 1
  }

  // Dropping from the front can leave an answer to a question no longer there
  while (start < messages.length - 1 && messages[start].role !== 'user') {
    start += 1
  }

  return messages.slice(start)
}
