import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { readEveryPage, verdictKeys } from './keep'

const withPage = cars.filter((car) => car.evDatabaseUrl)
const [a, b] = withPage
const without = cars.find((car) => !car.evDatabaseUrl)

describe('readEveryPage', () => {
  it('holds once every page there is has been read', () => {
    expect(readEveryPage([a!, b!], new Set([a!.label, b!.label]))).toBe(true)
  })

  it('fails with a page unread', () => {
    expect(readEveryPage([a!, b!], new Set([a!.label]))).toBe(false)
  })

  it('asks nothing of a car with no page to read', () => {
    if (!without) return
    expect(readEveryPage([a!, without], new Set([a!.label]))).toBe(true)
  })
})

describe('verdictKeys', () => {
  const day = 24 * 60 * 60 * 1000

  it('keeps a whole verdict under the key alone', () => {
    expect(verdictKeys('k').whole).toBe('k')
  })

  // So a verdict written while ev-database turned the server away is written
  // again once it may not
  it('keeps a partial one for a week at most', () => {
    const start = 2900 * 7 * day
    expect(verdictKeys('k', start).partial).toBe(
      verdictKeys('k', start + 6 * day).partial,
    )
    expect(verdictKeys('k', start).partial).not.toBe(
      verdictKeys('k', start + 7 * day).partial,
    )
    expect(verdictKeys('k', start).partial).not.toBe('k')
  })
})
