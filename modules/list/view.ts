import { parseAsWord } from './filters'

// One car per row, or a grid of them from md; below md the two are the same
// card, so a grid link opened on a phone is the list
export type View = 'list' | 'grid'

const parseAsView = parseAsWord<View>({ listi: 'list', yfirlit: 'grid' })

// The list is the default, and leaves the URL clean
export const viewParsers = { view: parseAsView.withDefault('list') }
export const viewUrlKeys = { view: 'utlit' }
