/**
 * Writes modules/data/carReviews.ts: the review on each car's page, and the
 * questions its chat offers to start on, written by the advisor's model from
 * the prompts in scripts/reviewPrompt.ts.
 *
 *   npx tsx --env-file=.env.local scripts/car-reviews.ts           the missing and out-of-date ones, if only a few
 *   npx tsx --env-file=.env.local scripts/car-reviews.ts --due     the missing and out-of-date ones, however many
 *   npx tsx --env-file=.env.local scripts/car-reviews.ts <slug>…   these, afresh
 *   npx tsx --env-file=.env.local scripts/car-reviews.ts --all     every one, afresh
 *   npx tsx --env-file=.env.local scripts/car-reviews.ts --questions [<slug>…]
 *                                                                  only the questions, keeping the reviews
 *
 * The questions are written from the review, so a review written afresh gets
 * new ones, and a review kept without any gets them on the next run.
 *
 * A review kept is kept as it is, so one edited by hand survives a run until
 * its car's figures change. Each one written is a billed request that thinks
 * for a minute or more, so a few are written at once, and the file is saved
 * after each, so a run cut short keeps what it finished.
 *
 * Every car's ev-database page is read first, whichever are written: where a
 * car stands on boot space or towing is among all of them. Pages read in the
 * last month are taken from ~/.cache/veldu-rafbil instead.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  openai,
  type OpenAILanguageModelResponsesOptions,
} from '@ai-sdk/openai'
import { generateText, type LanguageModelUsage } from 'ai'

import cars, { type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import carReviews, { type CarReview } from '@/modules/data/carReviews'
import {
  questionsPrompt,
  QUESTION_COUNT,
  readDetails,
  readQuestions,
  readReview,
  reviewFactsKey,
  reviewPrompt,
  type DetailsOf,
} from './reviewPrompt'
import { advisorModel } from '@/modules/chat/model'
import {
  allowedURLs,
  fetchOnSite,
  readCapped,
  readCarSpecs,
} from '@/modules/data/evDatabase'
import { pagesToRead, type PageCache } from './evDatabaseCache'

const file = path.join(__dirname, '../modules/data/carReviews.ts')

// Medium rather than high: the gaps and standings are worked out in code, and
// on Gemini 3.8 Flash high spent about twice the tokens and time on thinking
// for reviews no better to read
const reasoningEffort = 'medium'
const CONCURRENCY = 4
// Pages from ev-database at once, which is no one's to hammer
const PAGE_CONCURRENCY = 6
// The prompt asks for some 150 words: far fewer is an answer that stopped
const MIN_WORDS = 70
// Asked for QUESTION_COUNT: a few too long for a pill are left out, more is
// a prompt the model is not following
const MIN_QUESTIONS = QUESTION_COUNT - 2
// On Gemini 3.8 Flash, low left an ungrammatical question in about one car in
// five, and a question costs a fraction of its review either way
const questionsReasoningEffort = 'medium'

const options = (
  effort: OpenAILanguageModelResponsesOptions['reasoningEffort'],
) => ({
  openai: {
    reasoningEffort: effort,
    reasoningSummary: null,
  } satisfies OpenAILanguageModelResponsesOptions,
})
// A car added or repriced puts itself and a few neighbours out of date. A
// change to the grant puts nearly every one, at a billed minute each, and a
// run that size is asked for with --due rather than walked into
const MAX_UNASKED = 8
// Below this share of pages read, the reviews would be written blind to
// boot space and towing, and paid for all the same
const MIN_PAGES_READ = 0.9

// Outside the checkout, so every worktree of it shares one
const cacheFile = path.join(
  os.homedir(),
  '.cache/veldu-rafbil/ev-database.json',
)

const readCache = (): PageCache => {
  try {
    return JSON.parse(readFileSync(cacheFile, 'utf8')) as PageCache
  } catch {
    return {}
  }
}

const saveCache = (cache: PageCache) => {
  mkdirSync(path.dirname(cacheFile), { recursive: true })
  writeFileSync(cacheFile, JSON.stringify(cache))
}

const args = process.argv.slice(2)
const all = args.includes('--all')
const allDue = args.includes('--due')
const onlyQuestions = args.includes('--questions')
const named = new Set(args.filter((arg) => !arg.startsWith('--')))

const unknown = [...named].filter(
  (slug) => !cars.some((car) => carSlug(car) === slug),
)
if (unknown.length > 0) {
  throw new Error(`No car on the list has the slug ${unknown.join(', ')}`)
}

const due = onlyQuestions
  ? []
  : cars.filter((car) => {
      const slug = carSlug(car)
      if (named.size > 0) return named.has(slug)
      return (
        all ||
        !carReviews[slug] ||
        carReviews[slug].facts !== reviewFactsKey(car)
      )
    })

if (named.size === 0 && !all && !allDue && due.length > MAX_UNASKED) {
  throw new Error(
    `${due.length} reviews are due, more than a car or two changing explains. Name the ones to write, or pass --due to write them all:\n${due.map(carSlug).join(' ')}`,
  )
}

// Kept reviews whose questions are written on their own
const questionsDue = cars.filter((car) => {
  const slug = carSlug(car)
  const review = carReviews[slug]
  if (!review || due.includes(car)) return false
  if (onlyQuestions) return named.size === 0 || named.has(slug)
  return !review.questions?.length
})

// Every car on the list, in its order; a car no longer on it drops out
const reviews = new Map(
  cars.flatMap((car) => {
    const review = carReviews[carSlug(car)]
    return review ? [[carSlug(car), review] as const] : []
  }),
)

const save = ({ format = false } = {}) => {
  const entries = cars.flatMap((car) => {
    const review = reviews.get(carSlug(car))
    return review ? [`  '${carSlug(car)}': ${JSON.stringify(review)},`] : []
  })
  writeFileSync(
    file,
    `// The review on each car's page, by slug. Written by scripts/car-reviews.ts,
// and read in the pull request like any other change to the data: an entry
// can be edited by hand, and a run keeps it until its car's figures change.
// carReviews.test.ts fails while a car has none, or one out of date.

export interface CarReview {
  paragraphs: ReadonlyArray<string>
  /** Questions to start the page's chat on, written from the review */
  questions: ReadonlyArray<string>
  /** The figures it was written from, as reviewFactsKey hashes them */
  facts: string
  /** The model that wrote it, and how hard it thought; none for one written by hand */
  model?: string
}

