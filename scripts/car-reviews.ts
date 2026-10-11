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
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { google } from '@ai-sdk/google'
import { generateText, stepCountIs, type LanguageModelUsage } from 'ai'

import cars, { type Car } from '@/modules/data/cars'
import { similarTo } from '@/modules/detail/similar'
import { carSlug } from '@/modules/data/getCarId'
import carReviews, { type CarReview } from '@/modules/data/carReviews'
import {
  readReview,
  reviewFactsKey,
  reviewPrompt,
} from '@/modules/detail/reviewPrompt'
import { advisorModel } from '@/app/api/chat/model'
import { createFetchCarDetailsTool } from '@/app/api/chat/tools/fetchCarDetails'

const file = path.join(__dirname, '../modules/data/carReviews.ts')

// Written once per car and kept, so it can afford to think far longer than
// the chat, whose every answer waits on its thinking
const thinkingLevel = 'high'
const CONCURRENCY = 4
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

const write = async (
  car: Car,
): Promise<{ review: CarReview; usage: LanguageModelUsage }> => {
  const { system, prompt } = reviewPrompt(car)
  const result = await generateText({
    model: google(advisorModel),
    system,
    prompt,
    // Only its own page and its similar cars', for how they differ in size,
    // space and towing: the model picks the URL it fetches
    tools: {
      fetchCarDetails: createFetchCarDetailsTool(
        new Set(
          [car, ...similarTo(car)].flatMap((one) => one.evDatabaseUrl ?? []),
        ),
      ),
    },
    // A step for each car looked up, should it look them up one at a time,
    // and one to write
    stopWhen: stepCountIs(6),
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

const worker = async () => {
  for (let car = queue.shift(); car; car = queue.shift()) {
    const slug = carSlug(car)
    const started = Date.now()
    try {
      const { review, usage } = await write(car)
      reviews.set(slug, review)
      save()
      done++
      // What it was billed for, every step and lookup included
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
  console.log(`Writing ${due.length} reviews, ${CONCURRENCY} at a time`)
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
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
