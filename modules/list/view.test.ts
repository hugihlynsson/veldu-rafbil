import { describe, expect, it } from 'vitest'

import { getViewFromQuery, serializeView, views, viewUrlKeys } from './view'
import { filterUrlKeys } from './filters'
import { sortingUrlKeys } from './sorting'

const getQueryFromView = (view: (typeof views)[number]) =>
  Object.fromEntries(new URLSearchParams(serializeView(view)))

describe('reading the view out of the query', () => {
  it('reads the Icelandic words', () => {
    expect(getViewFromQuery({ utlit: 'yfirlit' })).toBe('grid')
    expect(getViewFromQuery({ utlit: 'listi' })).toBe('list')
  })

  it('falls back to the list for anything it does not know', () => {
    expect(getViewFromQuery({})).toBe('list')
    expect(getViewFromQuery({ utlit: '' })).toBe('list')
    expect(getViewFromQuery({ utlit: 'grid' })).toBe('list')
    expect(getViewFromQuery({ utlit: 'toString' })).toBe('list')
  })
})

describe('writing the view into the query', () => {
  it.each(views)('round trips %s', (view) => {
    expect(getViewFromQuery(getQueryFromView(view))).toBe(view)
  })

  it('leaves the default out of the URL', () => {
    expect(serializeView('list')).toBe('')
  })

  it('writes only its own key', () => {
    expect(Object.keys(getQueryFromView('grid'))).toEqual([viewUrlKeys.view])
  })

  // nuqs would hand two of them the same parameter
  it('shares no key with the sorting or the filters', () => {
    const others: string[] = [
      ...Object.values(sortingUrlKeys),
      ...Object.values(filterUrlKeys),
    ]
    expect(others).not.toContain(viewUrlKeys.view)
  })
})
