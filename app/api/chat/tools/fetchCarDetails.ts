import { tool } from 'ai'
import { z } from 'zod'
import cars from '@/modules/data/cars'
import {
  fetchOnSite,
  readCapped,
  readCarSpecs,
} from '@/modules/data/evDatabase'
import { carRef } from '@/modules/chat/cars'

// The model names a car, never a URL: the page fetched is the one the car data
// points it at, so no prompt can steer the fetch anywhere else
const carPages = new Map(
  cars.flatMap((car) =>
    car.evDatabaseUrl
      ? [[carRef(car), { url: car.evDatabaseUrl, label: car.label }] as const]
      : [],
  ),
)

const refsByPage = new Map(
  [...carPages].map(([ref, { url }]) => [url, ref] as const),
)

export const CAR_DETAILS_PART = 'tool-fetchCarDetails'

const hasUrlInput = (part: object): part is { input: { url: string } } =>
  'input' in part &&
  typeof part.input === 'object' &&
  part.input !== null &&
  'url' in part.input &&
  typeof part.input.url === 'string'

/**
 * A stored conversation from before the tool took a car still asks by URL,
 * and comes back with every question. Each such call is read as a call by
 * car, or dropped for a page no car on the list points at, so the history
 * validates rather than the question being refused with it.
 */
export const upgradeCarDetailsCalls = <Part extends { type: string }>(
  parts: Part[],
): Part[] =>
  parts.flatMap((part) => {
    if (part.type !== CAR_DETAILS_PART || !hasUrlInput(part)) return [part]
    const car = refsByPage.get(part.input.url)
    return car ? [{ ...part, input: { car } }] : []
  })

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
 * them shares.
 */
export const createFetchCarDetailsTool = () => {
  let calls = 0

  return tool({
    description: `Fetch detailed specifications of a car from EV Database, for example dimensions, cargo space, towing capacity or battery warranty: what the basic car list does not have. The tool will not answer the users question: You must use this info to write a helpful answer. Fetch at most ${MAX_CALLS_PER_ANSWER} cars for one answer, the ones the question is about.`,
    inputSchema: z.object({
      car: z
        .string()
        .max(100)
        .describe("The car's auðkenni, exactly as the car list gives it"),
    }),
    execute: async ({ car }) => {
      const page = carPages.get(car.toLowerCase())
      if (!page) {
        return {
          carName: car,
          specifications:
            'There is no EV Database page for that auðkenni, so nothing was fetched. Check the auðkenni against the car list, or answer from the list alone.',
        }
      }
      const { url, label: carName } = page

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
        return {
          carName,
          specifications: cached.specifications,
          source: url,
          found: true,
        }
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

        // Said outright, so a caller can tell a page read from every way of
        // not reading one without matching on the words to the model
        return { carName, specifications, source: url, found: true }
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
