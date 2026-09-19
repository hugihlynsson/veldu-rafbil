// Blind pairwise judging: each candidate reply against the incumbent's reply to
// the same prompt, order randomised. Judges never grade a model from their own vendor.
//   --dry-run                     how many judgments, no calls
//   --only <list>                 judge just these variants
//   --judges <list>               default: models.json "judges"
// Resumable through .model-eval/judgments.jsonl.
import path from 'node:path'
import { generateText } from 'ai'
import { z } from 'zod'
import {
  OUT,
  HERE,
  PRODUCTION,
  loadSystemPrompt,
  readJSON,
  readJSONL,
  appendJSONL,
  resolveModel,
  missingKeys,
} from './lib.mjs'

const args = process.argv.slice(2)
const value = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const config = readJSON(path.join(HERE, 'models.json'))
const judges = value(
  'judges',
  config.judges?.join(',') ??
    'anthropic/claude-opus-5,google/gemini-3.1-pro-preview',
).split(',')
const concurrency = Number(value('concurrency', 4))

const prompts = new Map(
  readJSON(path.join(OUT, 'prompts.json')).map((p) => [p.id, p]),
)
const runs = readJSONL(path.join(OUT, 'runs.jsonl')).filter(
  (r) => !r.error && r.text?.trim(),
)
const reply = (model, promptId) =>
  runs.find(
    (r) => r.model === model && r.promptId === promptId && r.sample === 0,
  )
const { systemPrompt } = await loadSystemPrompt()

const only = value('only')?.split(',')
const candidates = [...new Set(runs.map((r) => r.model))]
  .filter((m) => m !== PRODUCTION)
  .filter((m) => !only || only.includes(m))
const judgmentsFile = path.join(OUT, 'judgments.jsonl')
const finished = new Set(
  readJSONL(judgmentsFile).map(
    (j) => `${j.judge}|${j.candidate}|${j.promptId}`,
  ),
)

// Same prompt always gets the same order, so a re-run does not reshuffle
const candidateFirst = (key) =>
  [...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 2 === 0

const jobs = judges.flatMap((judge) =>
  candidates
    .filter((candidate) => candidate.split('/')[0] !== judge.split('/')[0])
    .flatMap((candidate) =>
      [...prompts.keys()]
        .filter((id) => reply(PRODUCTION, id) && reply(candidate, id))
        .filter((id) => !finished.has(`${judge}|${candidate}|${id}`))
        .map((promptId) => ({ judge, candidate, promptId })),
    ),
)
console.log(
  `${jobs.length} judgments to make`,
  Object.fromEntries(
    judges.map((j) => [j, jobs.filter((x) => x.judge === j).length]),
  ),
)
if (args.includes('--dry-run')) process.exit(0)
const missing = missingKeys(judges)
if (missing.length) {
  console.error(
    `Missing ${missing.join(', ')}. Run with node --env-file=<path to .env.local>.`,
  )
  process.exit(1)
}

const verdictSchema = z.object({
  icelandic_errors_A: z.number(),
  icelandic_errors_B: z.number(),
  factual_errors_A: z.number(),
  factual_errors_B: z.number(),
  winner: z.enum(['A', 'B', 'tie']),
  reason: z.string(),
})

const rubricPrefix = `You are comparing two replies from an Icelandic-language advisor chatbot for a site that helps people choose an electric car in Iceland. The bot was given the system prompt below. Its rules and facts are authoritative: a reply that follows them is correct even if you have not seen the fact elsewhere (for example the 500.000 kr grant, the WLTP caveat and the real-range estimate are all in it and are NOT inventions). Judge how well each reply follows it and how accurate it is against its car list.

=== SYSTEM PROMPT GIVEN TO THE BOT ===
${systemPrompt}
=== END OF SYSTEM PROMPT ===
`

const rubricRest = (history, a, b) => `CONVERSATION SO FAR:
${history}

REPLY A:
${a}

REPLY B:
${b}

Judge which reply the site owner would rather show a real visitor. Weigh, most important first:
1. Factual accuracy against the system prompt: wrong prices, ranges or drive types, cars that are not in the list, made-up specifications. Count each error. Claims that come from the system prompt itself are not errors.
2. Icelandic quality: grammar, inflection and case, word choice, natural phrasing rather than translationese. Count clear errors only.
3. Whether it actually answers the question asked, concisely and in a friendly conversational tone.
4. Following the system prompt's format and tone rules (at most 3 table columns, exactly three [q:...] follow-ups at the end, no horizontal rules, plain text).
Ignore length for its own sake. Say "tie" only if they are genuinely equal.

Answer with only a JSON object: {"icelandic_errors_A": n, "icelandic_errors_B": n, "factual_errors_A": n, "factual_errors_B": n, "winner": "A" | "B" | "tie", "reason": "one or two sentences in English"}`

async function judgeOne({ judge, candidate, promptId }) {
  const prompt = prompts.get(promptId)
  const history = prompt.messages
    .map((m) => `${m.role === 'user' ? 'VISITOR' : 'BOT'}: ${m.text}`)
    .join('\n')
  const incumbent = reply(PRODUCTION, promptId).text
  const challenger = reply(candidate, promptId).text
  const flipped = candidateFirst(`${candidate}|${promptId}`)
  const [a, b] = flipped ? [challenger, incumbent] : [incumbent, challenger]
  try {
    // The car list leads every call, so it is marked for Anthropic's cache and
    // OpenAI caches a repeated prefix on its own
    const { text, usage } = await generateText({
      model: resolveModel(judge),
      providerOptions: {
        anthropic: { effort: 'medium' },
        openai: { reasoningEffort: 'medium' },
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: rubricPrefix,
              providerOptions: {
                anthropic: { cacheControl: { type: 'ephemeral' } },
              },
            },
            { type: 'text', text: rubricRest(history, a, b) },
          ],
        },
      ],
    })
    const verdict = verdictSchema.parse(
      JSON.parse(text.match(/\{[\s\S]*\}/)[0]),
    )
    const side = {
      A: flipped ? 'candidate' : 'incumbent',
      B: flipped ? 'incumbent' : 'candidate',
    }
    const mine = flipped ? 'A' : 'B'
    const theirs = flipped ? 'B' : 'A'
    appendJSONL(path.join(OUT, 'judgments.jsonl'), {
      judge,
      candidate,
      promptId,
      winner: verdict.winner === 'tie' ? 'tie' : side[verdict.winner],
      candidateIcelandicErrors: verdict[`icelandic_errors_${mine}`],
      incumbentIcelandicErrors: verdict[`icelandic_errors_${theirs}`],
      candidateFactualErrors: verdict[`factual_errors_${mine}`],
      incumbentFactualErrors: verdict[`factual_errors_${theirs}`],
      reason: verdict.reason,
      usage,
    })
    console.log(`ok   ${judge} ${candidate} ${promptId}`)
  } catch (error) {
    console.log(
      `FAIL ${judge} ${candidate} ${promptId} ${String(error.message).slice(0, 100)}`,
    )
  }
}

let next = 0
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (next < jobs.length) await judgeOne(jobs[next++])
  }),
)
