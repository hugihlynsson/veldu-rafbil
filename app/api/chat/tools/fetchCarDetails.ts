import { tool } from 'ai'
import { z } from 'zod'
import newCars from '@/modules/newCars'

// Without this the model can be talked into fetching any URL at all
const allowedURLs = new Set(
  newCars
    .map((car) => car.evDatabaseUrl)
    .filter((url): url is string => Boolean(url)),
)

// ev-database pages are ~200 KB; anything far past that is not a car page
const MAX_BYTES = 2_000_000
const TIMEOUT_MS = 8_000

// response.text() would read the whole body before any cap could apply
const readCapped = async (response: Response): Promise<string> => {
  const reader = response.body?.getReader()
  if (!reader) return ''

  const decoder = new TextDecoder()
  let html = ''
  let bytes = 0

  try {
    while (bytes < MAX_BYTES) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      html += decoder.decode(value, { stream: true })
    }
    // Flushes whatever the last chunk left mid-character
    html += decoder.decode()
  } finally {
    // Nothing else reads this, whether we stopped at the cap or the body ended
    await reader.cancel().catch(() => {})
  }

  return html
}

// The site's spec tables are rows of <td>Label</td><td>Value</td>. One pass
// over the page rather than a fresh regex across all of it per field, and the
// page is up to MAX_BYTES of it.
const specRow =
  /<tr[^>]*>\s*<td[^>]*>\s*([^<]+?)\s*<\/td>\s*<td[^>]*>\s*([^<]+?)\s*<\/td>/gi

const readSpecTable = (html: string): Map<string, string> => {
  const table = new Map<string, string>()

  for (const [, label, value] of html.matchAll(specRow)) {
    // The first row wins, the way a search from the top of the page did
    const key = label.toLowerCase()
    if (!table.has(key)) table.set(key, value === 'No Data' ? '' : value)
  }

  return table
}

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
    description: `Fetch detailed information about a specific car from its EV Database URL. Use this to get more information about the car, for example dimensions, cargo space, interior details, or other specifications not in the basic car list. The tool will not answer the users question: You must use this info to write a helpful answer. Fetch at most ${MAX_CALLS_PER_ANSWER} cars for one answer, the ones the question is about.`,
    inputSchema: z.object({
      url: z.string().describe('The evDatabaseUrl from the car list'),
      carName: z.string().describe('The make and model of the car'),
    }),
    execute: async ({ url, carName }) => {
      if (!allowedURLs.has(url)) {
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

      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(TIMEOUT_MS),
        })

        // Naming the status tells the model to fall back to the list, not retry
        if (!response.ok) {
          return {
            carName,
            specifications: `The ev-database page answered ${response.status}, so there are no specifications to read. Answer from the car list instead.`,
            source: url,
          }
        }

        const specTable = readSpecTable(await readCapped(response))

        // The label has to match the site's own field name; the first spelling
        // that answers wins, as the site has renamed a field or two over time
        const spec = (...labels: Array<string>): string => {
          for (const label of labels) {
            const value = specTable.get(label.toLowerCase())
            if (value) return value
          }
          return ''
        }

        // Only what the page said: carName and source are the tool's own fields,
        // and listing them here left a page with no table reporting the name it
        // was given as its specifications
        const specs = {
          length: spec('Length'),
          width: spec('Width'),
          height: spec('Height'),
          wheelbase: spec('Wheelbase'),
          weightUnladen: spec('Weight Unladen', 'Curb Weight'),
          grossWeight: spec('Gross Vehicle Weight', 'GVWR'),
          maxPayload: spec('Max. Payload', 'Payload'),
          cargoVolume: spec('Cargo Volume'),
          cargoVolumeMax: spec('Cargo Volume Max', 'Cargo Max'),
          frunk: spec('Cargo Volume Frunk', 'Frunk'),
          towingUnbraked: spec('Towing Weight Unbraked'),
          towingBraked: spec('Towing Weight Braked'),
          towHitch: spec('Tow Hitch', 'Towbar'),
          seats: spec('Seats'),
        }

        const formattedSpecs = Object.entries(specs)
          .filter(([, value]) => value)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')

        return {
          carName,
          specifications: formattedSpecs || 'No specifications found',
          source: url,
        }
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
