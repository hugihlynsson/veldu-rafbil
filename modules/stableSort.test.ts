import { describe, expect, it } from 'vitest'

import stableSort from './stableSort'

describe('stableSort', () => {
  it('keeps equal items in their original order', () => {
    const items = [
      { name: 'a', rank: 1 },
      { name: 'b', rank: 1 },
      { name: 'c', rank: 0 },
      { name: 'd', rank: 1 },
    ]
    expect(
      stableSort(items, (x, y) => x.rank - y.rank).map(({ name }) => name),
    ).toEqual(['c', 'a', 'b', 'd'])
  })

  it('leaves the input array untouched', () => {
    const items = [3, 1, 2]
    stableSort(items, (x, y) => x - y)
    expect(items).toEqual([3, 1, 2])
  })
})
