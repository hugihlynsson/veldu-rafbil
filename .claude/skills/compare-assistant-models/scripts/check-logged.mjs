// Free sanity run: apply the mechanical checks to the replies already in the export
import path from 'node:path'
import { OUT, readJSON } from './lib.mjs'
import { check } from './checks.mjs'
const prompts = readJSON(path.join(OUT, 'prompts.json'))
const fails = {}
const examples = {}
for (const p of prompts) {
  const c = check({ text: p.logged, toolCalls: [] })
  for (const [k, ok] of Object.entries(c.hard))
    if (!ok) {
      fails[k] = (fails[k] ?? 0) + 1
      ;(examples[k] ??= []).push(p.id)
    }
}
console.log(`${prompts.length} logged replies; failures per hard check:`, fails)
console.log(examples)
