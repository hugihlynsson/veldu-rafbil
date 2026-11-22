import clsx from 'clsx'

import Logo from '@/components/Logo'
import SearchIcon from '@/components/SearchIcon'
import { agree } from '@/modules/copy/plural'
import type { Filters } from '@/modules/list/filters'
import { searchSummary } from '@/modules/list/search'
import type { SearchSection } from './SearchHeader'

interface Props {
  /** Once the header's own bar has scrolled away */
  shown: boolean
  filters: Filters
  count: number
  onOpen: (section: SearchSection) => void
  onTop: () => void
}

/**
 * The search read back in a line, stuck to the top of the window once the
 * header's bar has gone, so changing it never means scrolling up for it.
 * Inert while hidden, as it is still on the page.
 */
export default function StickySearch({
  shown,
  filters,
  count,
  onOpen,
  onTop,
}: Props) {
  const summary = searchSummary(filters)

  return (
    <div
      inert={!shown}
      className={clsx(
        'fixed inset-x-0 top-0 z-20 bg-lab/85 backdrop-blur-xl shadow-(--shadow-hairline) transition duration-200 ease-out-cubic',
        shown ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
      )}
    >
      <div className="max-w-page mx-auto flex items-center gap-4 px-(--gutter) py-2.5 md:px-10">
        <button
          type="button"
          aria-label="Efst á síðuna"
          onClick={onTop}
          className="hidden md:block shrink-0 border-0 bg-transparent p-0 cursor-pointer text-tint"
        >
          <Logo className="w-28 block" />
        </button>
        <button
          type="button"
          onClick={() => onOpen('text')}
          className="grow md:grow-0 md:w-[30rem] md:mx-auto min-w-0 flex items-center gap-3 border-0 rounded-full bg-surface shadow-(--shadow-search) py-2.5 pl-4 pr-4.5 text-left cursor-pointer transition duration-150 active:scale-98"
        >
          <SearchIcon size={14} className="shrink-0 text-tint" />
          <span className="grow min-w-0 truncate text-sm font-semibold text-tint">
            {summary.length ? summary.join(' · ') : 'Leita að rafbíl'}
          </span>
          <span className="shrink-0 text-xs text-stone">
            {count} {agree(count, 'bíll', 'bílar')}
          </span>
        </button>
        {/* Balances the logo, so the bar stands in the middle of the page */}
        <span aria-hidden className="hidden md:block w-28 shrink-0" />
      </div>
    </div>
  )
}
