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

// Picked on Icelandic performance, not general benchmarks. Oct 2026, at the
// thinking level below: 3.7 Flash 63.3, 3.8 Flash 62.3, GPT-6 Luna (high) 57.
// 3.8 is here only because Google deprecated 3.7, which also spent ~30% fewer
// output tokens at the same price. Re-run the comparison before changing it,
// and say here what it found.
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
const modelName = 'gemini-3.8-flash'

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
