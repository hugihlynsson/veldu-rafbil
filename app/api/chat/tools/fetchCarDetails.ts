import { tool } from 'ai'
import { z } from 'zod'
import newCars from '@/modules/data/newCars'

// Without this the model can be talked into fetching any URL at all
const allowedURLs = new Set(
  newCars
    .map((car) => car.evDatabaseUrl)
    .filter((url): url is string => Boolean(url)),
)

// ev-database pages are ~200 KB; anything far past that is not a car page
const MAX_BYTES = 2_000_000
const TIMEOUT_MS = 8_000
const MAX_REDIRECTS = 3

// fetch would follow a redirect before anything here saw it, and the allowlist
// vouches only for the URL it was asked for: a hop is followed while it stays
// on that URL's site, and any other is not requested at all
const fetchOnSite = async (url: string): Promise<Response | null> => {
  const { origin } = new URL(url)
  const signal = AbortSignal.timeout(TIMEOUT_MS)
  let next = url

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(next, { redirect: 'manual', signal })
    const location = response.headers.get('location')
    const isRedirect = response.status >= 300 && response.status < 400
    if (!isRedirect || !location) return response

    await response.body?.cancel()
    const target = new URL(location, next)
    if (target.origin !== origin) return null
    next = target.href
  }

  return null
}

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
    const key = label.toLowerCase()
    if (!table.has(key)) table.set(key, value === 'No Data' ? '' : value)
  }

  return table
}

// The fields the list does not carry, each under the labels the site has
// used for it: the first that answers wins, as it has renamed a field or two
const specLabels = {
  carBody: ['Car Body'],
  segment: ['Segment'],
  length: ['Length'],
  width: ['Width'],
  height: ['Height'],
  wheelbase: ['Wheelbase'],
  weightUnladen: ['Weight Unladen', 'Curb Weight'],
  grossWeight: ['Gross Vehicle Weight', 'GVWR'],
  maxPayload: ['Max. Payload', 'Payload'],
  cargoVolume: ['Cargo Volume'],
  cargoVolumeMax: ['Cargo Volume Max', 'Cargo Max'],
  frunk: ['Cargo Volume Frunk', 'Frunk'],
  towingUnbraked: ['Towing Weight Unbraked'],
  towingBraked: ['Towing Weight Braked'],
  towHitch: ['Tow Hitch', 'Towbar'],
  seats: ['Seats'],
  batteryWarrantyPeriod: ['Warranty Period'],
  batteryWarrantyMileage: ['Warranty Mileage'],
} satisfies Record<string, ReadonlyArray<string>>

/** What a car's page says of it, as the site writes it: "4440 mm" */
export type CarSpecs = Partial<Record<keyof typeof specLabels, string>>

// Only what the page said, not the tool's own carName and source: a page
// with no table must read as having no specifications
const readCarSpecs = (html: string): CarSpecs => {
  const specTable = readSpecTable(html)
  return Object.fromEntries(
    Object.entries(specLabels).flatMap(([key, labels]) => {
      const value = labels
        .map((label) => specTable.get(label.toLowerCase()))
        .find(Boolean)
      return value ? [[key, value]] : []
    }),
  )
}

/** The fields the list does not carry, as the model is handed them */
const readSpecs = (html: string): string => {
  const formatted = Object.entries(readCarSpecs(html))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  return formatted || 'No specifications found'
}

/**
 * A car's page read for a script, which has no model to tell why it failed:
 * nothing for a page off the list, or one that could not be read
 */
export const fetchCarSpecs = async (url: string): Promise<CarSpecs | null> => {
  if (!allowedURLs.has(url)) return null
  const response = await fetchOnSite(url)
  if (!response?.ok) return null
  return readCarSpecs(await readCapped(response))
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
