import { google } from '@ai-sdk/google'
import { streamText, convertToModelMessages, stepCountIs, UIMessage } from 'ai'
import { Axiom } from '@axiomhq/js'
import { z } from 'zod'
import { getMessageText } from '@/modules/chatHelpers'
import systemPrompt from '@/modules/chatPrompt'
import { fetchCarDetailsTool } from './tools/fetchCarDetails'
import { clientKey, rateLimit } from './rateLimit'

// Picked on Icelandic performance, not general benchmarks: 3.7 scores above
// 3.8 there and spends ~30% fewer output tokens at the same price.
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
const modelName = 'gemini-3.7-flash'

// Left unbuilt without a token, so a local or preview run stays quiet
const axiom = process.env.AXIOM_TOKEN
  ? new Axiom({ token: process.env.AXIOM_TOKEN })
  : undefined

// Loose on purpose — convertToModelMessages owns the real shape. This only
// bounds the body, so an oversized post is a 400 rather than a bill.
const requestSchema = z.object({
  messages: z
    .array(
      z
        .object({
          id: z.string().optional(),
          role: z.enum(['user', 'assistant', 'system']),
          parts: z.array(z.object({ type: z.string() }).loose()).max(50),
        })
        .loose(),
    )
    .min(1)
    .max(100),
})

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

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const messages = parsed.data.messages as UIMessage[]

  const result = streamText({
    model: google(modelName),
    messages: await convertToModelMessages(messages),
    system: systemPrompt,
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: 'medium' } },
    },
    stopWhen: stepCountIs(10),
    tools: {
      fetchCarDetails: fetchCarDetailsTool,
    },
    onFinish: async ({ text, usage, toolCalls }) => {
      if (!axiom) return

      try {
        await axiom.ingest('veldu-rafbil-assistant', [
          {
            type: 'chat_response_finished',
            timestamp: new Date().toISOString(),
            userMessage: getMessageText(messages[messages.length - 1]),
            assistantResponse: text,
            messageCount: messages.length,
            tokenUsage: usage,
            toolCalls: toolCalls,
            model: modelName,
            environment: process.env.NODE_ENV || 'development',
          },
        ])
        await axiom.flush()
      } catch (error) {
        console.error('Failed to log to Axiom:', error)
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
