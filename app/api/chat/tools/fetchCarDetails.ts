import { tool } from 'ai'
import { z } from 'zod'

export const fetchCarDetailsTool = tool({
  description: 'Fetch detailed information about a specific car from its EV Database URL. Use this when you need more information like dimensions, cargo space, interior details, or other specifications not in the basic car list.',
  inputSchema: z.object({
    url: z.string().describe('The evDatabaseURL from the car list'),
    carName: z.string().describe('The make and model of the car'),
  }),
  execute: async ({ url, carName }) => {
    try {
      const response = await fetch(url)
      const html = await response.text()

      // Extract structured data from EV Database
      // The site uses tables with format: <tr><td>Label</td><td>Value</td></tr>
      const extractData = (label: string): string => {
        // Pattern to match table rows with label in first td and value in second td
        const tablePattern = new RegExp(
          `<tr[^>]*>\\s*<td[^>]*>\\s*${label}\\s*</td>\\s*<td[^>]*>\\s*([^<]+)\\s*</td>`,
          'i'
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
        weightUnladen: extractData('Weight Unladen') || extractData('Curb Weight'),
        grossWeight: extractData('Gross Vehicle Weight') || extractData('GVWR'),
        maxPayload: extractData('Max. Payload') || extractData('Payload'),
        // Cargo
        cargoVolume: extractData('Cargo Volume'),
        cargoVolumeMax: extractData('Cargo Volume Max') || extractData('Cargo Max'),
        frunk: extractData('Cargo Volume Frunk') || extractData('Frunk'),
        // Towing
        towingUnbraked: extractData('Towing Weight Unbraked'),
        towingBraked: extractData('Towing Weight Braked'),
        towHitch: extractData('Tow Hitch') || extractData('Towbar'),
        // Other
        seats: extractData('Seats'),
        source: url
      }

      // Filter out empty values and format nicely
      const formattedSpecs = Object.entries(specs)
        .filter(([key, value]) => value && key !== 'source')
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')

      console.log('Extracted specs for', carName, ':\n', formattedSpecs)

      return {
        carName,
        specifications: formattedSpecs || 'No specifications found',
        source: url
      }
    } catch (error) {
      return {
        carName,
        specifications: `Could not fetch details from ${url}`,
        error: String(error)
      }
    }
  },
})
