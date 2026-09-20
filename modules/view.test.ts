import { describe, expect, it } from 'vitest'

import { getQueryFromView, getViewFromQuery, viewQueryKeys } from './view'
import { View } from '../types'

describe('getViewFromQuery', () => {
  it('maps the Icelandic values onto the English ones', () => {
    expect(getViewFromQuery({ utlit: 'yfirlit' })).toBe('overview')
    expect(getViewFromQuery({ utlit: 'listi' })).toBe('list')
  })

  it('falls back to the list for anything it does not know', () => {
    expect(getViewFromQuery({})).toBe('list')
    expect(getViewFromQuery({ utlit: '' })).toBe('list')
    expect(getViewFromQuery({ utlit: 'grid' })).toBe('list')
  })

  // Every object has one, and it is not a view however plausible the URL looks
  it('does not read toString as a view', () => {
    expect(getViewFromQuery({ utlit: 'toString' })).toBe('list')
  })

  it('takes the first of a repeated parameter', () => {
    expect(
      getViewFromQuery({ utlit: ['yfirlit', 'listi'] as unknown as string }),
    ).toBe('overview')
  })
})

describe('the view survives a round trip through the URL', () => {
  it.each<View>(['list', 'overview'])('%s comes back unchanged', (view) => {
    expect(getViewFromQuery(getQueryFromView(view))).toBe(view)
  })

  it('leaves the default out of the URL', () => {
    expect(getQueryFromView('list')).toEqual({})
  })

  // A key left out here cannot be switched off again, as with the filters
  it('writes only keys the client knows to clear', () => {
    expect(Object.keys(getQueryFromView('overview'))).toEqual([
      ...viewQueryKeys,
    ])
  })
})
