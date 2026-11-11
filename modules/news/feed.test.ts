import { describe, expect, it } from 'vitest'

import {
  days,
  daysIn,
  headlineOf,
  NEWS_SINCE,
  newsYears,
  recentDays,
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

  it('lists the twelve months back from its newest day', () => {
    const [newest] = days
    expect(recentDays[0]).toBe(newest)
    expect(NEWS_SINCE).toBe(
      `${Number(newest!.date.slice(0, 4)) - 1}${newest!.date.slice(4)}`,
    )
    expect(recentDays).toEqual(days.filter(({ date }) => date > NEWS_SINCE))
  })

  it('files every day under one year, the years newest first', () => {
    expect(newsYears.flatMap(daysIn)).toEqual(days)
    expect(newsYears.toSorted().toReversed()).toEqual(newsYears)
  })

  it('tells of each car on sale from its start on the list', () => {
    expect(historyOf('volkswagen-id-3-pro').at(-1)?.kind).toBe('added')
  })
})
