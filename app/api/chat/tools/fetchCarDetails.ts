import { tool } from 'ai'
import { z } from 'zod'
import {
  allowedURLs,
  fetchOnSite,
  readCapped,
  readCarSpecs,
} from '@/modules/data/evDatabase'

/** The fields the list does not carry, as the model is handed them */
const readSpecs = (html: string): string => {
  const formatted = Object.entries(readCarSpecs(html))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  return formatted || 'No specifications found'
}

// A car's dimensions do not change within a day, and without this every answer
// that asks is another page from ev-database. Only allowed URLs are kept, so it
// holds at most one entry per car in the list; a failure is not kept.
const CACHE_MS = 24 * 60 * 60 * 1000
const specCache = new Map<string, { specifications: string; expires: number }>()

// Each call is a page from ev-database, and a part of the answer the browser
// sends back with every later question. A model fanning out over the whole
// list would do both once per car, so the description asks for no more than
// this and the tool holds it there.
export const MAX_CALLS_PER_ANSWER = 10

/**
 * The car-details tool for one answer. Built per answer because it counts its
 * calls; reading a conversation asks only for its schemas, which every one of
 * them shares. An answer about a few cars can narrow it to their pages.
 */
export const createFetchCarDetailsTool = (
  allowed: ReadonlySet<string> = allowedURLs,
) => {
  let calls = 0

  return tool({
    description: `Fetch detailed information about a specific car from its EV Database URL. Use this to get more information about the car, for example dimensions, cargo space, interior details, or other specifications not in the basic car list. The tool will not answer the users question: You must use this info to write a helpful answer. Fetch at most ${MAX_CALLS_PER_ANSWER} cars for one answer, the ones the question is about.`,
    inputSchema: z.object({
      url: z.string().describe('The evDatabaseUrl from the car list'),
      carName: z.string().describe('The make and model of the car'),
    }),
    execute: async ({ url, carName }) => {
      if (!allowedURLs.has(url) || !allowed.has(url)) {
        return {
          carName,
          specifications:
            'That URL is not one of the ev-database entries in the car list, so it was not fetched. Use the evDatabaseUrl given for the car, or answer from the list alone.',
          source: url,
        }
      }

      calls += 1
      if (calls > MAX_CALLS_PER_ANSWER) {
        return {
          carName,
          specifications: `Details for ${MAX_CALLS_PER_ANSWER} cars have already been fetched for this answer, so this one was not. Answer from those and the car list.`,
          source: url,
        }
      }

      const cached = specCache.get(url)
      if (cached && cached.expires > Date.now()) {
        return { carName, specifications: cached.specifications, source: url }
      }

      try {
        const response = await fetchOnSite(url)

        if (!response) {
          return {
            carName,
            specifications:
              'The ev-database page redirected somewhere this tool does not follow, so there are no specifications to read. Answer from the car list instead.',
            source: url,
          }
        }

        // Naming the status tells the model to fall back to the list, not retry
        if (!response.ok) {
          return {
            carName,
            specifications: `The ev-database page answered ${response.status}, so there are no specifications to read. Answer from the car list instead.`,
            source: url,
          }
        }

        const specifications = readSpecs(await readCapped(response))
        specCache.set(url, { specifications, expires: Date.now() + CACHE_MS })

        return { carName, specifications, source: url }
      } catch (error) {
        return {
          carName,
          specifications: `Could not fetch details from ${url}`,
          error: String(error),
        }
      }
    },
  })
}
