import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import cars, { type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import {
  detailsEntrySchema,
  entryFrom,
  lacking,
  listEntry,
  pageEntry,
  MAX_AGE_DAYS,
  pruned,
  toRefresh,
  type DetailsFile,
} from './carDetails'
import { LIST_URL } from './evDatabaseList'

const file = JSON.parse(
  readFileSync(path.join(import.meta.dirname, 'carDetails.json'), 'utf8'),
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

  it('holds each car as read from the ev-database page it links to now', () => {
    // A link changed or added since: `node --import ./scripts/resolve.ts scripts/car-reviews.ts --details`
    expect(lacking(cars, file).map(carSlug)).toEqual([])
  })
})

const page = 'https://ev-database.org/car/1/A'
const car = (slug: string, evDatabaseUrl?: string) =>
  ({ ...cars[0], id: `car-${slug}`, evDatabaseUrl }) as Car
const today = '2026-11-14'

describe('the details a run reads', () => {
  const withPage = car('a', page)
  const withoutPage = car('b')

  it('looks up any car with none', () => {
    expect(lacking([withPage, withoutPage], {})).toEqual([
      withPage,
      withoutPage,
    ])
  })

  // A link corrected, or added once the site lists the car, is another car
  it('looks a car up again once its page changes', () => {
    const at = (evDatabaseUrl?: string) => ({
      [carSlug(withPage)]: { source: page, read: today, evDatabaseUrl },
      [carSlug(withoutPage)]: { source: page, read: today },
    })
    expect(lacking([withPage, withoutPage], at(page))).toEqual([])
    expect(lacking([withPage], at('https://ev-database.org/car/2/B'))).toEqual([
      withPage,
    ])
    expect(lacking([withPage], at())).toEqual([withPage])
  })

  it('reads a page again for details off the list, or long ago', () => {
    const at = (source: string, read: string) => ({
      [carSlug(withPage)]: { source, read },
    })
    const old = Temporal.PlainDate.from(today)
      .subtract({ days: MAX_AGE_DAYS + 1 })
      .toString()
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
    expect(pageEntry({ carBody: 'SUV' }, page, today)).toMatchObject({
      evDatabaseUrl: page,
    })
  })

  // The front page's one figure counts the frunk a page gives apart
  it('keeps a boot read off the list apart from one read off a page', () => {
    expect(listEntry({ cargoVolume: '409 L' }, page, today)).toEqual({
      source: LIST_URL,
      read: today,
      evDatabaseUrl: page,
      cargoWithFrunk: 409,
    })
  })

  // The list holds a car's towing, checked against its maker
  it('keeps no towing from a row of the list', () => {
    const row = { towHitch: 'Yes', towingBraked: '1600 kg' }
    expect(listEntry(row, page, today)).not.toHaveProperty('towing')
  })
})
