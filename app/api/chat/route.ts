import { google } from '@ai-sdk/google'
import { Axiom } from '@axiomhq/js'
import { after } from 'next/server'
import { getMessageText } from '@/modules/chatHelpers'
import { parseChatRequest, streamChat, type ChatFinish } from './chat'
import { clientKey, rateLimit } from './rateLimit'

// Picked on Icelandic performance, not general benchmarks: 3.7 scores above
// 3.8 there and spends ~30% fewer output tokens at the same price.
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
const modelName = 'gemini-3.7-flash'

// Left unbuilt without a token, so a local or preview run stays quiet
const axiom = process.env.AXIOM_TOKEN
  ? new Axiom({ token: process.env.AXIOM_TOKEN })
  : undefined

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req))
  if (!limit.ok) {
    return Response.json(
      { error: 'Aðeins of margar fyrirspurnir, reyndu aftur eftir augnablik' },
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

  // Kept by onFinish and logged by after(), which runs once the response has
  // gone, so the Axiom round trip never holds the stream open. An answer that
  // errors or is aborted never finishes, and has nothing to log.
  let finished: ChatFinish | undefined

  after(async () => {
    if (!axiom || !finished) return

    try {
      await axiom.ingest('veldu-rafbil-assistant', [
        {
          type: 'chat_response_finished',
          timestamp: new Date().toISOString(),
          userMessage: getMessageText(messages[messages.length - 1]),
          assistantResponse: finished.text,
          followUps: finished.followUps,
          messageCount: messages.length,
          tokenUsage: finished.usage,
          toolCalls: finished.toolCalls,
          model: modelName,
          environment: process.env.NODE_ENV || 'development',
        },
      ])
      await axiom.flush()
    } catch (error) {
      console.error('Failed to log to Axiom:', error)
    }
  })

  return streamChat({
    model: google(modelName),
    messages,
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: 'medium' } },
    },
    onFinish: (event) => {
      finished = event
    },
  })
}
