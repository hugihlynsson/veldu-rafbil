// A page for reading replies yourself, model names hidden. No JavaScript: the
// viewer that shows local files runs it as a static snapshot, so everything is
// pre-rendered and the reveal and tally are CSS (checkbox + :has + counters).
//   --every 4          one prompt in every N (default 4)
//   --models <list>    up to five variants to show beside production
import path from 'node:path'
import { writeFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { OUT, HERE, PRODUCTION, readJSON, readJSONL } from './lib.mjs'

const args = process.argv.slice(2)
const every = Number(args[args.indexOf('--every') + 1]) || 4
const config = readJSON(path.join(HERE, 'models.json'))
// Six is what fits on a page; production is always one of them
const named =
  args.indexOf('--models') >= 0
    ? args[args.indexOf('--models') + 1].split(',')
    : config.candidates
const shown = [PRODUCTION, ...named.filter((m) => m !== PRODUCTION)].slice(0, 6)
const short = (model) =>
  model
    .replace('google/gemini-', 'Gemini ')
    .replace('openai/gpt-', 'GPT-')
    .replace('@', ' · ')
const esc = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
const markdown = (text) =>
  renderToStaticMarkup(
    React.createElement(Markdown, { remarkPlugins: [remarkGfm] }, text),
  )

const prompts = readJSON(path.join(OUT, 'prompts.json')).filter(
  (_, i) => i % every === 0,
)
const runs = new Map(
  readJSONL(path.join(OUT, 'runs.jsonl'))
    .filter((r) => !r.error)
    .map((r) => [`${r.model}|${r.promptId}`, r]),
)

// Same prompt, same shuffle, so regenerating the page keeps the letters stable
const seeded = (seed) => {
  let h = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 17)
  return () => (h = (h * 1664525 + 1013904223) >>> 0) / 2 ** 32
}

const questions = prompts.map((prompt, n) => {
  const random = seeded(prompt.id)
  const order = shown
    .filter((model) => runs.has(`${model}|${prompt.id}`))
    .map((model) => [random(), model])
    .sort((a, b) => a[0] - b[0])
    .map(([, model]) => model)
  const history = prompt.messages.slice(0, -1)
  const cards = order.map(
    (model, i) => `
    <div class="card" data-m="m${shown.indexOf(model)}">
      <label><input type="radio" name="${prompt.id}"> <b>${'ABCDEF'[i]}</b> <span class="model">${esc(short(model))}</span></label>
      <div class="md">${markdown(runs.get(`${model}|${prompt.id}`).text)}</div>
    </div>`,
  )
  return `
  <section class="q">
    <h2>${n + 1}. ${esc(prompt.messages.at(-1).text)}</h2>
    ${history.length ? `<div class="history">Earlier in the chat: ${history.map((m) => `${m.role === 'user' ? 'Visitor' : 'Bot'}: ${esc(m.text.slice(0, 160))}`).join(' | ')}</div>` : ''}
    <div class="grid">${cards.join('')}</div>
  </section>`
})

const counters = shown.map((_, i) => `m${i}`).join(' ')
const counterRules = shown
  .map(
    (_, i) =>
      `.card[data-m="m${i}"]:has(input:checked) { counter-increment: m${i}; } .tally .m${i}::after { content: counter(m${i}); }`,
  )
  .join('\n  ')

const html = `<!doctype html>
<html lang="is"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Blind review</title>
<style>
  :root { color-scheme: light dark; --bg:#fff; --fg:#1b1b1b; --muted:#666; --line:#ddd; --card:#f7f7f8; --accent:#0a7d5a; }
  @media (prefers-color-scheme: dark) { :root { --bg:#141414; --fg:#eaeaea; --muted:#9a9a9a; --line:#333; --card:#1d1d1f; --accent:#4cc9a0; } }
  body { background:var(--bg); color:var(--fg); font:15px/1.5 system-ui,sans-serif; margin:0 auto; max-width:1180px; padding:16px; counter-reset: ${counters}; }
  #reveal { position:absolute; opacity:0; pointer-events:none }
  h1 { font-size:20px; margin:0 } .muted { color:var(--muted) }
  header { position:sticky; top:0; background:var(--bg); padding:8px 0; border-bottom:1px solid var(--line); z-index:5; display:flex; gap:14px; align-items:center; flex-wrap:wrap }
  .btn { padding:6px 12px; border:1px solid var(--line); background:var(--card); border-radius:6px; cursor:pointer; user-select:none }
  #reveal:checked ~ header .btn { border-color:var(--accent); color:var(--accent) }
  #reveal:focus-visible ~ header .btn { outline:2px solid var(--accent) }
  section.q { margin:28px 0 } section.q > h2 { font-size:16px; margin:0 0 4px }
  .history { color:var(--muted); font-size:13px; margin-bottom:8px }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:12px }
  .card { background:var(--card); border:1px solid var(--line); border-radius:8px; padding:10px 12px; overflow-x:auto }
  .card:has(input:checked) { border-color:var(--accent); box-shadow:0 0 0 2px var(--accent) inset }
  .card label { display:flex; gap:8px; align-items:center; cursor:pointer; margin-bottom:6px }
  .model { display:none; color:var(--accent); font-size:12px } #reveal:checked ~ main .model { display:inline }
  .card table { border-collapse:collapse; font-size:13px } .card th,.card td { border:1px solid var(--line); padding:3px 6px }
  .md p { margin:6px 0 } .md ul { margin:6px 0; padding-left:20px } .md h1,.md h2,.md h3 { font-size:15px; margin:8px 0 4px }
  .tally { display:none; margin:32px 0; padding:12px 16px; border:1px solid var(--line); border-radius:8px }
  #reveal:checked ~ main .tally { display:block }
  .tally td { padding:2px 24px 2px 0 } .tally td:last-child { font-weight:700; font-variant-numeric:tabular-nums }
  ${counterRules}
</style></head><body>
<input type="checkbox" id="reveal">
<header><h1>Blind review</h1><label class="btn" for="reveal">Reveal models + tally</label><span class="muted">Your picks by model are at the bottom once revealed</span></header>
<main>
<p class="muted">Pick the reply you would rather show a visitor. Weigh wrong facts and bad Icelandic most. Letters are shuffled per question.</p>
${questions.join('\n')}
<div class="tally"><b>Your picks by model</b>
  <table>${shown.map((m, i) => `<tr><td>${esc(short(m))}${m === PRODUCTION ? ' (production)' : ''}</td><td class="m${i}"></td></tr>`).join('')}</table>
</div>
</main>
</body></html>`

const file = path.join(OUT, 'blind-review.html')
writeFileSync(file, html)
console.log(
  `${questions.length} questions x ${shown.length} replies -> ${file} (${Math.round(html.length / 1024)} KB, no scripts)`,
)
