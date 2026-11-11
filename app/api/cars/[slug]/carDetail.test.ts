import { describe, expect, it } from 'vitest'

import { buildCarDetail } from './carDetail'
import { buildCarsPayload } from '../carApi'
import { allCars } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { reviewOf } from '@/modules/detail/review'
import { historyOf } from '@/modules/news/history'

const at = new Date('2026-01-01T00:00:00.000Z')
const detailOf = (car: (typeof allCars)[number]) => buildCarDetail(car, at, 'abc123')

describe('a car’s published document', () => {
  // A reader holding both must not find two answers to one question
  it('repeats the car’s row in the list unchanged', () => {
    const list = buildCarsPayload(at)
    for (const row of list.cars) {
      const car = allCars.find((car) => carSlug(car) === row.slug)!
      const { soldNew, evDatabaseUrl, ...published } = detailOf(car).car
      expect(published, row.slug).toEqual(row)
      expect(soldNew, row.slug).toBe(true)
      expect(evDatabaseUrl, row.slug).toBe(car.evDatabaseUrl)
    }
  })

  it('carries the same provenance as the list', () => {
    const { source, disclaimer, generatedAt, commit } = buildCarsPayload(at, 'abc123')
    expect(detailOf(allCars[0]!)).toMatchObject({ source, disclaimer, generatedAt, commit })
  })

  it('says a car is no longer sold new, and gives it no review', () => {
    const gone = allCars.find((car) => car.deprecated)!
    const detail = detailOf(gone)
    expect(detail.car.soldNew).toBe(false)
    expect(detail.review).toBeNull()
  })

  // The questions are the chat's starters, written for the page, not a reader
  it('publishes the review’s paragraphs and nothing else of it', () => {
    for (const car of allCars.filter((car) => reviewOf(car))) {
      expect(detailOf(car).review, carSlug(car)).toEqual({
        paragraphs: reviewOf(car)!.paragraphs,
      })
    }
  })

  // A past price with today's grant taken off would be a figure nobody paid
  it('names each past price for what it is, the list price', () => {
    for (const car of allCars) {
      const history = detailOf(car).history
      expect(history, carSlug(car)).toHaveLength(historyOf(carSlug(car)).length)
      for (const change of history) {
        expect(change, carSlug(car)).not.toHaveProperty('price')
        expect(change, carSlug(car)).not.toHaveProperty('slug')
      }
    }
    const repriced = allCars
      .flatMap((car) => detailOf(car).history)
      .find((change) => change.listPrice)
    expect(repriced?.listPrice?.to).toBeGreaterThan(0)
  })

  it('keeps the photos unpublished, as the list does', () => {
    for (const car of allCars) {
      expect(JSON.stringify(detailOf(car)), carSlug(car)).not.toContain('/images/')
    }
  })

})
