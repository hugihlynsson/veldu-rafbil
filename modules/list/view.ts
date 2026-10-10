import { createLoader, createSerializer } from 'nuqs/server'

import { parseAsWord, type SearchParams } from './filters'

// One car per row, or a grid of them from md; below md the two are the same
// card, so a grid link opened on a phone is the list
export type View = 'list' | 'grid'

export const views: Array<View> = ['list', 'grid']

const parseAsView = parseAsWord<View>({ listi: 'list', yfirlit: 'grid' })

// The list is the default, and leaves the URL clean
export const viewParsers = { view: parseAsView.withDefault('list') }
export const viewUrlKeys = { view: 'utlit' }

const loadView = createLoader(viewParsers, { urlKeys: viewUrlKeys })

export const getViewFromQuery = (query: SearchParams): View =>
  loadView(query).view

const serializeViewValues = createSerializer(viewParsers, {
  urlKeys: viewUrlKeys,
})

/** The query string for a view, `?` and all, or '' for the default */
export const serializeView = (view: View): string =>
  serializeViewValues({ view })
