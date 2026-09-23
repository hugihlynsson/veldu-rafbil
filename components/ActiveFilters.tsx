import { Filters } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import { agree } from '../modules/plural'

const filterClasses =
  "shrink-0 relative text-xs font-semibold py-1 pr-2 pl-2.5 border border-line-strong rounded-full cursor-pointer text-center flex justify-center items-center bg-lab transition-all duration-200 text-clay after:content-['+'] after:rotate-45 after:ml-1.5 after:text-base after:leading-[10px] after:-mt-px after:text-clay after:transition-colors hover:bg-haze hover:after:text-tint active:text-tint"

type ChipText = {
  label: string
  /** The value as the chip shows it, arrow included */
  value: string
  /** The whole button's label, since the visible text alone reads as a fragment */
  removeLabel: string
}

// Written out one by one because the aria-label needs the Icelandic case after
// "Fjarlægja". Mapped over `Filters`, so a new filter has to be given a chip
// before it compiles, and a filter on the page can always be switched off.
const chipText: {
  [Key in keyof Filters]-?: (value: NonNullable<Filters[Key]>) => ChipText
} = {
  name: (names) => ({
    label: 'Nafn:',
    value: names.join(', '),
    removeLabel: `Fjarlægja nafnasíu: ${names.join(', ')}`,
  }),
  price: (max) => {
    const price = addDecimalSeprators(max)
    return {
      label: 'Verð:',
      value: `↓${price} kr.`,
      removeLabel: `Fjarlægja verðsíu: hámark ${price} kr.`,
    }
  },
  range: (min) => ({
    label: 'Drægni:',
    value: `↑${min} km.`,
    removeLabel: `Fjarlægja drægnisíu: lágmark ${min} km`,
  }),
  seats: (min) => ({
    label: 'Sæti:',
    value: `${min}+`,
    removeLabel: `Fjarlægja sætasíu: lágmark ${min} sæti`,
  }),
  drive: (drives) => ({
    label: 'Drif:',
    value: drives.join(', '),
    removeLabel: `Fjarlægja drifsíu: ${drives.join(', ')}`,
  }),
  acceleration: (max) => {
    const seconds = max.toFixed(1)
    return {
      // The only one without a colon, as it has always read
      label: 'Hröðun',
      value: `↓${seconds}s`,
      removeLabel: `Fjarlægja hröðunarsíu: hámark ${seconds} sekúndur`,
    }
  },
  value: (max) => {
    const value = addDecimalSeprators(max)
    return {
      label: 'Verði á km:',
      value: `↓${value} kr.`,
      removeLabel: `Fjarlægja síu á verði á km: hámark ${value} kr.`,
    }
  },
  fastcharge: (min) => ({
    label: 'Hraðhleðsla:',
    value: `↑${min} km/min`,
    removeLabel: `Fjarlægja hraðhleðslusíu: lágmark ${min} km á mínútu`,
  }),
  availability: (availability) => {
    const isAvailable = availability === 'available'
    return {
      label: 'Framboð:',
      value: isAvailable ? 'Fáanlegir' : 'Væntanlegir',
      removeLabel: `Fjarlægja framboðssíu: ${
        isAvailable ? 'fáanlegir' : 'væntanlegir'
      }`,
    }
  },
}

// In the order the chips have always stood, whatever order the filters came in
const chipOrder = Object.keys(chipText) as Array<keyof Filters>

const activeChips = (filters: Filters) =>
  chipOrder.flatMap((name) => {
    const value = filters[name]
    if (value === undefined) return []
    const text = (chipText[name] as (value: unknown) => ChipText)(value)
    return [{ name, ...text }]
  })

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
      <div className="flex flex-wrap gap-2 self-start max-w-full -ml-[2px]">
        {activeChips(filters).map(({ name, label, value, removeLabel }) => (
          <button
            key={name}
            aria-label={removeLabel}
            className={filterClasses}
            onClick={() => onRemoveFilter(name)}
          >
            {label}{' '}
            <span className="text-tint transition-colors ml-[3px]">
              {value}
            </span>
          </button>
        ))}
        <button
          className="flex justify-center items-center shrink-0 gap-1.5 py-2 pr-4 pl-3 border-0 rounded-full text-[13px] font-semibold cursor-pointer text-center bg-scrim/6 transition-all duration-200 text-tint hover:bg-scrim/9 active:scale-[0.98]"
          onClick={onOpenFilterModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="none"
            aria-hidden="true"
            className="opacity-70"
          >
            <path
              fill="currentColor"
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
