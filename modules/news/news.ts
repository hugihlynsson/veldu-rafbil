import type { CarChange } from '@/modules/data/carChanges'

export type NewsKind =
  | 'added'
  | 'price'
  | 'estimate'
  | 'delivery'
  | 'removed'
  | 'renamed'

/** One thing a change told a buyer about one car */
export interface NewsItem {
  kind: NewsKind
  date: string
  slug: string
  label: string
  /** The list price, before the grant: the figure the seller changed */
  price?: { from?: number; to: number }
  delivery?: { from?: string; to?: string }
  renamedFrom?: string
}

// What the log has said of a car so far
interface CarState {
  onSale: boolean
  price?: number
  delivery?: string
  label: string
}

// Going on sale says afresh whether the car is expected, as the diff does
const apply = (state: CarState | undefined, entry: CarChange): CarState => ({
  onSale: entry.removed ? false : entry.added ? true : (state?.onSale ?? false),
  price: entry.price?.to ?? state?.price,
  delivery:
    entry.added || entry.delivery ? entry.delivery?.to : state?.delivery,
  label: entry.label,
})

// The log's entries a day at a time, and each car's within the day together,
// in the order they first come
const byDayAndCar = (entries: ReadonlyArray<CarChange>) => {
  const days = new Map<string, Map<string, CarChange[]>>()
  for (const entry of entries) {
    const day = days.get(entry.date) ?? new Map<string, CarChange[]>()
    day.set(entry.slug, [...(day.get(entry.slug) ?? []), entry])
    days.set(entry.date, day)
  }
  return days
}

/**
 * What the log tells a buyer, oldest first. A car's changes on one day are
 * told as what the day did to it, so a car added and corrected the same day,
 * as two pull requests merged together can leave it, is one new car at its
 * corrected price rather than a new car and a price cut. A car no longer sold
 * changing is no news, and nor is one going on sale and off in one day.
 */
export const readNews = (entries: ReadonlyArray<CarChange>): NewsItem[] => {
  const states = new Map<string, CarState>()
  const items: NewsItem[] = []

  for (const [date, cars] of byDayAndCar(entries)) {
    for (const [slug, ofDay] of cars) {
      const before = states.get(slug)
      const after = ofDay.reduce<CarState | undefined>(apply, before)
      if (!after) continue
      states.set(slug, after)

      const item = (kind: NewsKind, extra: Partial<NewsItem> = {}) =>
        items.push({ kind, date, slug, label: after.label, ...extra })
      const { price, delivery } = after

      if (!before?.onSale) {
        if (after.onSale) {
          item('added', {
            ...(price !== undefined && { price: { to: price } }),
            ...(delivery && { delivery: { to: delivery } }),
          })
        }
        continue
      }
      if (!after.onSale) {
        item('removed')
        continue
      }
      if (before.label !== after.label) {
        item('renamed', { renamedFrom: before.label })
      }
      if (
        before.price !== undefined &&
        price !== undefined &&
        before.price !== price
      ) {
        // An expected car's price is the seller's estimate, so a new one is
        // a re-estimate rather than the price changing
        item(before.delivery ? 'estimate' : 'price', {
          price: { from: before.price, to: price },
        })
      }
      if (before.delivery !== delivery) {
        item('delivery', {
          delivery: {
            ...(before.delivery && { from: before.delivery }),
            ...(delivery && { to: delivery }),
          },
        })
      }
    }
  }

  return items
}

/** The newest day's news as the list's front page leads with it */
export interface LatestNews {
  date: string
  headline: string
  path: string
  /** The photo of the car it leads with, if that car has one */
  image?: string
}

/** The kinds a day's news is told in, in the order it is */
export const dayKinds = [
  'added',
  'price',
  'estimate',
  'delivery',
  'removed',
] as const
export type DayKind = (typeof dayKinds)[number]

export interface NewsDay {
  date: string
  items: Readonly<Record<DayKind, ReadonlyArray<NewsItem>>>
}

/** The news a day at a time from `since` on, newest first. A rename is not news. */
export const newsDays = (
  items: ReadonlyArray<NewsItem>,
  since: string,
): NewsDay[] =>
  [...new Set(items.map(({ date }) => date))]
    .filter((date) => date >= since)
    .flatMap((date) => {
      const ofDay = items.filter((item) => item.date === date)
      const of = (kind: DayKind) => ofDay.filter((item) => item.kind === kind)
      const byKind = {
        added: of('added'),
        price: of('price'),
        estimate: of('estimate'),
        delivery: of('delivery'),
        removed: of('removed'),
      }
      return dayKinds.some((kind) => byKind[kind].length > 0)
        ? [{ date, items: byKind }]
        : []
    })
    .toSorted((a, b) => b.date.localeCompare(a.date))

/** A page of days, and the cursors to the pages either side of it */
export interface PageOfDays {
  days: NewsDay[]
  /** The cursor to the days before these, if there are any */
  older?: string
  /** The cursor to the days after these, `null` when they are the newest */
  newer?: string | null
}

/**
 * The `size` days before a cursor, newest first. The cursor is a day, as
 * 2026-10-24, and need not be one with news, though only one is linked to. The page newer than this one is
 * the `size` days from the cursor on, so stepping back and forth lands on
 * the same pages; once fewer are left than that, it is the newest days.
 */
export const pageBefore = (
  days: ReadonlyArray<NewsDay>,
  cursor: string,
  size: number,
): PageOfDays => {
  const page = days.filter(({ date }) => date < cursor).slice(0, size)
  const last = page.at(-1)
  const ahead = days.filter(({ date }) => date >= cursor).toReversed()
  return {
    days: page,
    ...(last &&
      days.some(({ date }) => date < last.date) && { older: last.date }),
    ...(ahead.length > 0 && { newer: ahead[size]?.date ?? null }),
  }
}
