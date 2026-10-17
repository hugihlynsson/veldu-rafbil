/**
 * Writes modules/data/carReviews.ts: the review on each car's page, written
 * by the advisor's model from the prompt in modules/detail/reviewPrompt.ts.
 *
 *   npx tsx --env-file=.env.local scripts/car-reviews.ts           the missing and out-of-date ones
 *   npx tsx --env-file=.env.local scripts/car-reviews.ts <slug>…   these, afresh
 *   npx tsx --env-file=.env.local scripts/car-reviews.ts --all     every one, afresh
 *
 * A review kept is kept as it is, so one edited by hand survives a run until
 * its car's figures change. Each one written is a billed request that thinks
 * for a minute or more, so a few are written at once, and the file is saved
 * after each, so a run cut short keeps what it finished.
 *
 * Every car's ev-database page is read first, whichever are written: where a
 * car stands on boot space or towing is among all of them.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { google } from '@ai-sdk/google'
import { generateText, type LanguageModelUsage } from 'ai'

import cars, { type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import carReviews, { type CarReview } from '@/modules/data/carReviews'
import {
  readDetails,
  readReview,
  reviewFactsKey,
  reviewPrompt,
  type CarDetails,
  type DetailsOf,
} from '@/modules/detail/reviewPrompt'
import { advisorModel } from '@/app/api/chat/model'
import { fetchCarSpecs } from '@/app/api/chat/tools/fetchCarDetails'

const file = path.join(__dirname, '../modules/data/carReviews.ts')

// Written once per car and kept, so it can think longer than the chat, whose
// every answer waits on its thinking. Medium rather than high: the gaps and
// standings are worked out in code, and high spent about twice the tokens
// and time on thinking for reviews no better to read
const thinkingLevel = 'medium'
const CONCURRENCY = 4
// Pages from ev-database at once, which is no one's to hammer
const PAGE_CONCURRENCY = 6
// The prompt asks for some 150 words: far fewer is an answer that stopped
const MIN_WORDS = 70

const args = process.argv.slice(2)
const all = args.includes('--all')
const named = new Set(args.filter((arg) => !arg.startsWith('--')))

const unknown = [...named].filter(
  (slug) => !cars.some((car) => carSlug(car) === slug),
)
if (unknown.length > 0) {
  throw new Error(`No car on the list has the slug ${unknown.join(', ')}`)
}

const due = cars.filter((car) => {
  const slug = carSlug(car)
  if (named.size > 0) return named.has(slug)
  return (
    all || !carReviews[slug] || carReviews[slug].facts !== reviewFactsKey(car)
  )
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
// enough that a car's boot or towing went unsaid where it stood out
const readAllDetails = async (): Promise<DetailsOf> => {
  const urls = [...new Set(cars.flatMap((car) => car.evDatabaseUrl ?? []))]
  const read = new Map<string, CarDetails>()
  const pending = [...urls]
  const reader = async () => {
    for (let url = pending.shift(); url; url = pending.shift()) {
      const specs = await fetchCarSpecs(url).catch(() => null)
      if (specs) read.set(url, readDetails(specs))
      else console.error(`Could not read ${url}`)
    }
  }
  await Promise.all(Array.from({ length: PAGE_CONCURRENCY }, reader))
  console.log(`Read ${read.size} of ${urls.length} ev-database pages`)
  return (car) => (car.evDatabaseUrl ? read.get(car.evDatabaseUrl) : undefined)
}

const write = async (
  car: Car,
  details: DetailsOf,
): Promise<{ review: CarReview; usage: LanguageModelUsage }> => {
  const { system, prompt } = reviewPrompt(car, details)
  const result = await generateText({
    model: google(advisorModel),
    system,
    prompt,
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel } },
    },
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
  return {
    review: {
      paragraphs,
      facts: reviewFactsKey(car),
      model: `${advisorModel}, thinking ${thinkingLevel}`,
    },
    usage: result.totalUsage,
  }
}

const queue = [...due]
const failed: string[] = []
let done = 0

const worker = async (details: DetailsOf) => {
  for (let car = queue.shift(); car; car = queue.shift()) {
    const slug = carSlug(car)
    const started = Date.now()
    try {
      const { review, usage } = await write(car, details)
      reviews.set(slug, review)
      save()
      done++
      // What it was billed for, thinking included
      console.log(
        `${done}/${due.length} ${slug} (${Math.round((Date.now() - started) / 1000)} s, ${usage.inputTokens} tokens in, ${usage.outputTokens} out of which ${usage.outputTokenDetails.reasoningTokens ?? 0} thinking)`,
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
  console.log(`Writing ${due.length} reviews, ${CONCURRENCY} at a time`)
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
