import { FunctionComponent } from 'react'
import clsx from 'clsx'

import { MAX_COMPARED } from '@/modules/detail/comparison'
import PlusIcon from '@/components/PlusIcon'

interface Props {
  selected: boolean
  /** Every slot in the tray is taken, so only a picked car can be let go */
  full: boolean
  onToggle: () => void
  className?: string
}

// Drawn rather than ✓, which sits off its glyph's centre
const CheckIcon = () => (
  <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="m2.5 7.5 3 3 6-7"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Adds a car to the comparison tray, or takes it out: an icon the size of the
 * card's share button, as the tray beneath says what it does once pressed
 */
const CompareToggle: FunctionComponent<Props> = ({
  selected,
  full,
  onToggle,
  className,
}) => {
  const said =
    full && !selected
      ? `Mest ${MAX_COMPARED} bílar í einu`
      : selected
        ? 'Í samanburði'
        : 'Bera saman'
  return (
    <button
      type="button"
      aria-label="Bera saman"
      aria-pressed={selected}
      disabled={full && !selected}
      title={said}
      onClick={onToggle}
      className={clsx(
        'inline-flex items-center justify-center shrink-0 w-7.5 h-7.5 rounded-full border cursor-pointer transition duration-100 active:enabled:scale-[0.95] disabled:cursor-not-allowed disabled:text-clay disabled:border-line',
        selected
          ? 'bg-sky border-sky text-on-sky hover:bg-sky-hover hover:border-sky-hover'
          : 'bg-transparent border-line-chip text-tint hover:enabled:bg-cloud',
        className,
      )}
    >
      {selected ? <CheckIcon /> : <PlusIcon size={14} />}
    </button>
  )
}

export default CompareToggle
