/**
 * Scores the filter suggestions against app/api/filter-suggestions/cases.ts: the
 * parser alone, and, when TYPESAFE_API_KEY is set, the parser with Jev.
 *
 *   npx tsx --env-file=.env.local scripts/eval-filter-intent.ts [--verbose]
 *
 * Each case the parser cannot finish is a real, billed request, of about
 * 1,650 input tokens. Jev's answers vary a little from run to run, so a
 * difference of a few cases between two runs is noise rather than a result.
 */
import { TypeSafeClient } from '@typesafe-ai/sdk'

import type { Filters } from '@/modules/list/filters'
import { filterDefinitions } from '@/modules/list/filters'
import { parseFilterIntent, rankSuggestions } from '@/modules/list/filterIntent'
import {
  CaseScore,
  IntentCase,
  intentCases,
  scoreCase,
  summarize,
} from '@/app/api/filter-suggestions/cases'
import {
  suggestFilters,
  type AskModel,
} from '@/app/api/filter-suggestions/model'

const verbose = process.argv.includes('--verbose')

interface Run {
  name: string
  scores: CaseScore[]
  millis: number[]
  inputTokens: number
  statuses: Record<string, number>
}

const percent = (share: number) => `${(share * 100).toFixed(0)}%`

const percentile = (values: number[], share: number) => {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(share * sorted.length))]
}

const describe = (filters: Filters) => JSON.stringify(filters)

const report = (run: Run) => {
  console.log(`\n${run.name}`)
  const kinds: Array<IntentCase['kind'] | 'all'> = [
    'literal',
    'mixed',
    'vague',
    'number',
    'question',
    'all',
  ]
  for (const kind of kinds) {
    const picked = run.scores.filter(
      (_, i) => kind === 'all' || intentCases[i].kind === kind,
    )
    const { cases, exact, precision, recall } = summarize(picked)
    console.log(
      `  ${kind.padEnd(8)} exact ${String(exact).padStart(2)}/${String(cases).padEnd(3)}` +
        ` precision ${percent(precision).padStart(4)}  recall ${percent(recall).padStart(4)}`,
    )
  }
  if (run.millis.length) {
    console.log(
      `  latency p50 ${percentile(run.millis, 0.5)} ms, p95 ${percentile(run.millis, 0.95)} ms;` +
        ` ${Math.round(run.inputTokens / run.millis.length)} input tokens a request;` +
        ` model ${JSON.stringify(run.statuses)}`,
    )
  }
  reportFilters(run)
}

// Where the mistakes are: a filter with many extras is one the model reads
// into requests that never asked for it
const reportFilters = (run: Run) => {
  const rows = (Object.keys(filterDefinitions) as Array<keyof Filters>)
    .map((key) => {
      const count = (pick: (score: CaseScore) => Array<keyof Filters>) =>
        run.scores.filter((score) => pick(score).includes(key)).length
      return {
        key,
        right: count((score) => score.right),
        wrong: count((score) => score.wrong),
        missed: count((score) => score.missed),
        extra: count((score) => score.extra),
      }
    })
    .filter(({ wrong, missed, extra }) => wrong + missed + extra > 0)
  if (!rows.length) return
  console.log('  mistakes by filter')
  for (const { key, right, wrong, missed, extra } of rows) {
    console.log(
      `    ${key.padEnd(13)} right ${String(right).padStart(2)}  wrong ${wrong}` +
        `  missed ${String(missed).padStart(2)}  extra ${String(extra).padStart(2)}`,
    )
  }
}

const showMisses = (run: Run, got: Filters[]) => {
  run.scores.forEach((score, i) => {
    if (score.wrong.length + score.missed.length + score.extra.length === 0)
      return
    console.log(
      `  ${JSON.stringify(intentCases[i].text)}\n` +
        `    expected ${describe(intentCases[i].expect as Filters)}, got ${describe(got[i])}`,
    )
  })
}

const parserOnly = (): Run => {
  const got = intentCases.map(
    (testCase) => parseFilterIntent(testCase.text).filters,
  )
  const run: Run = {
    name: 'Parser alone',
    scores: intentCases.map((testCase, i) => scoreCase(testCase, got[i])),
    millis: [],
    inputTokens: 0,
    statuses: {},
  }
  report(run)
  if (verbose) showMisses(run, got)
  return run
}

const withModel = async (client: TypeSafeClient) => {
  const run: Run = {
    name: 'Parser + Jev',
    scores: [],
    millis: [],
    inputTokens: 0,
    statuses: {},
  }
  const got: Filters[] = []
  if (verbose) console.log(`\n${run.name}: answers`)

  for (const testCase of intentCases) {
    let millis: number | undefined
    const ask: AskModel = async (request) => {
      const started = performance.now()
      const result = await client.systemOne(request)
      millis = Math.round(performance.now() - started)
      run.inputTokens += result.usage.input_tokens
      if (verbose) {
        console.log(
          `  ${JSON.stringify(testCase.text)} ${JSON.stringify(
            Object.fromEntries(
              Object.entries(result.answers).map(([key, answer]) => [
                key,
                'probabilities' in answer ? answer.probabilities : answer,
              ]),
            ),
          )}`,
        )
      }
      return result
    }

    const result = await suggestFilters(testCase.text, ask)
    if (millis !== undefined) run.millis.push(millis)
    run.statuses[result.model] = (run.statuses[result.model] ?? 0) + 1
    // As the chips would offer them on an unfiltered list
    const filters = rankSuggestions(result.suggestions, {}).combined
    got.push(filters)
    run.scores.push(scoreCase(testCase, filters))
  }

  report(run)
  if (verbose) showMisses(run, got)
  return run
}

const main = async () => {
  console.log(`${intentCases.length} cases`)
  parserOnly()

  if (!process.env.TYPESAFE_API_KEY) {
    console.log('\nTYPESAFE_API_KEY is not set, so Jev was not asked.')
    return
  }

  const client = new TypeSafeClient({ retry: { maxRetries: 0 } })
  await withModel(client)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
