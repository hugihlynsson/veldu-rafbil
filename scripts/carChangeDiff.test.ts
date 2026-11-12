import { describe, expect, it } from 'vitest'

import carChanges, { type CarChange } from '@/modules/data/carChanges'
import { allCars } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import {
  diffVersions,
  followRenames,
  neverListed,
  readVersion,
  withoutNeverListed,
  type CarVersion,
} from './carChangeDiff'

const car = (overrides: Partial<CarVersion> = {}): CarVersion => ({
  make: 'Kia',
  model: 'EV3',
  subModel: 'Long Range',
  heroImageName: 'kia-ev3',
  price: 6_490_000,
  evDatabaseUrl: 'https://ev-database.org/car/3000/Kia-EV3-Long-Range',
  range: 600,
  ...overrides,
})

const version = (...cars: CarVersion[]) =>
  readVersion(cars as unknown as Record<string, unknown>[])

const diff = (before: CarVersion[], after: CarVersion[], moved = {}) =>
  diffVersions(version(...before), version(...after), '2026-11-05', moved)

describe('readVersion', () => {
  it('reads older field names as they are called now', () => {
    const [read] = readVersion([
      { make: 'Kia', model: 'EV3', sellerURL: 'https://kia.is' },
    ]).values()
    expect(read).toEqual({
      make: 'Kia',
      model: 'EV3',
      sellerUrl: 'https://kia.is',
    })
  })

  it('leaves out a car marked discontinued, and fields since dropped', () => {
    const read = readVersion([
      { make: 'Kia', model: 'EV3', price2024: 1 },
      { make: 'Kia', model: 'e-Niro', discontinued: true },
    ])
    expect([...read.keys()]).toEqual(['kia-ev3-base'])
    expect(read.get('kia-ev3-base')).toEqual({ make: 'Kia', model: 'EV3' })
  })
})

describe('diffVersions', () => {
  it('logs a car going on sale with its price and delivery', () => {
    const { entries } = diff([], [car({ expectedDelivery: 'vor 2027' })])
    expect(entries).toEqual([
      {
        date: '2026-11-05',
        slug: 'kia-ev3-long-range',
        label: 'Kia EV3 Long Range',
        added: true,
        price: { to: 6_490_000 },
        delivery: { to: 'vor 2027' },
      },
    ])
  })

  it('logs a new price and a delivery that arrived in one entry', () => {
    const { entries } = diff(
      [car({ expectedDelivery: 'vor 2027' })],
      [car({ price: 6_190_000 })],
    )
    expect(entries).toEqual([
      expect.objectContaining({
        price: { from: 6_490_000, to: 6_190_000 },
        delivery: { from: 'vor 2027' },
      }),
    ])
  })

  it('logs nothing for a correction', () => {
    expect(diff([car()], [car({ range: 590 })]).entries).toEqual([])
  })

  it('logs a car marked deprecated, and one taken out, as removed', () => {
    const marked = diff([car()], [car({ deprecated: '2026-11-05' })])
    expect(marked.entries).toEqual([expect.objectContaining({ removed: true })])
    const taken = diff([car()], [])
    expect(taken.entries).toEqual([
      {
        date: '2026-11-05',
        slug: 'kia-ev3-long-range',
        label: 'Kia EV3 Long Range',
        name: 'Kia EV3',
        removed: true,
      },
    ])
  })

  it('follows a rename movedSlugs records', () => {
    const { entries, renames } = diff(
      [car()],
      [
        car({
          subModel: 'LR',
          heroImageName: 'other',
          evDatabaseUrl: undefined,
        }),
      ],
      { 'kia-ev3-long-range': 'kia-ev3-lr' },
    )
    expect(renames).toEqual(new Map([['kia-ev3-long-range', 'kia-ev3-lr']]))
    expect(entries).toEqual([
      expect.objectContaining({
        slug: 'kia-ev3-lr',
        renamedFrom: 'Kia EV3 Long Range',
      }),
    ])
  })

  it('takes a car with the same ev-database page for the same car renamed', () => {
    const { renames, entries } = diff(
      [car()],
      [car({ subModel: 'Earth', price: 6_590_000 })],
    )
    expect(renames).toEqual(new Map([['kia-ev3-long-range', 'kia-ev3-earth']]))
    expect(entries).toEqual([
      expect.objectContaining({
        renamedFrom: 'Kia EV3 Long Range',
        price: { from: 6_490_000, to: 6_590_000 },
      }),
    ])
  })

  it('takes a car alike in nothing but its make for a new one', () => {
    const { renames, entries } = diff(
      [car()],
      [
        car({
          model: 'EV4',
          subModel: undefined,
          heroImageName: 'kia-ev4',
          evDatabaseUrl: undefined,
        }),
      ],
    )
    expect(renames.size).toBe(0)
    expect(
      entries.map((entry) => [entry.slug, entry.added, entry.removed]),
    ).toEqual([
      ['kia-ev4-base', true, undefined],
      ['kia-ev3-long-range', undefined, true],
    ])
  })
})

describe('followRenames', () => {
  const entry = (slug: string, date: string): CarChange => ({
    date,
    slug,
    label: slug,
    added: true,
  })

  it('moves a renamed car under its new slug', () => {
    expect(
      followRenames([entry('a', '2025-01-01')], new Map([['a', 'b']])),
    ).toEqual([{ ...entry('a', '2025-01-01'), slug: 'b' }])
  })

  it('keeps apart the car that had the slug before', () => {
    const moved = followRenames(
      [entry('b', '2024-01-01'), entry('a', '2025-01-01')],
      new Map([['a', 'b']]),
    )
    expect(moved.map(({ slug }) => slug)).toEqual(['b~2024-01-01', 'b'])
  })
})

describe('neverListed', () => {
  it('drops their entries and keeps the rest', () => {
    const entries: CarChange[] = [
      {
        date: '2026-10-24',
        slug: 'toyota-hilux-base',
        label: 'Toyota Hilux',
        added: true,
      },
      {
        date: '2026-10-24',
        slug: 'kia-ev3-long-range',
        label: 'Kia EV3 Long Range',
        added: true,
      },
    ]
    expect(withoutNeverListed(entries).map(({ slug }) => slug)).toEqual([
      'kia-ev3-long-range',
    ])
  })

  // A car back in the data would be hidden from the news while it is listed
  it('names no car in the data', () => {
    expect(
      allCars.map(carSlug).filter((slug) => neverListed.has(slug)),
    ).toEqual([])
  })

  it('has nothing in the log', () => {
    expect(carChanges.filter(({ slug }) => neverListed.has(slug))).toEqual([])
  })
})
