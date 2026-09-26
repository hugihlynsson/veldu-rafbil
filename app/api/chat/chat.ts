import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type LanguageModel,
  type LanguageModelUsage,
} from 'ai'
import { z } from 'zod'

import systemPrompt from '@/modules/chatPrompt'
import {
  MAX_QUESTION_LENGTH,
  validateChatMessages,
  type ChatMessage,
} from '@/modules/chatMessage'
import { followUpTransform } from '@/modules/followUps'
import { fetchCarDetailsTool } from './tools/fetchCarDetails'

const tools = { fetchCarDetails: fetchCarDetailsTool }

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

// Only bounds the body, so an oversized post is a 400 rather than a bill; the
// shape of each message is validateUIMessages' to check. No `system`: the
// instructions are ours, and a client sending its own is refused here rather
// than failing inside streamText. Ending on a question keeps the one message
// trimHistory never drops a small one.
const requestSchema = z.object({
  messages: z
    .array(z.discriminatedUnion('role', [questionSchema, answerSchema]))
    .min(1)
    .max(100)
    .refine((messages) => messages.at(-1)?.role === 'user'),
})

/** The conversation a request carries, or null if it is not one we answer */
export const parseChatRequest = async (
  body: unknown,
): Promise<ChatMessage[] | null> => {
  const bounded = requestSchema.safeParse(body)
  if (!bounded.success) return null

  return validateChatMessages(bounded.data.messages, tools)
}

// Characters of JSON, roughly 30k tokens, where the body limit alone would let
// a forged history bill close to a million
const HISTORY_BUDGET = 100_000

/**
 * The newest messages that fit the budget, oldest dropped first. Trimmed
 * rather than refused, so a long conversation goes on with the model having
 * forgotten its start. The last message, the question, is always kept.
 */
export const trimHistory = (messages: ChatMessage[]): ChatMessage[] => {
  let start = messages.length - 1
  let size = JSON.stringify(messages[start]).length

  while (start > 0) {
    size += JSON.stringify(messages[start - 1]).length
    if (size > HISTORY_BUDGET) break
    start -= 1
  }

  // Dropping from the front can leave an answer to a question no longer there
  while (start < messages.length - 1 && messages[start].role !== 'user') {
    start += 1
  }

  return messages.slice(start)
}

/** What a finished answer came to, for the log */
export interface ChatFinish {
  text: string
  followUps: string[]
  usage: LanguageModelUsage
  toolCalls: Array<{ toolName: string; input: unknown }>
}

interface StreamChatOptions {
  model: LanguageModel
  messages: ChatMessage[]
  providerOptions?: Parameters<typeof streamText>[0]['providerOptions']
  onFinish?: (finish: ChatFinish) => void
}

/**
 * The answer as a UI message stream. The follow-up markers the prompt asks for
 * are taken out of the text on the way and sent as the message's metadata
 * when it finishes, so the client never has to parse them.
 */
export const streamChat = async ({
  model,
  messages,
  providerOptions,
  onFinish,
}: StreamChatOptions): Promise<Response> => {
  const followUps: string[] = []

  const result = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(trimHistory(messages), { tools }),
    providerOptions,
    stopWhen: stepCountIs(10),
    tools,
    experimental_transform: followUpTransform(followUps),
    onFinish: ({ text, totalUsage, steps }) =>
      onFinish?.({
        text,
        followUps,
        usage: totalUsage,
        toolCalls: steps.flatMap((step) =>
          step.toolCalls.map(({ toolName, input }) => ({ toolName, input })),
        ),
      }),
  })

  return result.toUIMessageStreamResponse<ChatMessage>({
    // `finish` comes after every text part, so the list is complete by then
    messageMetadata: ({ part }) =>
      part.type === 'finish' && followUps.length > 0
        ? { followUps }
        : undefined,
  })
}
