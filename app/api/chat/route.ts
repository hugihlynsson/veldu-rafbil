import {
  openai,
  type OpenAILanguageModelResponsesOptions,
} from '@ai-sdk/openai'
import { getMessageText } from '@/modules/chat/message'
import { chatRateLimit } from '@/modules/rateLimit'
import {
  deployment,
  invalidBody,
  logAfterResponse,
  readGuardedBody,
} from '../publicEndpoint'
import { parseChatRequest, parseConversationId, streamChat } from './chat'
import { carPage, chatLogEvent, questionSource, type ChatOutcome } from './log'
import { advisorModel as modelName } from '@/modules/chat/model'

export async function POST(req: Request) {
  const startedAt = performance.now()
  const elapsed = () => Math.round(performance.now() - startedAt)

  const read = await readGuardedBody(req, chatRateLimit)
  if (read instanceof Response) return read

  const messages = await parseChatRequest(read.body)
  if (!messages) return invalidBody()

  const turn = {
    timestamp: new Date().toISOString(),
    conversationId: parseConversationId(read.body),
    userMessage: getMessageText(messages.at(-1)),
    source: questionSource(messages),
    carPage: carPage(messages),
    messageCount: messages.length,
    model: modelName,
    ...deployment(),
  }

  // Kept by the answer's callbacks for the log, which is built as the
  // response closes: the answer ending or the visitor leaving. The first to
  // arrive wins, as an error can still be followed by a finish.
  let outcome: ChatOutcome | undefined
  let firstTextMs: number | undefined

  logAfterResponse(() =>
    chatLogEvent(turn, outcome, { firstTextMs, durationMs: elapsed() }),
  )

  try {
    return await streamChat({
      model: openai(modelName),
      messages,
      providerOptions: {
        openai: {
          // Every answer waits on the thinking before its first visible token
          reasoningEffort: 'medium',
          // Otherwise a summary of the thinking is streamed to the visitor
          reasoningSummary: null,
          // Sends every answer to the same cache, as they share the prefix
          promptCacheKey: 'chat',
        } satisfies OpenAILanguageModelResponsesOptions,
      },
      onFinish: (finish) => {
        outcome ??= { finish }
      },
      onError: (error) => {
        console.error('Chat answer failed:', error)
        outcome ??= { error }
      },
      onFirstText: () => {
        firstTextMs = elapsed()
      },
    })
  } catch (error) {
    outcome ??= { error }
    throw error
  }
}
