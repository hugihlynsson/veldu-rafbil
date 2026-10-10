import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type LanguageModel,
  type LanguageModelUsage,
} from 'ai'
import { z } from 'zod'

import systemPrompt from './prompt'
import { validateChatMessages, type ChatMessage } from '@/modules/chat/message'
import {
  boundedMessageSchema,
  MAX_MESSAGES,
  trimHistory,
} from '@/modules/chat/request'
import {
  markerTransform,
  type AnswerMarkers,
} from '@/modules/chat/answerMarkers'
import { resolveCarRefs } from '@/modules/chat/cars'
import { createFetchCarDetailsTool } from './tools/fetchCarDetails'
import { withComparisonContext } from './comparisonContext'

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

// Ours to log, not to trust: anything but a UUID is dropped rather than written
const conversationSchema = z.object({ conversationId: z.uuid() })

/** Which conversation a request continues, if it says */
export const parseConversationId = (body: unknown): string | undefined =>
  conversationSchema.safeParse(body).data?.conversationId

// Per step, and it counts the model's thinking as well as its answer, so it is
// set to stop a runaway rather than to shorten a real one
const MAX_OUTPUT_TOKENS = 16_384

/** What a finished answer came to, for the log */
export interface ChatFinish {
  text: string
  followUps: string[]
  cars: string[]
  usage: LanguageModelUsage
  toolCalls: Array<{ toolName: string; input: unknown }>
}

interface StreamChatOptions {
  model: LanguageModel
  messages: ChatMessage[]
  providerOptions?: Parameters<typeof streamText>[0]['providerOptions']
  onFinish?: (finish: ChatFinish) => void
  onError?: (error: unknown) => void
  /** When the first of the answer's text arrives, after any thinking or tools */
  onFirstText?: () => void
}

const metadataOf = ({
  followUps,
  cars,
}: AnswerMarkers): ChatMessage['metadata'] => {
  const ids = resolveCarRefs(cars)
  if (followUps.length === 0 && ids.length === 0) return undefined
  return {
    ...(followUps.length > 0 && { followUps }),
    ...(ids.length > 0 && { cars: ids }),
  }
}

/**
 * The answer as a UI message stream. The follow-up and car markers the prompt
 * asks for are taken out of the text on the way and sent as the message's
 * metadata when it finishes, so the client never has to parse them.
 */
export const streamChat = async ({
  model,
  messages,
  providerOptions,
  onFinish,
  onError,
  onFirstText,
}: StreamChatOptions): Promise<Response> => {
  const markers: AnswerMarkers = { followUps: [], cars: [] }
  const answerTools = createTools()
  let hasText = false

  const result = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(
      await withComparisonContext(trimHistory(messages)),
      {
        tools: answerTools,
      },
    ),
    providerOptions,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    stopWhen: stepCountIs(10),
    tools: answerTools,
    experimental_transform: markerTransform(markers),
    // Left unset without one, as setting it silences the SDK's own logging
    onError: onError && (({ error }) => onError(error)),
    onChunk: ({ chunk }) => {
      if (chunk.type !== 'text-delta' || hasText) return
      hasText = true
      onFirstText?.()
    },
    onFinish: ({ text, totalUsage, steps }) =>
      onFinish?.({
        text,
        followUps: markers.followUps,
        cars: resolveCarRefs(markers.cars),
        usage: totalUsage,
        toolCalls: steps.flatMap((step) =>
          step.toolCalls.map(({ toolName, input }) => ({ toolName, input })),
        ),
      }),
  })

  return result.toUIMessageStreamResponse<ChatMessage>({
    // `finish` comes after every text part, so the list is complete by then
    messageMetadata: ({ part }) =>
      part.type === 'finish' ? metadataOf(markers) : undefined,
  })
}
