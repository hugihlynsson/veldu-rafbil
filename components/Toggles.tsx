import { ReactNode } from 'react'
import clsx from 'clsx'

interface Props<P> {
  /** With an icon, the label is only its name and tooltip */
  items: Array<[label: string, value: P, icon?: ReactNode]>
  onClick: (value: P) => void
  currentValue: P | undefined
  /** Optional adornment rendered after the label of the active item */
  indicator?: ReactNode
  /** Read out after the active item's label, since `indicator` is decorative */
  indicatorLabel?: string
  /** Id of the element naming the group */
  labelledBy?: string
  /** Names the group when nothing on the page does */
  label?: string
  className?: string
}

export default function Toggles<P>({
  items,
  onClick,
  currentValue,
  indicator,
  indicatorLabel,
  labelledBy,
  label,
  className,
}: Props<P>) {
  return (
    <fieldset
      aria-labelledby={labelledBy}
      aria-label={label}
      className={clsx(
        'flex max-w-full m-0 min-w-0 border-0 bg-track self-start rounded-toggle p-0.75 gap-0.75 xs:rounded-xl xs:p-1 xs:gap-1',
        className,
      )}
    >
      {items.map(([label, value, icon]) => (
        <button
          key={label}
          type="button"
          aria-pressed={value === currentValue}
          aria-label={icon ? label : undefined}
          title={icon ? label : undefined}
          className={clsx(
            'border-0 text-xs font-semibold py-1.75 cursor-pointer text-center flex justify-center items-center whitespace-nowrap min-w-0 rounded-[calc(var(--radius-toggle)-3px)] transition duration-200 ease-out relative gap-1',
            'xs:text-control xs:py-2 xs:rounded-[calc(var(--radius-xl)-4px)]',
            icon ? 'px-2.5' : 'px-3 xs:px-4',
            value === currentValue
              ? 'bg-raised text-tint shadow-(--shadow-raised)'
              : 'bg-transparent text-stone hover:text-tint hover:bg-raised/50 active:scale-[0.97]',
          )}
          onClick={() => onClick(value)}
        >
          {icon ? (
            // As tall as a label's line, so a group of icons stands as high
            // as a group of words beside it
            <span className="flex h-lh items-center">{icon}</span>
          ) : (
            label
          )}
          {value === currentValue && indicator}
          {value === currentValue && indicatorLabel && (
            <span className="sr-only">{indicatorLabel}</span>
          )}
        </button>
      ))}
    </fieldset>
  )
}
