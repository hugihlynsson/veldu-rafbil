import { FunctionComponent } from 'react'
import clsx from 'clsx'

import { MAX_COMPARED } from '@/modules/compare/comparison'

interface Props {
  selected: boolean
  /** Every slot in the tray is taken, so only a picked car can be let go */
  full: boolean
  onToggle: () => void
  className?: string
}

const CompareToggle: FunctionComponent<Props> = ({
  selected,
  full,
  onToggle,
  className,
}) => (
  <button
    type="button"
    aria-pressed={selected}
    disabled={full && !selected}
    title={full && !selected ? `Mest ${MAX_COMPARED} bílar í einu` : undefined}
    onClick={onToggle}
    className={clsx(
      'inline-flex items-center shrink-0 py-1 px-3 text-sm font-semibold rounded-full border cursor-pointer transition duration-100 active:enabled:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
      selected
        ? 'bg-sky border-sky text-on-sky hover:bg-sky-hover hover:border-sky-hover'
        : 'bg-transparent border-line-chip text-tint hover:enabled:bg-cloud',
      className,
    )}
  >
    <span aria-hidden className="mr-1.25 -ml-0.5">
      {selected ? '✓' : '+'}
    </span>
    {selected ? 'Í samanburði' : 'Bera saman'}
  </button>
)

export default CompareToggle
