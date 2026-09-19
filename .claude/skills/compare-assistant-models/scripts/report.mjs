// One table per question: does it break the contract, how fast, what does it
// cost, and does a blind judge prefer it to the incumbent.
//   --monthly 500     replies per month, for a projected monthly cost
import path from 'node:path'
import { OUT, PRODUCTION, readJSONL } from './lib.mjs'
import { check } from './checks.mjs'

const args = process.argv.slice(2)
const monthly = Number(args[args.indexOf('--monthly') + 1]) || undefined
// A retried call leaves its failed attempt in the log; only the latest counts
const runs = [
  ...new Map(
    readJSONL(path.join(OUT, 'runs.jsonl')).map((r) => [
      `${r.model}|${r.promptId}|${r.sample}`,
      r,
    ]),
  ).values(),
]
const judgments = readJSONL(path.join(OUT, 'judgments.jsonl'))
const pricing = Object.fromEntries(
  (
    await (await fetch('https://ai-gateway.vercel.sh/v1/models')).json()
  ).data.map((m) => [m.id, m.pricing]),
)

const median = (xs) =>
  xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : NaN
const mean = (xs) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : '-')

const cost = (model, usage = {}) => {
  const p = pricing[model.split('@')[0]]
  if (!p) return NaN
  const cached =
    usage.inputTokenDetails?.cacheReadTokens ?? usage.cachedInputTokens ?? 0
  const input = (usage.inputTokens ?? 0) - cached
  return (
    input * Number(p.input) +
    cached * Number(p.input_cache_read ?? p.input) +
    (usage.outputTokens ?? 0) * Number(p.output)
  )
}

const models = [...new Set(runs.map((r) => r.model))]
const rows = models.map((model) => {
  const mine = runs.filter((r) => r.model === model)
  const ok = mine.filter((r) => !r.error)
  const checked = ok.map((r) => ({ run: r, ...check(r) }))
  const failed = Object.fromEntries(
    Object.keys(checked[0]?.hard ?? {}).map((k) => [
      k,
      checked.filter((c) => !c.hard[k]).length,
    ]),
  )
  const perCall = mean(ok.map((r) => cost(model, r.usage)))
  return {
    model,
    calls: mine.length,
    errors: mine.length - ok.length,
    checked,
    failed,
    perCall,
    ttft: median(ok.map((r) => r.ttftMs).filter((x) => x >= 0)),
    total: median(ok.map((r) => r.totalMs)),
    out: mean(ok.map((r) => r.usage?.outputTokens ?? NaN)),
    tools: mean(ok.map((r) => (r.toolCalls ?? []).length)),
    priceNotInList: mean(checked.map((c) => c.soft.priceNotInList)),
  }
})

console.log('\nCOST AND SPEED (per reply, prices from the AI Gateway list)')
console.log(
  [
    'model'.padEnd(36),
    'n'.padStart(3),
    'err'.padStart(3),
    'ttft ms'.padStart(8),
    'total ms'.padStart(9),
    'out tok'.padStart(8),
    '$/reply'.padStart(9),
    'x incumb.'.padStart(9),
    monthly ? `$/mo@${monthly}`.padStart(10) : '',
  ].join(' '),
)
const base = rows.find((r) => r.model === PRODUCTION)?.perCall
for (const r of rows)
  console.log(
    [
      r.model.padEnd(36),
      String(r.calls - r.errors).padStart(3),
      String(r.errors).padStart(3),
      String(r.ttft).padStart(8),
      String(r.total).padStart(9),
      String(Math.round(r.out)).padStart(8),
      r.perCall.toFixed(4).padStart(9),
      (r.perCall / base).toFixed(1).padStart(9),
      monthly ? (r.perCall * monthly).toFixed(2).padStart(10) : '',
    ].join(' '),
  )

console.log('\nHARD CHECKS (share of replies that fail; 0% is the goal)')
const checkNames = Object.keys(rows[0]?.failed ?? {})
console.log(
  [
    'model'.padEnd(36),
    ...checkNames.map((c) => c.slice(0, 11).padStart(11)),
  ].join(' '),
)
for (const r of rows)
  console.log(
    [
      r.model.padEnd(36),
      ...checkNames.map((c) => pct(r.failed[c], r.checked.length).padStart(11)),
    ].join(' '),
  )
console.log(
  'avg prices per reply that are not in the car list (soft, includes legitimate differences):',
  rows
    .map((r) => `${r.model.split('/')[1]} ${r.priceNotInList.toFixed(2)}`)
    .join(', '),
)

if (judgments.length) {
  console.log(
    '\nBLIND JUDGE vs INCUMBENT (win rate counts a tie as half; 95% interval is a normal approximation)',
  )
  console.log(
    [
      'candidate'.padEnd(36),
      'judge'.padEnd(30),
      'n'.padStart(3),
      'win'.padStart(4),
      'tie'.padStart(4),
      'loss'.padStart(4),
      'rate'.padStart(6),
      '95% CI'.padStart(12),
      'is.err c/i'.padStart(11),
      'fact.err c/i'.padStart(13),
    ].join(' '),
  )
  const groups = new Map()
  for (const j of judgments)
    for (const key of [
      `${j.candidate}|${j.judge}`,
      `${j.candidate}|ALL JUDGES`,
    ])
      groups.set(key, [...(groups.get(key) ?? []), j])
  for (const [key, js] of [...groups].sort()) {
    const [candidate, judge] = key.split('|')
    const w = js.filter((j) => j.winner === 'candidate').length
    const t = js.filter((j) => j.winner === 'tie').length
    const l = js.length - w - t
    const rate = (w + t / 2) / js.length
    const half = 1.96 * Math.sqrt((rate * (1 - rate)) / js.length)
    console.log(
      [
        candidate.padEnd(36),
        judge.padEnd(30),
        String(js.length).padStart(3),
        String(w).padStart(4),
        String(t).padStart(4),
        String(l).padStart(4),
        `${Math.round(rate * 100)}%`.padStart(6),
        `${Math.round((rate - half) * 100)}-${Math.round(Math.min(1, rate + half) * 100)}%`.padStart(
          12,
        ),
        `${mean(js.map((j) => j.candidateIcelandicErrors)).toFixed(1)}/${mean(js.map((j) => j.incumbentIcelandicErrors)).toFixed(1)}`.padStart(
          11,
        ),
        `${mean(js.map((j) => j.candidateFactualErrors)).toFixed(1)}/${mean(js.map((j) => j.incumbentFactualErrors)).toFixed(1)}`.padStart(
          13,
        ),
      ].join(' '),
    )
  }
}
