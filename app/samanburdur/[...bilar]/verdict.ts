import { google } from '@ai-sdk/google'
import { generateText, Output, type LanguageModelUsage } from 'ai'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { clientKey, comparisonVerdictRateLimit } from '@/modules/rateLimit'
import { advisorModel } from '@/app/api/chat/model'
import { deployment, logAfterResponse } from '@/app/api/publicEndpoint'
import {
  readVerdict,
  verdictFacts,
  verdictSchema,
  verdictSystemPrompt,
  type Verdict,
} from './prompt'

// The deploy is part of every key, so a verdict lasts as long as the car data
// and the prompt it was written from, and is written afresh by the next deploy
const build =
  process.env.VERCEL_DEPLOYMENT_ID ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  'local'

const write = async (compared: ReadonlyArray<Car>) => {
  const { output, usage } = await generateText({
    model: google(advisorModel),
    system: verdictSystemPrompt,
    prompt: verdictFacts(compared),
    output: Output.object({ schema: verdictSchema(compared) }),
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: 'low' } },
    },
    maxOutputTokens: 4096,
    abortSignal: AbortSignal.timeout(30_000),
  })
  return { verdict: readVerdict(output, compared), usage }
}

class RateLimited extends Error {}

/**
 * What the model makes of a comparison. Written once per set of cars and
 * deploy, whatever order the URL names them in, so a link shared to a group
 * costs one answer however many open it. Null when it cannot be had: no
 * model configured, the visitor over their allowance, or the model failing,
 * none of which is cached, so the next visit tries again.
 */
export const getVerdict = async (
  compared: ReadonlyArray<Car>,
): Promise<Verdict | null> => {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) return null

  const key = clientKey({ headers: await headers() })
  // Asked for in a fixed order too, so the answer reads the same from any URL
  const byName = compared.toSorted((a, b) =>
    carSlug(a).localeCompare(carSlug(b)),
  )
  const slugs = byName.map(carSlug)
  const startedAt = performance.now()
  // Set only when this visit is the one that asked the model
  let asked: { usage?: LanguageModelUsage; error?: string } | undefined

  try {
    return await unstable_cache(async () => {
      // Inside the cache, so only a verdict no one has had yet is counted
      if (!comparisonVerdictRateLimit(key).ok) throw new RateLimited()
      asked = {}
      const { verdict, usage } = await write(byName)
      asked.usage = usage
      // Thrown rather than returned, as a null would be cached
      if (!verdict) throw new Error('The model gave an empty verdict')
      return verdict
    }, ['comparison-verdict', build, ...slugs])()
  } catch (error) {
    if (!(error instanceof RateLimited)) {
      console.error('Comparison verdict failed:', error)
      if (asked) asked.error = String(error)
    }
    return null
  } finally {
    if (asked) {
      const event = {
        type: 'comparison_verdict',
        timestamp: new Date().toISOString(),
        cars: slugs,
        error: asked.error,
        usage: asked.usage,
        millis: Math.round(performance.now() - startedAt),
        model: advisorModel,
        ...deployment(),
      }
      logAfterResponse(() => event)
    }
  }
}
