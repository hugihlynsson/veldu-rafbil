import type { Filters } from '@/modules/list/filters'
import { activeChips } from '@/modules/list/filterChips'
import { agree } from '@/modules/copy/plural'
import SearchIcon from '@/components/SearchIcon'

const filterClasses =
  "shrink-0 relative text-xs font-semibold py-1 pr-2 pl-2.5 border border-line-chip rounded-full cursor-pointer text-center flex justify-center items-center bg-lab transition-colors duration-200 text-clay after:content-['+'] after:rotate-45 after:ml-1.5 after:text-base after:leading-[10px] after:-mt-px after:text-clay after:transition-colors hover:bg-haze hover:after:text-tint active:text-tint"

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
  const hasFilter = Object.values(filters).length > 0

  return (
    <div className="mt-5">
      {hasFilter && (
        <div className="mb-2 text-sm font-semibold">
          {filteredCarsCount}{' '}
          {agree(filteredCarsCount, 'bíll passar við:', 'bílar passa við:')}
        </div>
      )}
      <div className="flex flex-wrap gap-2 self-start max-w-full -ml-0.5">
        {activeChips(filters).map(({ name, label, value, removeLabel }) => (
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
          className="flex justify-center items-center shrink-0 gap-1.5 py-2 pr-4 pl-3 border-0 rounded-full text-control font-semibold cursor-pointer text-center bg-cloud transition duration-200 text-tint hover:bg-smoke active:scale-[0.98]"
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
