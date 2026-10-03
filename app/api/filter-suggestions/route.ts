import { TypeSafeClient } from '@typesafe-ai/sdk'
import { z } from 'zod'

import { clientKey, createRateLimit } from '@/app/api/chat/rateLimit'
import { MAX_INTENT_LENGTH } from '@/modules/filterIntent'
import { suggestFilters, type AskModel } from '@/modules/filterIntentModel'

// Measured on the 120 Icelandic requests in modules/filterIntentCases.ts
// (October 2026, two runs): with the parser it gets 114–115 exactly right to
// the parser's 62, at 96–97% precision and 97–98% recall, p95 ~300 ms, ~1,600
// input tokens a request. 16 of the 18 held-out cases, which the wording was
// not tuned on, to 11 before it was. Asked in Icelandic it scored the same
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
      timeout: 2_000,
      retry: { maxRetries: 0 },
      logLevel: 'error',
    })
  : undefined

// Typing asks more often than chatting does, debounced as it is
const rateLimit = createRateLimit(60)

const requestSchema = z.strictObject({
  text: z.string().trim().min(1).max(MAX_INTENT_LENGTH),
})

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req))
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

  const ask: AskModel | undefined =
    client &&
    ((request) =>
      client.systemOne(request, { signal: req.signal }).catch((error) => {
        console.error('Filter suggestions model failed:', error)
        throw error
      }))

  return Response.json(await suggestFilters(parsed.data.text, ask))
}
