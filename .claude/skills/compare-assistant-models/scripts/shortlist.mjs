// Step one: who is worth testing. Lists Miðeind's Icelandic leaderboard next to
// what each model costs, with production marked, so a candidate is one that
// scores higher or costs less, not one that merely exists.
//   --top 15    how many rows (default 15)
// No keys needed. Prices come from the Vercel AI Gateway's public model list;
// models it does not list, or lists under another name, show "-".
import { PRODUCTION, baseId } from './lib.mjs'

const args = process.argv.slice(2)
const top = Number(args[args.indexOf('--top') + 1]) || 15

const [board, gateway] = await Promise.all([
  fetch(
    'https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard/resolve/main/leaderboard.json',
  ).then((response) => response.json()),
  fetch('https://ai-gateway.vercel.sh/v1/models').then((response) =>
    response.json(),
  ),
])

// Both sides spell versions differently (fable-5-1 / fable-5.1) and Google is
// "gemini" on the leaderboard and "google" in the price list
const key = (id) =>
  id
    .replace(/^gemini\//, 'google/')
    .replaceAll('.', '-')
    .toLowerCase()
const prices = new Map(gateway.data.map((m) => [key(m.id), m.pricing]))
const production = key(baseId(PRODUCTION))

const rows = board.models
  .map((m) => {
    const pricing = prices.get(key(m.model))
    const quality = m.scores['generative_quality@v1'] ?? {}
    return {
      name: m.display_name,
      isProduction: key(m.model) === production,
      average: m.average,
      grammar: quality.grammar,
      vocabulary: quality.vocabulary,
      caseMarking: m.scores['icelandic_case_marking@v1']?.accuracy,
      input: pricing && Number(pricing.input) * 1e6,
      output: pricing && Number(pricing.output) * 1e6,
    }
  })
  .sort((a, b) => b.average - a.average)

const pct = (x) =>
  (typeof x === 'number' ? (x * 100).toFixed(1) : '-').padStart(6)
const usd = (x) => (typeof x === 'number' ? x.toFixed(2) : '-').padStart(6)
const rank = rows.findIndex((r) => r.isProduction) + 1

console.log(`Leaderboard generated ${board.generated_at}`)
console.log(
  `Production is ${PRODUCTION}${rank ? `, ranked ${rank} of ${rows.length}` : ' (not on the leaderboard)'}.`,
)
console.log(
  'Entries were run with their own reasoning settings (mostly high); production runs lower, so scores are indicative only.',
)
console.log()
console.log(
  `${'model'.padEnd(30)} ${'avg'.padStart(6)} ${'gramr'.padStart(6)} ${'vocab'.padStart(6)} ${'case'.padStart(6)} ${'$in/M'.padStart(6)} ${'$out/M'.padStart(6)}`,
)
for (const r of rows.slice(0, top)) {
  console.log(
    `${(r.name + (r.isProduction ? '  <- production' : '')).padEnd(30)} ${pct(r.average)} ${pct(r.grammar)} ${pct(r.vocabulary)} ${pct(r.caseMarking)} ${usd(r.input)} ${usd(r.output)}`,
  )
}
