// Which thinking levels does a model accept, and does the level change what it
// spends? Each try is a one-line prompt, so this costs fractions of a cent.
//   --models <list>    provider/model ids; default: production + models.json candidates
//   --levels <list>    default: none,minimal,low,medium,high
// Levels differ per model ("minimal" is rejected by the Gemini Flash models,
// "none" exists on the OpenAI ones), which is why the grid in models.json
// should only hold levels this printed "ok" for.
import path from 'node:path'
import { generateText } from 'ai'
import {
  HERE,
  PRODUCTION,
  baseId,
  providerOptionsFor,
  readJSON,
  resolveModel,
  missingKeys,
} from './lib.mjs'

const args = process.argv.slice(2)
const value = (name) => args[args.indexOf(`--${name}`) + 1]
const config = readJSON(path.join(HERE, 'models.json'))
const models = value('models')
  ? value('models').split(',')
  : [...new Set([PRODUCTION, ...config.candidates].map(baseId))]
const levels = value('levels')
  ? value('levels').split(',')
  : ['none', 'minimal', 'low', 'medium', 'high']

const missing = missingKeys(models)
if (missing.length) {
  console.error(
    `Missing ${missing.join(', ')}. Run with node --env-file=.env.local.`,
  )
  process.exit(1)
}

const question = 'Hvort er stærra, 9,11 eða 9,9? Útskýrðu í einni setningu.'
for (const model of models) {
  for (const level of levels) {
    try {
      const started = performance.now()
      const result = await generateText({
        model: resolveModel(model),
        prompt: question,
        providerOptions: providerOptionsFor(`${model}@${level}`),
      })
      const reasoning = result.usage.outputTokenDetails?.reasoningTokens ?? '?'
      console.log(
        `${model.padEnd(30)} ${level.padEnd(8)} ok    reasoning=${reasoning} out=${result.usage.outputTokens} ${Math.round(performance.now() - started)}ms`,
      )
    } catch (error) {
      console.log(
        `${model.padEnd(30)} ${level.padEnd(8)} FAIL  ${String(error.message).slice(0, 120)}`,
      )
    }
  }
}
