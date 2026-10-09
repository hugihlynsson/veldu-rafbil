import { google } from '@ai-sdk/google'
import { Axiom } from '@axiomhq/js'
import { after } from 'next/server'
import { getMessageText } from '@/modules/chat/message'
import { rateLimitedText } from '@/modules/chat/progress'
import { chatRateLimit, clientKey } from '@/modules/rateLimit'
import { parseChatRequest, parseConversationId, streamChat } from './chat'
import { chatLogEvent, questionSource, type ChatOutcome } from './log'

// Picked on Icelandic performance, not general benchmarks: 3.7 scores above
// 3.8 there and spends ~30% fewer output tokens at the same price. Re-run the
// comparison before changing it, and say here what it found.
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
const modelName = 'gemini-3.7-flash'

// Left unbuilt without a token, so a local or preview run stays quiet
const axiom = process.env.AXIOM_TOKEN
  ? new Axiom({ token: process.env.AXIOM_TOKEN })
  : undefined

export async function POST(req: Request) {
  const startedAt = performance.now()
  const elapsed = () => Math.round(performance.now() - startedAt)

  const limit = chatRateLimit(clientKey(req))
  if (!limit.ok) {
    return Response.json(
      { error: rateLimitedText },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const messages = await parseChatRequest(body)
  if (!messages) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const turn = {
    timestamp: new Date().toISOString(),
    conversationId: parseConversationId(body),
    userMessage: getMessageText(messages[messages.length - 1]),
    source: questionSource(messages),
    messageCount: messages.length,
    model: modelName,
    // NODE_ENV is production on a preview deploy too
    environment: process.env.VERCEL_ENV ?? 'development',
    commit: process.env.VERCEL_GIT_COMMIT_SHA,
  }

  // Kept by the answer's callbacks and logged by after(), which runs once the
  // response has gone, so the Axiom round trip never holds the stream open.
  // The first to arrive wins: an error can still be followed by a finish.
  let outcome: ChatOutcome | undefined
  let firstTextMs: number | undefined

  after(async () => {
    if (!axiom) return
    // Read as the response closes, which is the answer ending or the visitor
    // leaving
    const timing = { firstTextMs, durationMs: elapsed() }

    try {
      await axiom.ingest('veldu-rafbil-assistant', [
        chatLogEvent(turn, outcome, timing),
      ])
      await axiom.flush()
    } catch (error) {
      console.error('Failed to log to Axiom:', error)
    }
  })

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
