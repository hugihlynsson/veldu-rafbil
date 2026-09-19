// Replay the prompts through each model with the production route's settings.
//   --dry-run                     plan and cost estimate, no calls
//   --limit 3 --models <list>     smoke test
//   (no flags)                    production + the candidates in models.json
//   --concurrency N               default 4; OpenAI rate-limits at about 6
// Models are provider/model@level, e.g. google/gemini-3.7-flash@medium
// Resumable: finished (model, prompt, sample) triples in out/runs.jsonl are skipped.
import path from 'node:path'
import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import {
  OUT,
  HERE,
  PRODUCTION,
  loadSystemPrompt,
  loadTool,
  readJSON,
  readJSONL,
  appendJSONL,
  resolveModel,
  missingKeys,
  baseId,
  providerOptionsFor,
} from './lib.mjs'

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const value = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}

const config = readJSON(path.join(HERE, 'models.json'))
const models = value('models')?.split(',') ?? [PRODUCTION, ...config.candidates]
const limit = Number(value('limit', Infinity))
const samples = Number(value('samples', 1))
const concurrency = Number(value('concurrency', 4))
const prompts = readJSON(path.join(OUT, 'prompts.json')).slice(0, limit)
const runsFile = path.join(OUT, 'runs.jsonl')

const { systemPrompt } = await loadSystemPrompt()
// Measured on Gemini: 28.7k characters of Icelandic came to ~14.9k tokens
const promptTokens = Math.round(systemPrompt.length / 1.93)

const pricing = Object.fromEntries(
  (
    await (await fetch('https://ai-gateway.vercel.sh/v1/models')).json()
  ).data.map((m) => [m.id, m.pricing]),
)

const jobs = models.flatMap((model) =>
  prompts.flatMap((prompt) =>
    Array.from({ length: samples }, (_, sample) => ({ model, prompt, sample })),
  ),
)
const done = new Set(
  readJSONL(runsFile)
    .filter((r) => !r.error)
    .map((r) => `${r.model}|${r.promptId}|${r.sample}`),
)
const todo = jobs.filter(
  (j) => !done.has(`${j.model}|${j.prompt.id}|${j.sample}`),
)

// Rough: the car list dominates the input; answers run ~500 tokens of text plus
// whatever the model spends thinking, which this cannot know
const estimate = (model) => {
  const p = pricing[baseId(model)]
  if (!p) return null
  const perCall =
    (promptTokens + 300) * Number(p.input) + 800 * Number(p.output)
  return {
    perCall,
    total: perCall * todo.filter((j) => j.model === model).length,
  }
}
console.log(
  `${prompts.length} prompts x ${models.length} models x ${samples} sample(s); ${todo.length} calls to make (~${promptTokens} prompt tokens each)`,
)
for (const model of models) {
  const e = estimate(model)
  console.log(
    `  ${model.padEnd(40)} ${e ? `~$${e.perCall.toFixed(4)}/call  ~$${e.total.toFixed(2)} total` : 'no gateway price'}`,
  )
}
if (flag('dry-run')) process.exit(0)

const missing = missingKeys(models.map(baseId))
if (missing.length) {
  console.error(
    `Missing ${missing.join(', ')}. Run with node --env-file=<path to .env.local>.`,
  )
  process.exit(1)
}

const tools = { fetchCarDetails: await loadTool() }

async function replay({ model, prompt, sample }) {
  const messages = await convertToModelMessages(
    prompt.messages.map((m) => ({
      role: m.role,
      parts: [{ type: 'text', text: m.text }],
    })),
  )
  const started = performance.now()
  const record = {
    model,
    promptId: prompt.id,
    sample,
    at: new Date().toISOString(),
  }
  try {
    const result = streamText({
      model: resolveModel(baseId(model)),
      messages,
      system: systemPrompt,
      providerOptions: providerOptionsFor(model),
      stopWhen: stepCountIs(10),
      tools,
    })
    let text = ''
    let ttftMs
    const toolCalls = []
    for await (const part of result.fullStream) {
      if (part.type === 'text-delta') {
        ttftMs ??= performance.now() - started
        text += part.text
      } else if (part.type === 'tool-call')
        toolCalls.push({ name: part.toolName, input: part.input })
      else if (part.type === 'error') throw part.error
    }
    Object.assign(record, {
      text,
      ttftMs: Math.round(ttftMs ?? -1),
      totalMs: Math.round(performance.now() - started),
      usage: await result.totalUsage,
      finishReason: await result.finishReason,
      toolCalls,
    })
  } catch (error) {
    record.error = String(error?.message ?? error).slice(0, 500)
  }
  appendJSONL(runsFile, record)
  console.log(
    `${record.error ? 'FAIL' : 'ok  '} ${model} ${prompt.id}${record.error ? `  ${record.error.slice(0, 120)}` : `  ${record.totalMs}ms`}`,
  )
  return record
}

let next = 0
let failures = 0
let successes = 0
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (next < todo.length) {
      const record = await replay(todo[next++])
      if (record.error) failures++
      else successes++
      if (failures >= 5 && successes === 0) {
        console.error('Five failures and no successes, stopping.')
        process.exit(1)
      }
    }
  }),
)
console.log(`done, ${failures} failed. Re-run to retry the failures.`)
