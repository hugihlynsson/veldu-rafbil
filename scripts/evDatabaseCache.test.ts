import { describe, expect, it } from 'vitest'

import { MAX_AGE_MS, pagesToRead } from './evDatabaseCache'

const now = Date.UTC(2026, 10, 10)
const page = (read: number) => ({ specs: {}, read })

describe('the pages a run fetches', () => {
  it('leave out the ones read lately', () => {
    const cache = { a: page(now - 1000), b: page(now - MAX_AGE_MS - 1) }
    expect(pagesToRead(['a', 'b', 'c'], cache, now)).toEqual(['b', 'c'])
  })
})
