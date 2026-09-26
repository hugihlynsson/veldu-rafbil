import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type LanguageModel,
  type LanguageModelUsage,
} from 'ai'
import { z } from 'zod'

import systemPrompt from '@/modules/chatPrompt'
import { validateChatMessages, type ChatMessage } from '@/modules/chatMessage'
import {
  boundedMessageSchema,
  MAX_MESSAGES,
  trimHistory,
} from '@/modules/chatRequest'
import { followUpTransform } from '@/modules/followUps'
import { createFetchCarDetailsTool } from './tools/fetchCarDetails'

const createTools = () => ({ fetchCarDetails: createFetchCarDetailsTool() })

// Reading a conversation asks only for the tools' schemas; an answer is given
// tools of its own, as the car-details tool counts its calls
const tools = createTools()

// Only bounds the body, so an oversized post is a 400 rather than a bill.
// Ending on a question keeps the one message trimHistory never drops a small
// one.
const requestSchema = z.object({
  messages: z
    .array(boundedMessageSchema)
    .min(1)
    .max(MAX_MESSAGES)
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

// Per step, and it counts the model's thinking as well as its answer, so it is
// set to stop a runaway rather than to shorten a real one
const MAX_OUTPUT_TOKENS = 16_384

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
  const answerTools = createTools()

  const result = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(trimHistory(messages), {
      tools: answerTools,
    }),
    providerOptions,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    stopWhen: stepCountIs(10),
    tools: answerTools,
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