const carReviews: Readonly<Record<string, CarReview>> = {
${entries.join('\n')}
}

export default carReviews
`,
  )
  // Once at the end rather than after each review, as it starts npx
  if (format) execFileSync('npx', ['oxfmt', file], { stdio: 'ignore' })
}

// Read here rather than looked up by the model, which skipped them often
// enough that a car's boot or towing went unsaid where it stood out. Kept
// between runs, and between worktrees, so a run reads only what changed
const readAllDetails = async (): Promise<DetailsOf> => {
  const urls = [...new Set(cars.flatMap((car) => car.evDatabaseUrl ?? []))]
  const cache = readCache()
  const pending = pagesToRead(urls, cache, Date.now())
  let limited = false
  const reader = async () => {
    for (let url = pending.shift(); url && !limited; url = pending.shift()) {
      const response = allowedURLs.has(url)
        ? await fetchOnSite(url).catch(() => null)
        : null
      // Every page after the first 429 would be one too, and asking only
      // keeps the block going
      if (response?.status === 429) limited = true
      if (!response?.ok) {
        await response?.body?.cancel()
        if (!limited) console.error(`Could not read ${url}`)
        continue
      }
      const specs = readCarSpecs(url, await readCapped(response))
      cache[url] = { specs, read: Date.now() }
      saveCache(cache)
    }
  }
  await Promise.all(Array.from({ length: PAGE_CONCURRENCY }, reader))
  const read = new Map(
    urls.flatMap((url) => {
      const page = cache[url]
      return page ? [[url, readDetails(page.specs)] as const] : []
    }),
  )
  console.log(
    `Have ${read.size} of ${urls.length} ev-database pages${limited ? '; it answered 429, so the rest wait for a later run' : ''}`,
  )
  if (read.size < urls.length * MIN_PAGES_READ) {
    throw new Error(
      `Too few ev-database pages to write reviews from. Those read are kept in ${cacheFile}; run again once it stops rate limiting`,
    )
  }
  return (car) => (car.evDatabaseUrl ? read.get(car.evDatabaseUrl) : undefined)
}

const write = async (
  car: Car,
  details: DetailsOf,
): Promise<{ review: CarReview; usage: LanguageModelUsage }> => {
  const { system, prompt } = reviewPrompt(car, details)
  const result = await generateText({
    model: openai(advisorModel),
    system,
    prompt,
    providerOptions: options(reasoningEffort),
    maxOutputTokens: 16_384,
    abortSignal: AbortSignal.timeout(300_000),
  })

  // An answer cut off by its token limit would otherwise be kept half written
  if (result.finishReason !== 'stop') {
    throw new Error(`it ended with ${result.finishReason}`)
  }
  const paragraphs = readReview(result.text)
  if (!paragraphs || paragraphs.join(' ').split(/\s+/).length < MIN_WORDS) {
    throw new Error(`it is too short: ${result.text}`)
  }
  const review = {
    paragraphs,
    questions: [],
    facts: reviewFactsKey(car),
    model: `${advisorModel}, thinking ${reasoningEffort}`,
  }
  const questions = await writeQuestions(car, review)
  return {
    review: { ...review, questions: questions.questions },
    usage: addUsage(result.totalUsage, questions.usage),
  }
}

const writeQuestions = async (
  car: Car,
  review: CarReview,
): Promise<{ questions: string[]; usage: LanguageModelUsage }> => {
  const { system, prompt } = questionsPrompt(car, review)
  const result = await generateText({
    model: openai(advisorModel),
    system,
    prompt,
    providerOptions: options(questionsReasoningEffort),
    // The thinking counts toward it, and once took all of 8.192
    maxOutputTokens: 16_384,
    abortSignal: AbortSignal.timeout(120_000),
  })

  if (result.finishReason !== 'stop') {
    throw new Error(`its questions ended with ${result.finishReason}`)
  }
  const questions = readQuestions(result.text)
  if (questions.length < MIN_QUESTIONS) {
    throw new Error(`it has too few questions: ${result.text}`)
  }
  return { questions, usage: result.totalUsage }
}

const addUsage = (
  a: LanguageModelUsage,
  b: LanguageModelUsage,
): LanguageModelUsage => ({
  ...a,
  inputTokens: (a.inputTokens ?? 0) + (b.inputTokens ?? 0),
  outputTokens: (a.outputTokens ?? 0) + (b.outputTokens ?? 0),
  outputTokenDetails: {
    ...a.outputTokenDetails,
    reasoningTokens:
      (a.outputTokenDetails.reasoningTokens ?? 0) +
      (b.outputTokenDetails.reasoningTokens ?? 0),
  },
})

const queue = [...due, ...questionsDue]
const failed: string[] = []
let done = 0

const worker = async (details: DetailsOf) => {
  for (let car = queue.shift(); car; car = queue.shift()) {
    const slug = carSlug(car)
    const started = Date.now()
    try {
      const kept = reviews.get(slug)
      const { review, usage } = due.includes(car)
        ? await write(car, details)
        : await writeQuestions(car, kept!).then(({ questions, usage }) => ({
            review: { ...kept!, questions },
            usage,
          }))
      reviews.set(slug, review)
      save()
      done++
      // What it was billed for, thinking included
      console.log(
        `${done}/${due.length + questionsDue.length} ${slug} (${Math.round((Date.now() - started) / 1000)} s, ${usage.inputTokens} tokens in, ${usage.outputTokens} out of which ${usage.outputTokenDetails.reasoningTokens ?? 0} thinking)`,
      )
    } catch (error) {
      failed.push(slug)
      console.error(`${slug} failed:`, error)
    }
  }
}

// Not a top-level await, which tsx runs this module without
const main = async () => {
  const details = due.length > 0 ? await readAllDetails() : () => undefined
  console.log(
    `Writing ${due.length} reviews and questions for ${questionsDue.length} more, ${CONCURRENCY} at a time`,
  )
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(details)))
  // Saved even with nothing written, to drop the cars no longer on the list
  save({ format: true })
  console.log(
    `Wrote ${done} to ${path.relative(process.cwd(), file)}${failed.length ? `; failed: ${failed.join(' ')}` : ''}`,
  )
  // So whoever runs it, a person or the update-new-cars skill, sees a partial run
  if (failed.length > 0) process.exitCode = 1
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
