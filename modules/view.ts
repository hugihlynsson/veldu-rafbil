import { SearchParams, View, ViewQuery } from '../types'
import { oneOf } from './searchParams'

const queryToView: Record<string, View> = {
  listi: 'list',
  yfirlit: 'overview',
}

export const viewToQuery: Record<View, ViewQuery> = {
  list: 'listi',
  overview: 'yfirlit',
}

export const getViewFromQuery = (query: SearchParams): View =>
  oneOf(query.utlit, queryToView) ?? 'list'

export const viewQueryKeys = ['utlit'] as const

// The default leaves the URL clean, the way the default sorting does
export const getQueryFromView = (view: View): Record<string, string> =>
  view === 'list' ? {} : { utlit: viewToQuery[view] }
