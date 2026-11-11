import { describe, expect, it } from 'vitest'

import type { CarChange } from '@/modules/data/carChanges'
import { newsDays, newsPages, readNews, type NewsDay } from './news'

const entry = (
  date: string,
  change: Omit<CarChange, 'date' | 'slug' | 'label'>,
  slug = 'kia-ev3',
): CarChange => ({ date, slug, label: slug, ...change })

describe('readNews', () => {
  it('tells a car going on sale, its new prices and its leaving', () => {
    const kinds = readNews([
      entry('2026-01-01', { added: true, price: { to: 2 } }),
      entry('2026-02-01', { price: { from: 2, to: 1 } }),
      entry('2026-03-01', { delivery: { to: 'vor 2027' } }),
      entry('2026-04-01', { removed: true }),
    ]).map(({ kind }) => kind)
    expect(kinds).toEqual(['added', 'price', 'delivery', 'removed'])
  })

  it('tells a new price for an expected car as a re-estimate', () => {
    const items = readNews([
      entry('2026-01-01', {
        added: true,
        price: { to: 3 },
        delivery: { to: 'lok 2026' },
      }),
      entry('2026-02-01', { price: { from: 3, to: 2 } }),
      entry('2026-03-01', { delivery: { from: 'lok 2026' } }),
      entry('2026-04-01', { price: { from: 2, to: 1 } }),
    ])
    expect(items.map(({ kind }) => kind)).toEqual([
      'added',
      'estimate',
      'delivery',
      'price',
    ])
  })

  it('tells nothing of a car while it is not sold', () => {
    const items = readNews([
      entry('2026-01-01', { added: true }),
      entry('2026-02-01', { removed: true }),
      entry('2026-03-01', { price: { from: 2, to: 1 } }),
      entry('2026-04-01', { removed: true }),
    ])
    expect(items.map(({ kind }) => kind)).toEqual(['added', 'removed'])
  })

  it('tells a car back on sale as going on sale', () => {
    const items = readNews([
      entry('2026-01-01', { added: true }),
      entry('2026-02-01', { removed: true }),
      entry('2026-03-01', { added: true }),
    ])
    expect(items.map(({ kind }) => kind)).toEqual(['added', 'removed', 'added'])
  })

  it('tells nothing of a car on sale and off in one change', () => {
    expect(
      readNews([entry('2026-01-01', { added: true, removed: true })]),
    ).toEqual([])
  })
})

describe('readNews on a day a car changed more than once', () => {
  it('tells a car added and corrected the same day as one new car', () => {
    const items = readNews([
      entry('2026-10-04', { added: true, price: { to: 6_300_000 } }),
      entry('2026-10-04', { price: { from: 6_300_000, to: 6_000_000 } }),
    ])
    expect(items).toEqual([
      expect.objectContaining({ kind: 'added', price: { to: 6_000_000 } }),
    ])
  })

  it('tells two price changes in a day as one, from the first to the last', () => {
    const items = readNews([
      entry('2026-10-01', { added: true, price: { to: 3 } }),
      entry('2026-10-05', { price: { from: 3, to: 2 } }),
      entry('2026-10-05', { price: { from: 2, to: 1 } }),
    ])
    expect(items.at(-1)).toEqual(
      expect.objectContaining({ kind: 'price', price: { from: 3, to: 1 } }),
    )
    expect(items).toHaveLength(2)
  })

  it('tells nothing of a price that came back to where it was', () => {
    const items = readNews([
      entry('2026-10-01', { added: true, price: { to: 3 } }),
      entry('2026-10-05', { price: { from: 3, to: 2 } }),
      entry('2026-10-05', { price: { from: 2, to: 3 } }),
    ])
    expect(items).toHaveLength(1)
  })

  it('tells a car renamed the same day it was added by its new name', () => {
    const items = readNews([
      { ...entry('2026-11-05', { added: true }), label: 'Old name' },
      {
        ...entry('2026-11-05', { renamedFrom: 'Old name' }),
        label: 'New name',
      },
    ])
    expect(items).toEqual([
      expect.objectContaining({ kind: 'added', label: 'New name' }),
    ])
  })
})

describe('newsDays', () => {
  const items = readNews([
    entry('2025-12-31', { added: true }, 'a'),
    entry('2026-01-02', { added: true }, 'b'),
    entry('2026-01-02', { renamedFrom: 'B' }, 'b'),
    entry('2026-01-03', { added: true }, 'c'),
    entry('2026-01-04', { renamedFrom: 'C' }, 'c'),
  ])

  it('gives the days from the start, newest first, with no day only renaming', () => {
    expect(newsDays(items, '2026-01-01').map(({ date }) => date)).toEqual([
      '2026-01-03',
      '2026-01-02',
    ])
  })

  it('sorts a day into its kinds, leaving out renames', () => {
    const [, day] = newsDays(items, '2026-01-01')
    expect(day?.items.added.map(({ slug }) => slug)).toEqual(['b'])
    expect(Object.values(day?.items ?? {}).flat()).toHaveLength(1)
  })
})

describe('newsPages', () => {
  // Day n of a log, a day apart, newest first
  const log = (n: number): NewsDay[] =>
    Array.from({ length: n }, (_, i) => ({
      date: `2026-01-${String(n - i).padStart(2, '0')}`,
      items: { added: [], price: [], estimate: [], delivery: [], removed: [] },
    }))
  const dates = (days: ReadonlyArray<NewsDay>) => days.map(({ date }) => date)

  it('tells every day once, the front page first, newest first', () => {
    for (const n of [0, 1, 6, 7, 8, 13, 14, 15, 29]) {
      const { front, archive } = newsPages(log(n), 7)
      expect(dates([front, ...archive].flat())).toEqual(dates(log(n)))
    }
  })

  it('fills every archive page, and shows a page to two less a day in front', () => {
    for (const n of [7, 8, 13, 14, 15, 29]) {
      const { front, archive } = newsPages(log(n), 7)
      expect(front.length).toBeGreaterThanOrEqual(7)
      expect(front.length).toBeLessThan(14)
      for (const page of archive) expect(page).toHaveLength(7)
    }
  })

  // An address a search engine has indexed keeps what it found there
  it('never changes a page as news comes', () => {
    const before = newsPages(log(20), 7).archive.map(dates)
    for (const n of [21, 22, 26, 27, 28]) {
      const after = newsPages(log(n), 7).archive.map(dates)
      expect(after.slice(after.length - before.length)).toEqual(before)
    }
  })
})
