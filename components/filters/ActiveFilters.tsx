import clsx from 'clsx'

import type { Filters } from '@/modules/list/filters'
import { activeChips } from '@/modules/list/filterChips'
import { agree } from '@/modules/copy/plural'
import SearchIcon from '@/components/SearchIcon'
import { chipOff, chipOn } from './chipTone'

// Stone rather than clay for the label and the cross, which on the fill of a
// chip that is on would fall short of 4.5:1
const filterClasses = clsx(
  "shrink-0 relative text-xs font-semibold py-1.25 pr-2 pl-2.5 border-0 rounded-full cursor-pointer text-center flex justify-center items-center transition-colors duration-200 after:content-['+'] after:rotate-45 after:ml-1.5 after:text-base after:leading-[10px] after:-mt-px after:text-stone after:transition-colors hover:after:text-tint",
  chipOn,
  'text-stone',
)

interface FilterButtonsProps {
  filters: Filters
  onRemoveFilter: (name: keyof Filters) => void
  onOpenFilterModal: () => void
  filteredCarsCount: number
}

const ActiveFilters = ({
  filters,
  onRemoveFilter,
  onOpenFilterModal,
  filteredCarsCount,
}: FilterButtonsProps) => {
  const chips = activeChips(filters)

  return (
    <div className="mt-5">
      {/* With only makes chosen there is no chip for the count to lead into */}
      {Object.values(filters).length > 0 && (
        <div className="mb-2 text-sm font-semibold">
          {filteredCarsCount}{' '}
          {chips.length > 0
            ? agree(filteredCarsCount, 'bíll passar við:', 'bílar passa við:')
            : agree(filteredCarsCount, 'bíll á listanum', 'bílar á listanum')}
        </div>
      )}
      <div className="flex flex-wrap gap-2 self-start max-w-full -ml-0.5">
        {chips.map(({ name, label, value, removeLabel }) => (
          <button
            key={name}
            aria-label={removeLabel}
            className={filterClasses}
            onClick={() => onRemoveFilter(name)}
          >
            {label}{' '}
            <span className="text-tint transition-colors ml-0.75">{value}</span>
          </button>
        ))}
        <button
          className={clsx(
            'flex justify-center items-center shrink-0 gap-1.5 py-2 pr-4 pl-3 border-0 rounded-full text-control font-semibold cursor-pointer text-center text-tint transition duration-200 active:scale-[0.98]',
            chipOff,
          )}
          onClick={onOpenFilterModal}
        >
          <SearchIcon size={15} className="opacity-70" />
          Leita
        </button>
      </div>
    </div>
  )
}

export default ActiveFilters
