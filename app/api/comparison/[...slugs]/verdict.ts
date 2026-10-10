import { google } from '@ai-sdk/google'
import { stepCountIs, streamText, type LanguageModelUsage } from 'ai'
import { unstable_cache } from 'next/cache'
import { after } from 'next/server'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import type { Verdict, VerdictEvent } from '@/modules/compare/verdictEvents'
import { advisorModel } from '@/app/api/chat/model'
import { createFetchCarDetailsTool } from '@/app/api/chat/tools/fetchCarDetails'
import { deployment, logAfterResponse } from '@/app/api/publicEndpoint'
import { readVerdict, verdictFacts, verdictSystemPrompt } from './prompt'

// The deploy is part of every key, so a verdict lasts as long as the car data
// and the prompt it was written from, and is written afresh by the next deploy
const build =
  process.env.VERCEL_DEPLOYMENT_ID ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  'local'

class NotWritten extends Error {}

// A set of cars, whatever order the URL names them in
const setOf = (compared: ReadonlyArray<Car>) => compared.map(carSlug).toSorted()

/**
 * The cached verdict for a set of cars, written by `write` when there is none.
 * One function for reading and writing, as unstable_cache keys on its source:
 * without `write` a miss throws, and nothing is cached.
 */
const cachedVerdict = (
  compared: ReadonlyArray<Car>,
  write?: () => Promise<Verdict>,
): Promise<Verdict> =>
  unstable_cache(async () => {
    if (!write) throw new NotWritten()
    return write()
  }, ['comparison-verdict', build, ...setOf(compared)])()

/** The verdict if one is written, without writing one */
export const peekVerdict = async (
  compared: ReadonlyArray<Car>,
): Promise<Verdict | null> => {
  try {
    return await cachedVerdict(compared)
  } catch (error) {
    if (!(error instanceof NotWritten)) {
      console.error('Reading a comparison verdict failed:', error)
    }
    return null
  }
}

// Long enough for the model to think and look up four cars, which the page
// shows it doing; short of the function's own limit
const TIMEOUT_MS = 100_000

const write = async (
  compared: ReadonlyArray<Car>,
  emit: (event: VerdictEvent) => void,
  usage: { total?: LanguageModelUsage; lookups: number },
): Promise<Verdict> => {
  const pages = new Map(
    compared.flatMap((car) =>
      car.evDatabaseUrl ? [[car.evDatabaseUrl, car] as const] : [],
    ),
  )

  const result = streamText({
    model: google(advisorModel),
    system: verdictSystemPrompt,
    prompt: verdictFacts(compared),
    // Only the compared cars' pages: the model picks the URL it fetches
    tools: {
      fetchCarDetails: createFetchCarDetailsTool(new Set(pages.keys())),
    },
    stopWhen: stepCountIs(compared.length + 2),
    providerOptions: {
      // Written once and kept, so it can afford to think longer than the chat
      google: { thinkingConfig: { thinkingLevel: 'medium' } },
    },
    maxOutputTokens: 16_384,
    abortSignal: AbortSignal.timeout(TIMEOUT_MS),
  })

  for await (const part of result.stream) {
    if (part.type === 'tool-call' && !part.dynamic) {
      usage.lookups++
      emit({
        type: 'lookup',
        id: part.toolCallId,
        car: pages.get(part.input.url)?.label ?? part.input.carName,
        done: false,
      })
    } else if (part.type === 'tool-result' || part.type === 'tool-error') {
      emit({ type: 'lookup', id: part.toolCallId, car: '', done: true })
    } else if (part.type === 'error') {
      throw part.error
    }
  }

  usage.total = await result.totalUsage
  const verdict = readVerdict(await result.text)
  // Thrown rather than returned, as an empty verdict would be cached
  if (!verdict) throw new Error('The model gave no verdict')
  return verdict
}

interface Job {
  events: VerdictEvent[]
  listeners: Set<(event: VerdictEvent) => void>
}

// A link shared to a group is opened by several at once: those who arrive
// while it is being written watch the same answer rather than buy another
const jobs = new Map<string, Job>()

/**
 * The verdict being written for these cars, joined if one is under way here.
 * It runs to the end even when the visitor leaves, so what it cost is kept.
 */
export const writeVerdict = (compared: ReadonlyArray<Car>): Job => {
  const id = setOf(compared).join('/')
  const running = jobs.get(id)
  if (running) return running

  const job: Job = { events: [], listeners: new Set() }
  const emit = (event: VerdictEvent) => {
    job.events.push(event)
    for (const listener of job.listeners) listener(event)
  }
  jobs.set(id, job)

  const startedAt = performance.now()
  const usage: { total?: LanguageModelUsage; lookups: number } = { lookups: 0 }
  let failure: string | undefined

  const done = cachedVerdict(compared, () => write(compared, emit, usage))
    .then((verdict) => emit({ type: 'verdict', verdict }))
    .catch((error) => {
      console.error('Comparison verdict failed:', error)
      failure = String(error)
      emit({ type: 'error' })
    })
    .finally(() => jobs.delete(id))

  after(done)
  logAfterResponse(async () => {
    await done
    return {
      type: 'comparison_verdict',
      timestamp: new Date().toISOString(),
      cars: setOf(compared),
      error: failure,
      usage: usage.total,
      lookups: usage.lookups,
      millis: Math.round(performance.now() - startedAt),
      model: advisorModel,
      ...deployment(),
    }
  })

  return job
}
