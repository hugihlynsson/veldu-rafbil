import { TypeSafeClient } from '@typesafe-ai/sdk'
import { z } from 'zod'

import { MAX_INTENT_LENGTH } from '@/modules/list/filterIntent'
import { filterSuggestionsRateLimit } from '@/modules/rateLimit'
import {
  deployment,
  invalidBody,
  logAfterResponse,
  readGuardedBody,
} from '../publicEndpoint'
import { suggestFilters, type AskModel } from './model'
import { suggestionsLogEvent } from './log'

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

const requestSchema = z.strictObject({
  text: z.string().trim().min(1).max(MAX_INTENT_LENGTH),
})

export async function POST(req: Request) {
  const read = await readGuardedBody(req, filterSuggestionsRateLimit)
  if (read instanceof Response) return read

  const parsed = requestSchema.safeParse(read.body)
  if (!parsed.success) return invalidBody()

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

  logAfterResponse(() =>
    suggestionsLogEvent({
      timestamp: new Date().toISOString(),
      text: parsed.data.text,
      result,
      answers: answered?.answers,
      inputTokens: answered?.usage.input_tokens,
      superseded,
      millis,
      model: modelName,
      ...deployment(),
    }),
  )

  return Response.json(result)
}
