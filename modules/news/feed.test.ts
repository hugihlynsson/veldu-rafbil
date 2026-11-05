import { describe, expect, it } from 'vitest'

import { days, headlineOf, NEWS_SINCE } from './feed'
import { historyOf } from './history'
import { daySummary } from './newsCopy'

describe('the news', () => {
  it('has days from its start on, each with a headline and a summary', () => {
    expect(days.length).toBeGreaterThan(0)
    for (const day of days) {
      expect(day.date >= NEWS_SINCE).toBe(true)
      expect(headlineOf(day)).not.toMatch(/^\s|\s$|undefined|NaN/)
      expect(daySummary(day)).not.toMatch(/undefined|NaN/)
    }
  })

  it('tells of each car on sale from its start on the list', () => {
    expect(historyOf('volkswagen-id-3-pro').at(-1)?.kind).toBe('added')
  })
})
