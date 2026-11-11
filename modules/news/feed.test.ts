import { describe, expect, it } from 'vitest'

import {
  archivePageOn,
  archivePages,
  days,
  frontDays,
  headlineOf,
  NEWS_PAGE_DAYS,
  newsYears,
  pagePathOf,
} from './feed'
import { historyOf } from './history'
import { daySummary } from './newsCopy'

describe('the news', () => {
  it('has every day of a log back to 2020, each with a headline and a summary', () => {
    expect(days.at(-1)!.date < '2021').toBe(true)
    for (const day of days) {
      expect(headlineOf(day)).not.toMatch(/^\s|\s$|undefined|NaN/)
      expect(daySummary(day)).not.toMatch(/undefined|NaN/)
    }
  })

  it('shows the newest days in front and the rest a page at a time', () => {
    expect(frontDays[0]).toBe(days[0])
    expect([frontDays, ...archivePages].flat()).toEqual(days)
    for (const page of archivePages) {
      expect(page).toHaveLength(NEWS_PAGE_DAYS)
      expect(archivePageOn(page[0]!.date)).toBe(page)
    }
  })

  it('finds each day the page it is told on', () => {
    expect(pagePathOf(days[0]!.date)).toBe('/uppfaerslur')
    const [page] = archivePages
    for (const day of page!) {
      expect(pagePathOf(day.date)).toBe(`/uppfaerslur/eldri/${page![0]!.date}`)
    }
  })

  it('jumps to each year, newest first, at its last day', () => {
    expect(newsYears.map(({ year }) => year)).toEqual([
      ...new Set(days.map(({ date }) => date.slice(0, 4))),
    ])
    for (const { year, path } of newsYears) {
      const last = days.find(({ date }) => date.startsWith(year))!
      expect(path).toBe(pagePathOf(last.date))
    }
  })

  it('tells of each car on sale from its start on the list', () => {
    expect(historyOf('volkswagen-id-3-pro').at(-1)?.kind).toBe('added')
  })
})
