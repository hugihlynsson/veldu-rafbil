import { describe, expect, it } from 'vitest'

import {
  carsOf,
  dayOn,
  days,
  frontDays,
  headlineOf,
  leadCar,
  NEWS_PAGE_DAYS,
  olderPage,
  olderThanFront,
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

  it('shows the newest days in front, and every one before a page at a time', () => {
    expect(frontDays).toEqual(days.slice(0, NEWS_PAGE_DAYS))
    const seen = [...frontDays]
    for (let cursor = olderThanFront; cursor;) {
      const page = olderPage(cursor)
      seen.push(...page.days)
      cursor = page.older
    }
    expect(seen).toEqual(days)
  })

  it('steps from the first older page back to the front', () => {
    expect(olderPage(olderThanFront!).newer).toBeNull()
  })

  // The route takes only a day with news, so a link to any other is a 404
  it('links only to cursors the older pages take', () => {
    const cursors = [olderThanFront!]
    for (let page = olderPage(cursors[0]!); page.older;) {
      cursors.push(page.older)
      page = olderPage(page.older)
    }
    for (const cursor of cursors) {
      expect(dayOn(cursor)).toBeDefined()
      const { newer } = olderPage(cursor)
      if (newer) expect(dayOn(newer)).toBeDefined()
    }
  })

  it('names each car a day tells of once, the one it leads with first', () => {
    for (const day of days) {
      const cars = carsOf(day)
      expect(new Set(cars).size).toBe(cars.length)
      expect(cars[0]).toBe(leadCar(day))
    }
  })

  it('tells of each car on sale from its start on the list', () => {
    expect(historyOf('volkswagen-id-3-pro').at(-1)?.kind).toBe('added')
  })
})
