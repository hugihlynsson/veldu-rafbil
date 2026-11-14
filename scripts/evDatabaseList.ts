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

const read = (row: string, pattern: RegExp) => row.match(pattern)?.[1]

// The list gives 0 where it has no figure, and no car tows or carries nothing
const positive = (text?: string) => (Number(text) > 0 ? text : undefined)

/**
 * The front page's figures for each car, by its id on the site, as its own
 * page would write them. Its cargo includes the frunk, which a page gives on
 * its own, and it carries no length, folded cargo or battery warranty.
 */
export const readListSpecs = (html: string): Map<string, CarSpecs> =>
  new Map(
    html
      .split('data-jplist-item')
      .slice(1)
      .flatMap((row) => {
        const id = read(row, /class="id hidden">(\d+)</)
        if (!id) return []
        const towing = positive(read(row, /class="towweight hidden">(\d+)</))
        const cargo = positive(read(row, /class="cargosort hidden">(\d+)</))
        const body = read(row, /class="shape-([a-z]+) hidden"/)
        const segment = read(row, /class="size-([a-z])"/)
        const specs: CarSpecs = {
          carBody: body && bodies[body],
          segment: segment && segments[segment],
          cargoVolume: cargo && `${cargo} L`,
          towingBraked: towing && `${towing} kg`,
          towHitch: row.includes('class="tow-hitch hidden"')
            ? 'Yes'
            : row.includes('"Towbar not possible"')
              ? 'No'
              : undefined,
        }
        return [[id, specs] as const]
      }),
  )

/** The id a car's page has on the site, as the list gives it */
export const evDatabaseId = (url: string): string | undefined =>
  url.match(/\/car\/(\d+)\//)?.[1]
