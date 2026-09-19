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
      const html = (await response.text()).slice(0, MAX_BYTES)

      // Extract structured data from EV Database
      // The site uses tables with format: <tr><td>Label</td><td>Value</td></tr>
      const extractData = (label: string): string => {
        // Pattern to match table rows with label in first td and value in second td
        const tablePattern = new RegExp(
          `<tr[^>]*>\\s*<td[^>]*>\\s*${label}\\s*</td>\\s*<td[^>]*>\\s*([^<]+)\\s*</td>`,
          'i',
        )
        const match = html.match(tablePattern)
        if (match && match[1]) {
          const value = match[1].trim()
          // Filter out "No Data" entries
          return value === 'No Data' ? '' : value
        }
        return ''
      }

      // Extract key specifications using exact field names from the site
      const specs = {
        carName,
        // Dimensions
        length: extractData('Length'),
        width: extractData('Width'),
        height: extractData('Height'),
        wheelbase: extractData('Wheelbase'),
        // Weight & Capacity
        weightUnladen:
          extractData('Weight Unladen') || extractData('Curb Weight'),
        grossWeight: extractData('Gross Vehicle Weight') || extractData('GVWR'),
        maxPayload: extractData('Max. Payload') || extractData('Payload'),
        // Cargo
        cargoVolume: extractData('Cargo Volume'),
        cargoVolumeMax:
          extractData('Cargo Volume Max') || extractData('Cargo Max'),
        frunk: extractData('Cargo Volume Frunk') || extractData('Frunk'),
        // Towing
        towingUnbraked: extractData('Towing Weight Unbraked'),
        towingBraked: extractData('Towing Weight Braked'),
        towHitch: extractData('Tow Hitch') || extractData('Towbar'),
        // Other
        seats: extractData('Seats'),
        source: url,
      }

      // Filter out empty values and format nicely
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
