import { describe, expect, it } from 'vitest'

import type { CarChange } from '@/modules/data/carChanges'
import { newsDays, pageBefore, readNews, type NewsDay } from './news'

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

describe('pageBefore', () => {
  // Days of news on the 1st to the nth, newest first
  const log = (n: number): NewsDay[] =>
    Array.from({ length: n }, (_, i) => ({
      date: `2026-01-${String(n - i).padStart(2, '0')}`,
      items: { added: [], price: [], estimate: [], delivery: [], removed: [] },
    }))
  const dates = ({ days }: { days: ReadonlyArray<NewsDay> }) =>
    days.map(({ date }) => date.slice(-2))

  it('gives the days before the cursor, newest first', () => {
    const page = pageBefore(log(25), '2026-01-21', 10)
    expect(dates(page)).toEqual([
      '20',
      '19',
      '18',
      '17',
      '16',
      '15',
      '14',
      '13',
      '12',
      '11',
    ])
    expect(page.older).toBe('2026-01-11')
    expect(page.newer).toBeNull()
  })

  it('takes any day as a cursor, news or not', () => {
    const days = log(25).filter((_, i) => i % 2 === 0)
    expect(dates(pageBefore(days, '2026-01-20', 3))).toEqual(['19', '17', '15'])
  })

  it('has no older page at the first day, and nothing before it', () => {
    expect(pageBefore(log(25), '2026-01-06', 10).older).toBeUndefined()
    expect(pageBefore(log(25), '2026-01-01', 10).days).toEqual([])
  })

  // Back and forth lands on the same pages, not on pages shifted by a day
  it('steps newer to the page it came from', () => {
    const days = log(29)
    let cursor = '2026-01-30'
    const back: string[][] = []
    for (let page = pageBefore(days, cursor, 5); page.older;) {
      back.push(dates(page))
      cursor = page.older
      page = pageBefore(days, cursor, 5)
    }
    let page = pageBefore(days, cursor, 5)
    for (const expected of back.toReversed()) {
      expect(page.newer).not.toBeUndefined()
      page = pageBefore(days, page.newer ?? '9999-12-31', 5)
      expect(dates(page)).toEqual(expected)
    }
  })

  it('has no newer page past the newest day', () => {
    expect(pageBefore(log(5), '2026-02-01', 10).newer).toBeUndefined()
  })
})
