import {
  convertToModelMessages,
  safeValidateUIMessages,
  stepCountIs,
  streamText,
  type LanguageModel,
  type LanguageModelUsage,
} from 'ai'
import { z } from 'zod'

import systemPrompt from '@/modules/chatPrompt'
import { chatMetadataSchema, type ChatMessage } from '@/modules/chatHelpers'
import { followUpTransform } from '@/modules/followUps'
import { fetchCarDetailsTool } from './tools/fetchCarDetails'

const tools = { fetchCarDetails: fetchCarDetailsTool }

// Only bounds the body, so an oversized post is a 400 rather than a bill; the
// shape of each message is validateUIMessages' to check. No `system`: the
// instructions are ours, and a client sending its own is refused here rather
// than failing inside streamText.
const requestSchema = z.object({
  messages: z
    .array(
      z
        .object({
          role: z.enum(['user', 'assistant']),
          parts: z.array(z.object({ type: z.string() }).loose()).max(50),
        })
        .loose(),
    )
    .min(1)
    .max(100),
})

/** The conversation a request carries, or null if it is not one we answer */
export const parseChatRequest = async (
  body: unknown,
): Promise<ChatMessage[] | null> => {
  const bounded = requestSchema.safeParse(body)
  if (!bounded.success) return null

  const validated = await safeValidateUIMessages<ChatMessage>({
    messages: bounded.data.messages,
    metadataSchema: chatMetadataSchema,
    tools,
  })

  return validated.success ? validated.data : null
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
