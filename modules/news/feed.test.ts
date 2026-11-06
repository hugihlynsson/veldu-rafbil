import { describe, expect, it } from 'vitest'

import { allDays, days, headlineOf, NEWS_SINCE } from './feed'
import { historyOf } from './history'
import { daySummary } from './newsCopy'

describe('the news', () => {
  it('has days from its start on, each with a headline and a summary', () => {
    expect(days.length).toBeGreaterThan(0)
    for (const day of days) {
      expect(day.date > NEWS_SINCE).toBe(true)
      expect(headlineOf(day)).not.toMatch(/^\s|\s$|undefined|NaN/)
      expect(daySummary(day)).not.toMatch(/undefined|NaN/)
    }
  })

  it('shows the twelve months back from its newest day, of a log back to 2020', () => {
    const [newest] = days
    expect(newest).toBe(allDays[0])
    expect(NEWS_SINCE).toBe(
      `${Number(newest!.date.slice(0, 4)) - 1}${newest!.date.slice(4)}`,
    )
    expect(allDays.at(-1)!.date < '2021').toBe(true)
    expect(days.length).toBe(
      allDays.filter(({ date }) => date > NEWS_SINCE).length,
    )
  })

  it('tells of each car on sale from its start on the list', () => {
    expect(historyOf('volkswagen-id-3-pro').at(-1)?.kind).toBe('added')
  })
})
