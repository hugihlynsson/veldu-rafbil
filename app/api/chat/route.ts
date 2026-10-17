import { google } from '@ai-sdk/google'
import { getMessageText } from '@/modules/chat/message'
import { chatRateLimit } from '@/modules/rateLimit'
import {
  deployment,
  invalidBody,
  logAfterResponse,
  readGuardedBody,
} from '../publicEndpoint'
import { parseChatRequest, parseConversationId, streamChat } from './chat'
import { chatLogEvent, questionSource, type ChatOutcome } from './log'
import { advisorModel as modelName } from './model'

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
      model: google(modelName),
      messages,
      providerOptions: {
        // Every answer waits on the thinking before its first visible token
        google: { thinkingConfig: { thinkingLevel: 'low' } },
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
