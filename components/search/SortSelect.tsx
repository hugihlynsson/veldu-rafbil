import ChevronIcon from '@/components/ChevronIcon'
import type {
  Sorting,
  SortingDirection,
  SortingState,
} from '@/modules/list/sorting'

// Each sorting the way round people ask for it, and price and range the
// other way too, the only two anyone reads from the far end
const options: Array<[label: string, state: SortingState]> = [
  ['Lægsta verði', { sorting: 'price', direction: 'asc' }],
  ['Hæsta verði', { sorting: 'price', direction: 'desc' }],
  ['Mestu drægni', { sorting: 'range', direction: 'desc' }],
  ['Minnstu drægni', { sorting: 'range', direction: 'asc' }],
  ['Lægsta verði á km', { sorting: 'value', direction: 'asc' }],
  ['Hraðustu hleðslu', { sorting: 'fastcharge', direction: 'desc' }],
  ['Mestu hröðun', { sorting: 'acceleration', direction: 'asc' }],
  ['Nafni', { sorting: 'name', direction: 'asc' }],
]

const keyOf = ({ sorting, direction }: SortingState) =>
  `${sorting}:${direction}`

interface Props {
  sorting: Sorting
  direction: SortingDirection
  onChange: (state: SortingState) => void
}

/**
 * The sorting as one control beside the count. A native select under a pill,
 * so a phone gives it its own picker, and a sorting a link flipped that the
 * options leave out still reads as itself.
 */
export default function SortSelect({ sorting, direction, onChange }: Props) {
  const current = keyOf({ sorting, direction })
  const shown = options.some(([, state]) => keyOf(state) === current)
    ? options
    : [
        ...options,
        [
          `${direction === 'asc' ? 'Hækkandi' : 'Lækkandi'} röð`,
          { sorting, direction },
        ] as [string, SortingState],
      ]
  const label = shown.find(([, state]) => keyOf(state) === current)?.[0]

  return (
    <label className="relative flex items-center gap-1.5 rounded-full bg-cloud py-2 pl-3.5 pr-3 text-control font-semibold text-tint cursor-pointer transition-colors duration-150 hover:bg-smoke has-focus-visible:outline-2 has-focus-visible:outline-focus">
      <span className="font-medium text-stone">Raðað eftir</span>
      {label}
      <ChevronIcon size={12} direction="down" className="text-stone" />
      <select
        className="absolute inset-0 opacity-0 cursor-pointer appearance-none"
        value={current}
        onChange={(event) => {
          const picked = shown.find(
            ([, state]) => keyOf(state) === event.target.value,
          )
          if (picked) onChange(picked[1])
        }}
      >
        {shown.map(([optionLabel, state]) => (
          <option key={keyOf(state)} value={keyOf(state)}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  )
}
