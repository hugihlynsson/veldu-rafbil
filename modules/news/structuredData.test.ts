import { describe, expect, it } from 'vitest'

import { allCars } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'
import { SITE_URL } from '@/modules/siteUrl'
import { days } from './feed'
import { dayArticle, newsBreadcrumbs } from './structuredData'

const carPages = new Set(allCars.map((car) => `${SITE_URL}${carPathOf(car)}`))

describe('dayArticle', () => {
  it('names every day, its share image and the cars it is about, in full', () => {
    for (const day of days) {
      const article = dayArticle(day)
      expect(article.url).toBe(`${SITE_URL}/uppfaerslur/${day.date}`)
      expect(article.datePublished).toBe(`${day.date}T00:00:00Z`)
      expect(article.image.startsWith(`${SITE_URL}/mynd`)).toBe(true)
      for (const { url } of article.about) expect(carPages).toContain(url)
    }
  })

  // Past 110 characters a search engine may drop an article's headline
  it('keeps every headline to 110 characters', () => {
    for (const day of days) {
      expect(dayArticle(day).headline.length).toBeLessThanOrEqual(110)
    }
  })

  it('names a car once however many of its changes the day tells', () => {
    for (const day of days) {
      const urls = dayArticle(day).about.map(({ url }) => url)
      expect(new Set(urls).size).toBe(urls.length)
    }
  })
})

describe('newsBreadcrumbs', () => {
  it('steps from the front page through the updates to a page under them', () => {
    const steps = (page?: { name: string; path: string }) =>
      newsBreadcrumbs(page).itemListElement.map(({ name, item }) => [
        name,
        item,
      ])
    expect(steps()).toEqual([
      ['Veldu Rafbíl', `${SITE_URL}/`],
      ['Uppfærslur', `${SITE_URL}/uppfaerslur`],
    ])
    expect(
      steps({ name: '23. desember 2025', path: '/uppfaerslur/2025-12-23' }).at(
        -1,
      ),
    ).toEqual(['23. desember 2025', `${SITE_URL}/uppfaerslur/2025-12-23`])
  })
})
