import { ReactNode } from 'react'
import clsx from 'clsx'

interface Props<P> {
  items: Array<[string, P]>
  onClick: (value: P) => void
  currentValue: P | undefined
  /** Optional adornment rendered after the label of the active item */
  indicator?: ReactNode
  /** Read out after the active item's label, since `indicator` is decorative */
  indicatorLabel?: string
  /** Id of the element naming the group */
  labelledBy?: string
}

export default function Toggles<P>({
  items,
  onClick,
  currentValue,
  indicator,
  indicatorLabel,
  labelledBy,
}: Props<P>) {
  return (
    <fieldset
      aria-labelledby={labelledBy}
      className="flex max-w-full m-0 min-w-0 border-0 bg-scrim/4 self-start rounded-[10px] p-[3px] gap-[3px] xs:rounded-xl xs:p-1 xs:gap-1"
    >
      {items.map(([label, value]) => (
        <button
          key={label}
          type="button"
          aria-pressed={value === currentValue}
          className={clsx(
            'border-0 text-xs font-semibold py-[7px] px-3 cursor-pointer text-center flex justify-center items-center whitespace-nowrap min-w-0 rounded-[7px] transition-all duration-200 ease-out relative gap-1',
            'xs:text-[13px] xs:py-2 xs:px-4 xs:rounded-lg',
            value === currentValue
              ? 'bg-raised text-tint shadow-(--shadow-raised)'
              : 'bg-transparent text-stone hover:text-tint hover:bg-raised/50 active:scale-[0.97]',
          )}
          onClick={() => onClick(value)}
        >
          {label}
          {value === currentValue && indicator}
          {value === currentValue && indicatorLabel && (
            <span className="sr-only">{indicatorLabel}</span>
          )}
        </button>
      ))}
    </fieldset>
  )
}
