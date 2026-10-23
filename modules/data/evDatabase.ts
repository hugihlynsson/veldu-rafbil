// A car's ev-database page, read for the advisor's tool and the review script
import newCars from './newCars'

// The pages a script may read, those of cars no longer sold included
export const allowedURLs = new Set(
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
export const fetchOnSite = async (url: string): Promise<Response | null> => {
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
export const readCapped = async (response: Response): Promise<string> => {
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

  for (const [, label = '', value = ''] of html.matchAll(specRow)) {
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

/** Where a car's page is wrong, what its maker says instead, by the page */
export const specCorrections: Readonly<Record<string, CarSpecs>> = {
  // The page says it takes no hitch. Askja's price list offers no towbar for
  // it either, but Mercedes gives it 3,500 kg braked
  'https://ev-database.org/car/2192/Mercedes-Benz-G-580': {
    towHitch: 'Yes',
    towingBraked: '3500 kg',
  },
}

// Only what the page said, not the tool's own carName and source: a page
// with no table must read as having no specifications
export const readCarSpecs = (url: string, html: string): CarSpecs => {
  const specTable = readSpecTable(html)
  const read = Object.fromEntries(
    Object.entries(specLabels).flatMap(([key, labels]) => {
      const value = labels
        .map((label) => specTable.get(label.toLowerCase()))
        .find(Boolean)
      return value ? [[key, value]] : []
    }),
  )
  return { ...read, ...specCorrections[url] }
}

/**
 * A car's page read for a script, which has no model to tell why it failed:
 * nothing for a page off the list, or one that could not be read
 */
export const fetchCarSpecs = async (url: string): Promise<CarSpecs | null> => {
  if (!allowedURLs.has(url)) return null
  const response = await fetchOnSite(url)
  if (!response?.ok) return null
  return readCarSpecs(url, await readCapped(response))
}
