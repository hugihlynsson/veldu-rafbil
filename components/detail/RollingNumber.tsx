import { FunctionComponent, useState } from 'react'
import clsx from 'clsx'

interface Props {
  value: number
}

const motion = {
  up: { in: 'animate-count-up-in', out: 'animate-count-up-out' },
  down: { in: 'animate-count-down-in', out: 'animate-count-down-out' },
} as const

interface Shown {
  value: number
  previous: number | null
}

/**
 * A number that rolls up to a larger value and down to a smaller one. Not
 * clipped, as an overflow would move its baseline off the text beside it.
 *
 * The font is cut without tabular figures, so a digit sits centred in a slot
 * as wide as a 0, Inter's widest but for a 4, and the text after it holds
 * still as the count changes.
 */
const RollingNumber: FunctionComponent<Props> = ({ value }) => {
  const [shown, setShown] = useState<Shown>({ value, previous: null })
  if (shown.value !== value) setShown({ value, previous: shown.value })

  const { previous } = shown
  const direction = previous !== null && value < previous ? 'down' : 'up'

  return (
    <span className="relative inline-block min-w-[1ch] text-center">
      {previous !== null && (
        <span
          key={`${previous}-${value}`}
          aria-hidden
          className={clsx('absolute inset-0', motion[direction].out)}
        >
          {previous}
        </span>
      )}
      <span
        key={value}
        className={clsx(
          'inline-block',
          previous !== null && motion[direction].in,
        )}
      >
        {value}
      </span>
    </span>
  )
}

export default RollingNumber
