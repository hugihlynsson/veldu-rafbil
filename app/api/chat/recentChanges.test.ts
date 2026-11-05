import { describe, expect, it } from 'vitest'

import type { NewsItem } from '@/modules/news/news'
import { allNews } from '@/modules/news/history'
import {
  CHANGE_DAYS,
  MAX_CHANGES,
  recentChanges,
  recentChangesSection,
} from './recentChanges'

const item = (
  date: string,
  kind: NewsItem['kind'] = 'price',
  slug = 'kia-ev3-long-range',
): NewsItem => ({
  kind,
  date,
  slug,
  label: slug,
  price: { from: 6_490_000, to: 6_290_000 },
})

describe('recentChanges', () => {
  it('counts its window back from the newest change, not from today', () => {
    const dates = recentChanges([
      item('2026-08-01'),
      item('2026-09-10'),
      item('2026-11-05'),
    ]).map(({ date }) => date)
    // 60 days before 5 November is 6 September
    expect(CHANGE_DAYS).toBe(60)
    expect(dates).toEqual(['2026-11-05', '2026-09-10'])
  })

  it('leaves out renames, which are no news to a buyer', () => {
    expect(recentChanges([item('2026-11-05', 'renamed')])).toEqual([])
  })

  it('keeps to its bound by whole days, dropping the oldest', () => {
    const day = (date: string, count: number) =>
      Array.from({ length: count }, () => item(date))
    const kept = recentChanges([
      ...day('2026-10-01', 10),
      ...day('2026-10-02', MAX_CHANGES - 5),
      ...day('2026-10-03', 5),
    ])
    expect(kept).toHaveLength(MAX_CHANGES)
    expect(new Set(kept.map(({ date }) => date))).toEqual(
      new Set(['2026-10-03', '2026-10-02']),
    )
  })
})

describe('recentChangesSection', () => {
  it('says its prices are before the grant, unlike the list above it', () => {
    expect(recentChangesSection([item('2026-11-05')])).toContain(
      'listaverð FYRIR ríkisstyrk',
    )
  })

  it('names its window and each day as the site does', () => {
    const section = recentChangesSection([
      item('2026-10-31'),
      item('2026-11-05'),
    ])
    expect(section).toContain('frá 31. október 2026 til 5. nóvember 2026')
    expect(section).toContain(
      '5. nóvember 2026:\n- Kia EV3 Long Range: Listaverð lækkaði í 6.290.000 kr, um 200.000',
    )
    expect(section.indexOf('5. nóvember')).toBeLessThan(
      section.indexOf('31. október 2026:'),
    )
  })

  // The ref is on the car's line in the list; here it would double the section
  it('names a car as the data does now, or as it last was once gone', () => {
    const renamed = {
      ...item('2026-10-21', 'added', 'byd-atto-3-evo-base'),
      label: 'BYD Evo',
    }
    expect(recentChangesSection([renamed])).toContain(
      '- BYD Atto 3 Evo: Skráður',
    )
    const gone = recentChangesSection([
      item('2026-11-05', 'removed', 'maxus-et90-base'),
    ])
    expect(gone).toContain('- maxus-et90-base: Hætti í sölu')
    expect(gone).not.toContain('auðkenni')
  })

  it('is empty with nothing to tell', () => {
    expect(recentChangesSection([])).toBe('')
  })

  // Every question pays for the prompt, so the section is held to a budget
  it('tells the real log within its budget', () => {
    const section = recentChangesSection(allNews)
    expect(section.length).toBeGreaterThan(0)
    expect(section.length).toBeLessThan(10_000)
  })
})
