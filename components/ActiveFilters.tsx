import { Filters } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'

const filterClasses =
  "shrink-0 relative text-xs font-semibold py-1 pr-2 pl-2.5 border border-smoke rounded-full cursor-pointer text-center flex justify-center items-center bg-lab transition-all duration-200 text-clay after:content-['+'] after:rotate-45 after:ml-1.5 after:text-base after:leading-[10px] after:-mt-px after:text-clay after:transition-colors hover:bg-[#f8f8f8] hover:after:text-[#222] active:text-black"

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
          {filteredCarsCount.toString().match(/.*1$/m)
            ? 'bíll passar við:'
            : 'bílar passa við:'}
        </div>
      )}
      <div className="flex flex-wrap gap-2 self-start max-w-full -ml-[2px]">
        {filters.name && (
          <button
            className={filterClasses}
            onClick={() => onRemoveFilter('name')}
          >
            Nafn:{' '}
            <span className="text-tint transition-colors ml-[3px]">
              {filters.name.join(', ')}
            </span>
          </button>
        )}

        {filters.price && (
          <button
            className={filterClasses}
            onClick={() => onRemoveFilter('price')}
          >
            Verð:{' '}
            <span className="text-tint transition-colors ml-[3px]">
              ↓{addDecimalSeprators(filters.price)} kr.
            </span>
          </button>
        )}

        {filters.range && (
          <button
            className={filterClasses}
            onClick={() => onRemoveFilter('range')}
          >
            Drægni:{' '}
            <span className="text-tint transition-colors ml-[3px]">
              ↑{filters.range} km.
            </span>
          </button>
        )}

        {filters.drive && (
          <button
            className={filterClasses}
            onClick={() => onRemoveFilter('drive')}
          >
            Drif:{' '}
            <span className="text-tint transition-colors ml-[3px]">
              {filters.drive.join(', ')}
            </span>
          </button>
        )}

        {filters.acceleration && (
          <button
            className={filterClasses}
            onClick={() => onRemoveFilter('acceleration')}
          >
            Hröðun{' '}
            <span className="text-tint transition-colors ml-[3px]">
              ↓{filters.acceleration.toFixed(1)}s
            </span>
          </button>
        )}

        {filters.value && (
          <button
            className={filterClasses}
            onClick={() => onRemoveFilter('value')}
          >
            Verði á km:{' '}
            <span className="text-tint transition-colors ml-[3px]">
              ↓{addDecimalSeprators(filters.value)} kr.
            </span>
          </button>
        )}

        {filters.fastcharge && (
          <button
            className={filterClasses}
            onClick={() => onRemoveFilter('fastcharge')}
          >
            Hraðhleðsla:{' '}
            <span className="text-tint transition-colors ml-[3px]">
              ↑{filters.fastcharge} km/min
            </span>
          </button>
        )}

        {filters.availability && (
          <button
            className={filterClasses}
            onClick={() => onRemoveFilter('availability')}
          >
            Framboð:{' '}
            <span className="text-tint transition-colors ml-[3px]">
              {filters.availability === 'available'
                ? 'Fáanlegir'
                : 'Væntanlegir'}
            </span>
          </button>
        )}
        <button
          className="flex justify-center items-center shrink-0 gap-1.5 py-2 pr-4 pl-3 border-0 rounded-full text-[13px] font-semibold cursor-pointer text-center bg-black/6 transition-all duration-200 text-tint hover:bg-black/9 active:translate-y-0"
          onClick={onOpenFilterModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="none"
            className="opacity-70"
          >
            <path
              fill="#000"
              d="m14.298 13.202-3.87-3.87A5.514 5.514 0 0 0 11.55 6C11.55 2.94 9.061.45 6 .45 2.94.45.45 2.94.45 6c0 3.061 2.49 5.55 5.55 5.55a5.514 5.514 0 0 0 3.332-1.122l3.87 3.87a.775.775 0 1 0 1.096-1.096ZM1.55 6A4.455 4.455 0 0 1 6 1.55 4.455 4.455 0 0 1 10.45 6 4.455 4.455 0 0 1 6 10.45 4.455 4.455 0 0 1 1.55 6Z"
            />
          </svg>
          Leita
        </button>
      </div>
    </div>
  )
}

export default ActiveFilters