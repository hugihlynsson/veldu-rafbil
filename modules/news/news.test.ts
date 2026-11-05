import { describe, expect, it } from 'vitest'

import type { CarChange } from '@/modules/data/carChanges'
import { newsDays, readNews } from './news'

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
