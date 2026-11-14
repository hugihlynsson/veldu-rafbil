import type { CarSpecs } from '@/modules/data/evDatabase'

// The front page lists every car on the site in one page of some 9 MB. It
// has answered while the car pages answered 429 for weeks on end, so it is
// where a car's details come from when its page cannot be read
export const LIST_URL = 'https://ev-database.org/'

// The list's body classes, in the words a car's page uses for them
const bodies: Record<string, string> = {
  suv: 'SUV',
  sedan: 'Sedan',
  liftback: 'Liftback Sedan',
  hatchback: 'Hatchback',
  station: 'Station/Estate',
  mpv: 'MPV',
  spv: 'Small Passenger Van',
  cabrio: 'Cabriolet',
  coupe: 'Coupe',
  pickup: 'Pickup Truck',
}

const segments: Record<string, string> = {
  a: 'A - Mini',
  b: 'B - Compact',
  c: 'C - Medium',
  d: 'D - Large',
  e: 'E - Executive',
  f: 'F - Luxury',
  n: 'N - Passenger Van',
  s: 'S - Sports',
}

const drives = {
  'All Wheel Drive': 'AWD',
  'Front Wheel Drive': 'FWD',
  'Rear Wheel Drive': 'RWD',
} as const

const read = (row: string, pattern: RegExp) => row.match(pattern)?.[1]

// The list gives 0 where it has no figure, and no car tows or carries nothing
const positive = (text?: string) => (Number(text) > 0 ? text : undefined)
const numberIn = (text?: string) => (text ? Number(text) : undefined)

/** A price on the list, as it writes it, and whether it is still asked */
export interface ListPrice {
  /** "€38,200", "£30,700" */
  price: string
  status: 'current' | 'upcoming' | 'archive'
}

/** One car on the front page */
export interface ListRow {
  id: string
  name: string
  /** Its page, with the exact slug a guessed URL would 404 without */
  url: string
  /** "Available to order since September 2026" */
  availability?: string
  drive?: (typeof drives)[keyof typeof drives]
  /** A European configuration, not the Icelandic maximum */
  seats?: number
  /** 0-100 km/h, in seconds */
  acceleration?: number
  /** Usable, not the nominal figure the car list carries */
  usableBattery?: number
  /** The average kW over a 10-80% charge */
  fastcharge?: number
  /** The site's real-world estimate, not WLTP */
  realRange?: number
  prices: Partial<Record<'de' | 'nl' | 'uk', ListPrice>>
  /** What it says of the car as its own page would write it */
  specs: CarSpecs
}

const pricePattern =
  /<div class="price_buy (current|upcoming|archive)">\s*<span class="country_(de|nl|uk)"[^>]*>([^<]+)</g

const readRow = (row: string): ListRow | undefined => {
  const id = read(row, /class="id hidden">(\d+)</)
  const href = read(row, /href="?(\/car\/\d+\/[^"\s>]+)/)
  const name = read(row, /<span class="hidden">([^<]+)<\/span><\/a>/)
  if (!id || !href || !name) return undefined
  const towing = positive(read(row, /class="towweight hidden">(\d+)</))
  const cargo = positive(read(row, /class="cargosort hidden">(\d+)</))
  const body = read(row, /class="shape-([a-z]+) hidden"/)
  const segment = read(row, /class="size-([a-z])"/)
  const drive = read(row, /data-tooltip="([A-Za-z]+ Wheel Drive)"/)
  const prices = Object.fromEntries(
    [...row.matchAll(pricePattern)].map(([, status, country, price]) => [
      country,
      { price: price!.trim(), status: status as ListPrice['status'] },
    ]),
  )
  return {
    id,
    name: name.trim(),
    url: new URL(href, LIST_URL).href,
    availability: read(row, /class="availability[^"]*"[^>]*>\s*([^<]*?)\s*</),
    drive: drive ? drives[drive as keyof typeof drives] : undefined,
    seats: numberIn(read(row, /class="seats-(\d+)/)),
    acceleration: numberIn(read(row, /class="acceleration hidden">([\d.]+)</)),
    usableBattery: numberIn(read(row, /class="battery hidden">([\d.]+)</)),
    fastcharge: numberIn(
      positive(read(row, /class="fastcharge_speed hidden">(\d+)</)),
    ),
    realRange: numberIn(read(row, /class="erange_real">(\d+) km</)),
    prices,
    specs: {
      carBody: body && bodies[body],
      segment: segment && segments[segment],
      cargoVolume: cargo && `${cargo} L`,
      towingBraked: towing && `${towing} kg`,
      towHitch: row.includes('class="tow-hitch hidden"')
        ? 'Yes'
        : row.includes('"Towbar not possible"')
          ? 'No'
          : undefined,
    },
  }
}

/**
 * Every car on the front page, by its id on the site. Its cargo includes the
 * frunk, which a page gives on its own, and it carries no WLTP range, power,
 * nominal battery, length, folded cargo or battery warranty.
 */
export const readList = (html: string): Map<string, ListRow> =>
  new Map(
    html
      .split('data-jplist-item')
      .slice(1)
      .flatMap((row) => {
        const car = readRow(row)
        return car ? [[car.id, car] as const] : []
      }),
  )

/**
 * The cars a search names: the one with that id, or those whose name has
 * every word of it, whatever the case
 */
export const findInList = (
  list: ReadonlyMap<string, ListRow>,
  query: string,
): ListRow[] => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const [first] = words
  if (words.length === 1 && first && /^\d+$/.test(first)) {
    const row = list.get(first)
    return row ? [row] : []
  }
  return [...list.values()].filter((row) =>
    words.every((word) => row.name.toLowerCase().includes(word)),
  )
}

/** The front page, read whole, or why it could not be */
export const fetchList = async (): Promise<
  { list: Map<string, ListRow> } | { error: string }
> => {
  const response = await fetch(LIST_URL, {
    signal: AbortSignal.timeout(60_000),
  }).catch((error: unknown) => String(error))
  if (typeof response === 'string') return { error: response }
  if (!response.ok) {
    await response.body?.cancel()
    return { error: `it answered ${response.status}` }
  }
  return { list: readList(await response.text()) }
}

/** The id a car's page has on the site, as the list gives it */
export const evDatabaseId = (url: string): string | undefined =>
  url.match(/\/car\/(\d+)\//)?.[1]
