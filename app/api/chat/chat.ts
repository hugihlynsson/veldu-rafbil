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
// than failing inside streamText.
const requestSchema = z.object({
  messages: z
    .array(z.discriminatedUnion('role', [questionSchema, answerSchema]))
    .min(1)
    .max(100),
})

/** The conversation a request carries, or null if it is not one we answer */
export const parseChatRequest = async (
  body: unknown,
): Promise<ChatMessage[] | null> => {
  const bounded = requestSchema.safeParse(body)
  if (!bounded.success) return null

  return validateChatMessages(bounded.data.messages, tools)
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
    messages: await convertToModelMessages(messages, { tools }),
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
