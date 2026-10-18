import { google } from '@ai-sdk/google'
import { stepCountIs, streamText, type LanguageModelUsage } from 'ai'
import { createHash } from 'node:crypto'
import { unstable_cache } from 'next/cache'
import { after } from 'next/server'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import type { Verdict, VerdictEvent } from '@/modules/detail/verdictEvents'
import { carRef } from '@/modules/chat/cars'
import { advisorModel } from '@/modules/chat/model'
import { createFetchCarDetailsTool } from '@/app/api/chat/tools/fetchCarDetails'
import { deployment, logAfterResponse } from '@/app/api/publicEndpoint'
import { readEveryPage, verdictKeys } from './keep'
import { readVerdict, verdictPrompt } from './prompt'

class NotWritten extends Error {}

// A set of cars, whatever order the URL names them in, so any order of the
// same cars reads one verdict
const ordered = (cars: ReadonlyArray<Car>) =>
  cars.toSorted((a, b) => carSlug(a).localeCompare(carSlug(b)))

// Written once per set of cars and kept, so it can afford to think far longer than
// the chat, whose every answer waits on its thinking
const thinkingLevel = 'high'

/**
 * Everything the model is given, hashed: a verdict lasts as long as the
 * figures, prompt and model it was written from, through any number
 * of deploys that change none of them, and no longer
 */
const keyOf = (cars: ReadonlyArray<Car>): string => {
  const { system, prompt } = verdictPrompt(ordered(cars))
  return createHash('sha256')
    .update(`${advisorModel} ${thinkingLevel}\n${system}\n${prompt}`)
    .digest('hex')
}

/**
 * The verdict kept under a key, or `written` kept there when there is none.
 * One function for reading and keeping, as unstable_cache keys on its source:
 * without `written` a miss throws, and nothing is kept.
 */
const kept = (key: string, written?: Verdict): Promise<Verdict> =>
  unstable_cache(async () => {
    if (!written) throw new NotWritten()
    return written
  }, ['verdict', key])()

const peek = async (key: string): Promise<Verdict | null> => {
  try {
    return await kept(key)
  } catch (error) {
    if (!(error instanceof NotWritten)) {
      console.error('Reading a verdict failed:', error)
    }
    return null
  }
}

/** The verdict if one is written, without writing one */
export const peekVerdict = async (
  compared: ReadonlyArray<Car>,
): Promise<Verdict | null> => {
  const { whole, partial } = verdictKeys(keyOf(compared))
  return (await peek(whole)) ?? peek(partial)
}

// The prompts ask for some 160 words: far fewer is an answer that stopped
const MIN_WORDS = 60

const wordCount = ({ paragraphs }: Verdict) =>
  paragraphs.join(' ').split(/\s+/).length

// Long enough for the model to think and look up four cars, which the page
// shows it doing; short of the function's own limit
const TIMEOUT_MS = 100_000

interface Usage {
  total?: LanguageModelUsage
  lookups: number
  /** Whether it read every page it was told to, which decides how long it is kept */
  readEveryPage?: boolean
}

const write = async (
  unordered: ReadonlyArray<Car>,
  emit: (event: VerdictEvent) => void,
  usage: Usage,
): Promise<Verdict> => {
  const compared = ordered(unordered)
  const { system, prompt } = verdictPrompt(compared)
  const byRef = new Map(compared.map((car) => [carRef(car), car] as const))
  const read = new Set<string>()

  const result = streamText({
    model: google(advisorModel),
    system,
    prompt,
    tools: { fetchCarDetails: createFetchCarDetailsTool() },
    stopWhen: stepCountIs(compared.length + 2),
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel } },
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
        car: byRef.get(part.input.car.toLowerCase())?.label ?? part.input.car,
        done: false,
      })
    } else if (part.type === 'tool-result' || part.type === 'tool-error') {
      if (part.type === 'tool-result' && !part.dynamic && part.output.found) {
        read.add(part.output.carName)
      }
      emit({ type: 'lookup', id: part.toolCallId, car: '', done: true })
    } else if (part.type === 'error') {
      throw part.error
    }
  }

  usage.total = await result.totalUsage
  // Thrown rather than returned, as whatever is returned is kept: an answer
  // cut off by its token limit or an interruption would be kept half written
  const finishReason = await result.finishReason
  if (finishReason !== 'stop') {
    throw new Error(`The verdict ended with ${finishReason}`)
  }
  const verdict = readVerdict(await result.text)
  if (!verdict || wordCount(verdict) < MIN_WORDS) {
    throw new Error('The model gave too short a verdict')
  }
  usage.readEveryPage = readEveryPage(compared, read)
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
  const id = keyOf(compared)
  const running = jobs.get(id)
  if (running) return running

  const job: Job = { events: [], listeners: new Set() }
  const emit = (event: VerdictEvent) => {
    job.events.push(event)
    for (const listener of job.listeners) listener(event)
  }
  jobs.set(id, job)

  const startedAt = performance.now()
  const usage: Usage = { lookups: 0 }
  let failure: string | undefined
  const keys = verdictKeys(id)

  const done = write(compared, emit, usage)
    .then((verdict) =>
      kept(usage.readEveryPage ? keys.whole : keys.partial, verdict),
    )
    .then((verdict) => emit({ type: 'verdict', verdict }))
    .catch((error) => {
      console.error('Writing a verdict failed:', error)
      failure = String(error)
      emit({ type: 'error' })
    })
    .finally(() => jobs.delete(id))

  after(done)
  logAfterResponse(async () => {
    await done
    return {
      type: 'verdict',
      timestamp: new Date().toISOString(),
      cars: ordered(compared).map(carSlug),
      error: failure,
      usage: usage.total,
      lookups: usage.lookups,
      readEveryPage: usage.readEveryPage,
      millis: Math.round(performance.now() - startedAt),
      model: advisorModel,
      ...deployment(),
    }
  })

  return job
}
