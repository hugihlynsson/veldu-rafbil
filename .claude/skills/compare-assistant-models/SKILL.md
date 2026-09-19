---
name: compare-assistant-models
description: Decide whether the chat advisor should run on a different model or thinking level, by replaying real visitor conversations through candidates and comparing format, cost, speed and Icelandic quality. Use when asked whether a better or cheaper model exists, before changing the model in app/api/chat/route.ts, or to re-check the current one.
---

# Comparing models for the chat advisor

Read the "Chat advisor" section of `AGENTS.md` first: the advisor answers only in
Icelandic, so the model is picked on Icelandic performance, weighed against cost
and speed. This is the process for finding out, with the scripts to do it in
`scripts/`. What production runs today (model and thinking level) is read from
`app/api/chat/route.ts`; nothing here keeps a second copy.

The scripts need Node 22.22 or later with the provider keys in the environment.
Everything below runs from the repo root as

```bash
node --env-file=.env.local --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
  .claude/skills/compare-assistant-models/scripts/<script>.mjs [flags]
```

`.env.local` needs `GOOGLE_GENERATIVE_AI_API_KEY`, and `OPENAI_API_KEY` and
`ANTHROPIC_API_KEY` for candidates from those. Scripts say which key is missing.

Everything they write goes to `.model-eval/` at the repo root, which is
gitignored **because it holds real visitors' questions**. Keep exports and runs
out of commits, issues and pull request descriptions.

## The steps

1. **Shortlist** with `shortlist.mjs`: the Miðeind leaderboard beside each
   model's price, production marked. The leaderboard entries were run at their
   own (mostly high) reasoning settings and production runs lower, so it earns a
   model a place on the list and nothing more. Weigh score against price _and_
   speed; a frontier model that is 10× the price and several times slower has to
   be clearly better to matter on a free public chat.
2. **Get the conversations.** Export the `veldu-rafbil-assistant` dataset from
   Axiom as CSV, the `chat_response_finished` events, with `_time`,
   `userMessage`, `assistantResponse` and `messageCount`. Then
   `build-dataset.mjs <export.csv>` makes the prompt set.
   - A row is only the _last_ user message and the reply that was logged; there
     is no session id. First messages replay exactly. A later turn is rebuilt
     only when the visitor clicked one of the `[q:]` suggestions, because that
     text matches a parent reply exactly. Typed follow-ups have no provable
     parent and are dropped, not guessed.
   - Expect a small set (the first run had about 60 replayable prompts from a
     month of logs). Its size sets what you can conclude: at around 60 prompts,
     a win rate has to be roughly 65% or better before it is distinguishable
     from a coin flip. It can rule out a clearly worse model, not rank close
     ones.
3. **Baseline for free.** `check-logged.mjs` runs the mechanical checks over the
   replies already in the export, so you know how often production itself breaks
   the rules the prompt states. Those replies were written against the car list
   of the day, so the price check can flag them once prices have moved.
4. **Pick the thinking levels** with `probe-levels.mjs`. Levels differ per model
   (the Gemini Flash models reject `minimal`, the OpenAI ones have `none`), and
   "low" is an adaptive budget, not a fixed one: the same model spends anywhere
   from nothing to hundreds of reasoning tokens on the same question, so judge a
   level on averages over the whole set. Put the grid in `scripts/models.json`
   as `provider/model@level` and keep only levels the probe accepted.
5. **Replay** with `run.mjs`. Use `--dry-run` first for the cost, then
   `--limit 3 --models <one>` as a smoke test, then the lot. It sends the real
   system prompt (cut out of the route, see below), the real tool and the
   route's own settings, and it resumes: finished calls are skipped, so re-run
   to retry failures. OpenAI rate-limits a 15k-token prompt at about six calls
   in parallel; use `--concurrency 2` for those.
6. **Screen mechanically** with `report.mjs`. It puts cost, first-token and total
   time, and the hard checks (`checks.mjs`) side by side. For the Flash-class
   models tried, thinking mostly cost time rather than money, and it changed
   format compliance: a model that breaks the table-width rule at low effort can
   stop at higher effort, which is worth weighing against a prompt fix. Anything
   failing hard checks or far slower than the alternatives is out before it
   costs a judge call.
7. **Judge the survivors only** with `judge.mjs --only <list>`: blind pairwise
   against production, order randomised, the judge never a model from the
   candidate's own vendor. Judging is the expensive step, and the car list leads
   the prompt so it caches. Read the result with these in mind:
   - **The judge must see the whole system prompt, not just the car list.** A
     first attempt gave it only the list and the judges called the grant note the
     prompt tells the bot to write an "invention", in about a fifth of all
     verdicts, which favoured whichever model mentioned the grant least. If the
     rubric changes, check the judges' stated reasons for this kind of error
     before trusting a number.
   - In the first run, two judges from different vendors agreed on only about
     60% of prompts (with the flawed setup above, so it may be better now).
     Treat single verdicts as noise, report per judge, and read the intervals.
   - A win can be a format win (the other reply broke a rule the rubric
     penalises). Split by that before crediting the model.
8. **Read some yourself** with `export-blind.mjs`: 15 questions, six shuffled
   replies each, models hidden until you reveal. It is plain HTML and CSS with
   no scripts on purpose, because the desktop app opens local files as static
   snapshots with JavaScript off. Someone who reads Icelandic is a better judge
   of it than either model, so their picks decide a close call.

## Switching

- In `route.ts`, change `modelName` and, if it is still a Gemini model,
  `thinkingLevel`. A different provider needs its `@ai-sdk/*` package as a real
  dependency (the OpenAI and Anthropic ones are dev-only today, for this
  harness) and a different `providerOptions`; the `thinkingConfig` there is
  Google-specific.
- Update the comment on `modelName` with what you found, as `AGENTS.md` asks:
  the numbers, the sample size, and what would make you re-check.
- The harness cuts the prompt and the model settings out of `route.ts` as text,
  because a route file can only export handlers. `scripts/extract-prompt.test.mjs`
  fails when an edit to the route breaks that; fix `extract-prompt.mjs`.

## Traps

- **Do not compare across runs made against different car lists or prompts.**
  Re-run production in the same batch as the candidates.
- **Latency is measured with parallel calls**, so it is comparable between
  variants and not an absolute number.
- **Replays send only the logged history**, which is production's own earlier
  replies, not the candidate's. That is deliberate, and it is a small bias
  towards the style production already used.
- **A judge from a candidate's own vendor may flatter it.** The script skips
  those pairs; do not work around it.
