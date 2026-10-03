import { describe, expect, it } from 'vitest'

import { arrive, depart, type Presence } from './presence'

const item = (key: string) => ({ key })
const keys = (list: Presence<{ key: string }>[]) =>
  list.map(({ key, leaving }) => (leaving ? `(${key})` : key))

describe('arrive', () => {
  it('shows the items in their order', () => {
    expect(keys(arrive([], ['a', 'b'].map(item)))).toEqual(['a', 'b'])
  })

  it('keeps an item that has gone where it stood, leaving', () => {
    const before = arrive([], ['a', 'b', 'c'].map(item))
    expect(keys(arrive(before, ['a', 'c'].map(item)))).toEqual([
      'a',
      '(b)',
      'c',
    ])
  })

  it('keeps one that was first at the top', () => {
    const before = arrive([], ['a', 'b'].map(item))
    expect(keys(arrive(before, ['b'].map(item)))).toEqual(['(a)', 'b'])
  })

  it('keeps every one when all have gone', () => {
    const before = arrive([], ['a', 'b'].map(item))
    expect(keys(arrive(before, []))).toEqual(['(a)', '(b)'])
  })

  it('places a new item among the leaving ones by the items’ order', () => {
    const before = arrive([], ['a', 'b'].map(item))
    expect(keys(arrive(before, ['c', 'b'].map(item)))).toEqual([
      '(a)',
      'c',
      'b',
    ])
  })

  it('keeps leaving ones leaving across further changes', () => {
    const first = arrive([], ['a', 'b', 'c'].map(item))
    const second = arrive(first, ['a', 'c'].map(item))
    expect(keys(arrive(second, ['c'].map(item)))).toEqual(['(a)', '(b)', 'c'])
  })

  it('makes one that comes back before it has left current again', () => {
    const before = arrive(arrive([], ['a', 'b'].map(item)), ['a'].map(item))
    expect(keys(arrive(before, ['a', 'b'].map(item)))).toEqual(['a', 'b'])
  })

  it('carries the current item rather than the one it was shown with', () => {
    const before = arrive([], [{ key: 'a', count: 1 }])
    expect(arrive(before, [{ key: 'a', count: 2 }])[0].item.count).toBe(2)
  })

  it('keeps the item a leaving one was last shown with', () => {
    const before = arrive([], [{ key: 'a', count: 1 }])
    expect(arrive(before, [])[0].item.count).toBe(1)
  })
})

describe('depart', () => {
  it('drops a leaving entry', () => {
    const leaving = arrive(arrive([], ['a', 'b'].map(item)), ['b'].map(item))
    expect(keys(depart(leaving, 'a'))).toEqual(['b'])
  })

  it('leaves a current one alone', () => {
    const current = arrive([], ['a'].map(item))
    expect(keys(depart(current, 'a'))).toEqual(['a'])
  })
})
