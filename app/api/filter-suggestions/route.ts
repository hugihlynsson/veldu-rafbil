import { Axiom } from '@axiomhq/js'
import { TypeSafeClient } from '@typesafe-ai/sdk'
import { after } from 'next/server'
import { z } from 'zod'

import { MAX_INTENT_LENGTH } from '@/modules/list/filterIntent'
import { suggestFilters, type AskModel } from './model'
import { suggestionsLogEvent } from './log'
import { clientKey, filterSuggestionsRateLimit } from '@/modules/rateLimit'

// Measured on the 162 Icelandic requests in cases.ts
// (October 2026, three runs): with the parser it gets 154–155 exactly right to
// the parser's 88, at 95–97% precision and 97% recall, p95 ~280 ms, ~1,700
// input tokens a request; 14 of the 17 that give a bare number for it to place,
// and all 29 questions to the advisor. When the brackets were last
// worded, 16 of the 18 held-out cases, which the wording was not tuned on, to
// 11 before it was. Asked in Icelandic it scored the same
// within run-to-run noise on ~28% more tokens, so the questions are English,
// with the Icelandic words for each filter glossed in them (the Icelandic set
// is in 48af344, should a later model do better with it). Re-run
// scripts/eval-filter-intent.ts before following "latest" to a new model.
const modelName = 'jev-latest'

// Someone who has typed on has no use for the answer, so it is not waited for
// long, and not asked twice
const client = process.env.TYPESAFE_API_KEY
  ? new TypeSafeClient({
      defaultModel: modelName,
      timeout: 1_000,
      retry: { maxRetries: 0 },
      logLevel: 'error',
    })
  : undefined

// Left unbuilt without a token, so a local or preview run stays quiet
const axiom = process.env.AXIOM_TOKEN
  ? new Axiom({ token: process.env.AXIOM_TOKEN })
  : undefined

const requestSchema = z.strictObject({
  text: z.string().trim().min(1).max(MAX_INTENT_LENGTH),
})

export async function POST(req: Request) {
  const limit = filterSuggestionsRateLimit(clientKey(req))
  if (!limit.ok) {
    return Response.json(
      { error: 'Of margar fyrirspurnir, reyndu aftur eftir smástund' },
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

  const started = performance.now()
  let answered:
    | { answers: Record<string, unknown>; usage: { input_tokens: number } }
    | undefined
  const ask: AskModel | undefined =
    client &&
    ((request) =>
      client
        .systemOne(request, { signal: req.signal })
        .then((result) => {
          answered = result
          return result
        })
        .catch((error) => {
          console.error('Filter suggestions model failed:', error)
          throw error
        }))

  const result = await suggestFilters(parsed.data.text, ask)
  const millis = Math.round(performance.now() - started)
  // Read now: the client aborts a request it has typed past, and once the
  // response is sent there is no telling that apart from a closed connection
  const superseded = req.signal.aborted

  // Logged once the response has gone, so the Axiom round trip never holds
  // the pills back
  if (axiom)
    after(async () => {
      try {
        axiom.ingest('veldu-rafbil-assistant', [
          suggestionsLogEvent({
            timestamp: new Date().toISOString(),
            text: parsed.data.text,
            result,
            answers: answered?.answers,
            inputTokens: answered?.usage.input_tokens,
            superseded,
            millis,
            model: modelName,
            environment: process.env.VERCEL_ENV ?? 'development',
          }),
        ])
        await axiom.flush()
      } catch (error) {
        console.error('Failed to log to Axiom:', error)
      }
    })

  return Response.json(result)
}
