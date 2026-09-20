import { tool } from 'ai'
import { z } from 'zod'
import newCars from '../../../../modules/newCars'

// The model picks the URL, and a model can be talked into picking any URL at
// all. Without this the endpoint is a public fetcher for whatever a visitor
// can persuade the assistant to ask for. The car list is the only place a
// legitimate URL can come from, so it is also the whole allowlist.
const allowedURLs = new Set(
  newCars
    .map((car) => car.evDatabaseURL)
    .filter((url): url is string => Boolean(url)),
)

// ev-database pages are ~200 KB. Anything far past that is not a car page, and
// reading it to the end would pin the request open.
const MAX_BYTES = 2_000_000
const TIMEOUT_MS = 8_000

// Slicing the string that response.text() returns is no cap at all: text()
// reads the body to the end first, so the bytes past the cap were fetched,
// decoded and held in memory before being thrown away, and a response that
// trickles or never ends held the request open for the whole timeout. Reading
// the stream here stops at the cap and drops the connection with it.
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
    // Nothing else is going to read this, whether we stopped at the cap or the
    // body ended on its own
    await reader.cancel().catch(() => {})
  }

  return html
}

export const fetchCarDetailsTool = tool({
  description:
    'Fetch detailed information about a specific car from its EV Database URL. Use this to get more information about the car, for example dimensions, cargo space, interior details, or other specifications not in the basic car list. The tool will not answer the users question: You must use this info to write a helpful answer',
  inputSchema: z.object({
    url: z.string().describe('The evDatabaseURL from the car list'),
    carName: z.string().describe('The make and model of the car'),
  }),
  execute: async ({ url, carName }) => {
    if (!allowedURLs.has(url)) {
      return {
        carName,
        specifications:
          'That URL is not one of the ev-database entries in the car list, so it was not fetched. Use the evDatabaseURL given for the car, or answer from the list alone.',
        source: url,
      }
    }

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })

      // An error page parses to nothing anyway, and saying which status came
      // back tells the model to fall back to the list rather than try again
      if (!response.ok) {
        return {
          carName,
          specifications: `The ev-database page answered ${response.status}, so there are no specifications to read. Answer from the car list instead.`,
          source: url,
        }
      }

      const html = await readCapped(response)

      // The site's spec tables are rows of <td>Label</td><td>Value</td>
      const extractData = (label: string): string => {
        const tablePattern = new RegExp(
          `<tr[^>]*>\\s*<td[^>]*>\\s*${label}\\s*</td>\\s*<td[^>]*>\\s*([^<]+)\\s*</td>`,
          'i',
        )
        const match = html.match(tablePattern)
        if (match && match[1]) {
          const value = match[1].trim()
          return value === 'No Data' ? '' : value
        }
        return ''
      }

      // Labels have to match the site's own field names exactly
      const specs = {
        carName,
        length: extractData('Length'),
        width: extractData('Width'),
        height: extractData('Height'),
        wheelbase: extractData('Wheelbase'),
        weightUnladen:
          extractData('Weight Unladen') || extractData('Curb Weight'),
        grossWeight: extractData('Gross Vehicle Weight') || extractData('GVWR'),
        maxPayload: extractData('Max. Payload') || extractData('Payload'),
        cargoVolume: extractData('Cargo Volume'),
        cargoVolumeMax:
          extractData('Cargo Volume Max') || extractData('Cargo Max'),
        frunk: extractData('Cargo Volume Frunk') || extractData('Frunk'),
        towingUnbraked: extractData('Towing Weight Unbraked'),
        towingBraked: extractData('Towing Weight Braked'),
        towHitch: extractData('Tow Hitch') || extractData('Towbar'),
        seats: extractData('Seats'),
        source: url,
      }

      const formattedSpecs = Object.entries(specs)
        .filter(([key, value]) => value && key !== 'source')
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
