import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import cars, { type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import {
  detailsEntrySchema,
  entryFrom,
  lacking,
  MAX_AGE_DAYS,
  pruned,
  toRefresh,
  type DetailsFile,
} from './carDetails'
import { LIST_URL } from './evDatabaseList'

const file = JSON.parse(
  readFileSync(path.join(__dirname, 'carDetails.json'), 'utf8'),
) as DetailsFile

describe('the details reviews are written from', () => {
  // Most are read off ev-database, but a few are typed in by hand
  it('holds plausible figures', () => {
    for (const [slug, entry] of Object.entries(file)) {
      const parsed = detailsEntrySchema.safeParse(entry)
      expect(parsed.error?.issues ?? [], slug).toEqual([])
    }
  })

  it('holds only cars on the list, in its order', () => {
    // A review run drops the rest, and puts them in order
    expect(Object.keys(file)).toEqual(Object.keys(pruned(cars, file)))
  })
})

const page = 'https://ev-database.org/car/1/A'
const car = (slug: string, evDatabaseUrl?: string) =>
  ({
    ...cars[0],
    make: slug,
    model: '',
    subModel: undefined,
    evDatabaseUrl,
  }) as Car
const today = '2026-11-14'

describe('the details a run reads', () => {
  const withPage = car('a', page)
  const withoutPage = car('b')

  it('looks up any car with none', () => {
    expect(lacking([withPage, withoutPage], {})).toEqual([
      withPage,
      withoutPage,
    ])
    expect(
      lacking([withPage], {
        [carSlug(withPage)]: { source: page, read: today },
      }),
    ).toEqual([])
  })

  it('reads a page again for details off the list, or long ago', () => {
    const at = (source: string, read: string) => ({
      [carSlug(withPage)]: { source, read },
    })
    const old = new Date(Date.parse(today) - (MAX_AGE_DAYS + 1) * 86_400_000)
      .toISOString()
      .slice(0, 10)
    expect(toRefresh([withPage], at(LIST_URL, today), today)).toEqual([
      withPage,
    ])
    expect(toRefresh([withPage], at(page, old), today)).toEqual([withPage])
    expect(toRefresh([withPage], at(page, today), today)).toEqual([])
  })

  it('keeps details written by hand, and any car without a page', () => {
    const byHand = { source: 'https://maker.example/specs', read: '2020-01-01' }
    expect(
      toRefresh([withPage], { [carSlug(withPage)]: byHand }, today),
    ).toEqual([])
    expect(toRefresh([withoutPage], {}, today)).toEqual([])
  })

  it('keeps only the figures a page gave', () => {
    expect(entryFrom({ carBody: 'SUV' }, page, today)).toEqual({
      source: page,
      read: today,
      body: 'SUV',
    })
  })
})
