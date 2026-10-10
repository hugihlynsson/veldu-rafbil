import { createLoader, createSerializer } from 'nuqs/server'

import { parseAsWord, type SearchParams } from './filters'

// One car per row, a grid of them, or a table of thin rows, the last two from
// md; below md all three are the same card, so a link opened on a phone is the
// list
export type View = 'list' | 'grid' | 'table'

export const views: Array<View> = ['list', 'grid', 'table']

export const parseAsView = parseAsWord<View>({
  listi: 'list',
  yfirlit: 'grid',
  tafla: 'table',
})

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
