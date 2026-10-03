import type { Filters } from '@/modules/list/filters'
import addDecimalSeprators from '@/modules/copy/addDecimalSeparators'
import { agree } from '@/modules/copy/plural'
import SearchIcon from '@/components/SearchIcon'

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

/** How a filter reads on a chip, applied or suggested */
export const filterChipText = <Key extends keyof Filters>(
  name: Key,
  value: NonNullable<Filters[Key]>,
): ChipText => (chipText[name] as (value: unknown) => ChipText)(value)

// In the order the chips have always stood, whatever order the filters came in
const chipOrder = Object.keys(chipText) as Array<keyof Filters>

const activeChips = (filters: Filters) =>
  chipOrder.flatMap((name) => {
    const value = filters[name]
    if (value === undefined) return []
    return [{ name, ...filterChipText(name, value) }]
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
          <SearchIcon size={15} className="opacity-70" />
          Leita
        </button>
      </div>
    </div>
  )
}

export default ActiveFilters
