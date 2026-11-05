import type { CarChange } from '@/modules/data/carChanges'

export type NewsKind = 'added' | 'price' | 'delivery' | 'removed' | 'renamed'

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

/**
 * What the log tells a buyer, oldest first. A car no longer sold changing is
 * no news, and nor is one going on sale and off in the same change.
 */
export const readNews = (entries: ReadonlyArray<CarChange>): NewsItem[] => {
  const onSale = new Set<string>()
  const items: NewsItem[] = []

  for (const entry of entries) {
    const { date, slug, label, price, delivery, renamedFrom } = entry
    const item = (kind: NewsKind, extra: Partial<NewsItem> = {}) =>
      items.push({ kind, date, slug, label, ...extra })
    const wasOnSale = onSale.has(slug)

    if (entry.removed) {
      onSale.delete(slug)
      if (wasOnSale && !entry.added) item('removed')
      continue
    }
    if (entry.added && !wasOnSale) {
      onSale.add(slug)
      item('added', { ...(price && { price }), ...(delivery && { delivery }) })
      continue
    }
    if (!wasOnSale) continue
    if (renamedFrom) item('renamed', { renamedFrom })
    if (price?.from !== undefined) item('price', { price })
    if (delivery) item('delivery', { delivery })
  }

  return items
}

/** The kinds a day's news is told in, in the order it is */
export const dayKinds = ['added', 'price', 'delivery', 'removed'] as const
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
        delivery: of('delivery'),
        removed: of('removed'),
      }
      return dayKinds.some((kind) => byKind[kind].length > 0)
        ? [{ date, items: byKind }]
        : []
    })
    .toSorted((a, b) => b.date.localeCompare(a.date))
