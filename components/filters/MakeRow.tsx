import { type ReactNode, useState } from 'react'
import clsx from 'clsx'

import { carCountOf, makes, rowMakes } from '@/modules/list/makes'
import { chipOff, chipOn } from './chipTone'

interface ChipProps {
  pressed?: boolean
  label?: string
  /** The cars of the make, quieter beside its name */
  count?: number
  onClick: () => void
  children: ReactNode
}

/** A make to switch on or off, in the row and in the sheet of every make */
export function MakeChip({
  pressed,
  label,
  count,
  onClick,
  children,
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      className={clsx(
        'shrink-0 flex items-center gap-1.5 border-0 rounded-full py-2 px-3.5 text-control font-semibold whitespace-nowrap text-tint cursor-pointer transition duration-200 active:scale-[0.98]',
        pressed ? chipOn : chipOff,
      )}
      onClick={onClick}
    >
      {children}
      {/* The space is for a screen reader, which would read "Tesla8"; the
          flex gap is what spaces it on the page */}
      {count !== undefined && (
        <>
          {' '}
          <span className="font-medium text-stone">{count}</span>
        </>
      )}
    </button>
  )
}

interface Props {
  chosen: ReadonlyArray<string>
  onChange: (makes: string[]) => void
  onShowAll: () => void
}

/**
 * All makes, or the ones chosen of them. A make chosen that the row does not
 * hold, from a link or the sheet of every make, stands after "Öll merki" so it
 * is seen to be on, and stays there once switched off, so no chip moves under
 * a tap. The last chip says how many makes the row leaves out, so it does not
 * read as all there are.
 */
export default function MakeRow({ chosen, onChange, onShowAll }: Props) {
  const [extras, setExtras] = useState<string[]>([])
  const added = chosen.filter(
    (make) => !rowMakes.includes(make) && !extras.includes(make),
  )
  if (added.length > 0) setExtras([...extras, ...added])

  const shown = [...extras, ...added, ...rowMakes]
  const hiddenCount = makes.length - shown.length

  const toggle = (make: string) =>
    onChange(
      chosen.includes(make)
        ? chosen.filter((other) => other !== make)
        : [...chosen, make],
    )

  return (
    // Scrolled sideways below md, out to the screen's edges rather than the
    // column's, which stops short of them from 480px, with the first chip
    // padded back in line with the text. Wrapped from md, kept to the intro's
    // measure, the column the latest news stands beside from lg
    <fieldset
      aria-label="Merki"
      className="m-0 min-w-0 border-0 p-0 flex gap-1.5 mt-4 overflow-x-auto no-scrollbar max-md:mx-[calc(50%-50vw)] max-md:px-[calc(50vw-50%)] max-md:scroll-px-[calc(50vw-50%)] md:flex-wrap md:overflow-visible md:max-w-[33rem]"
    >
      <MakeChip
        pressed={chosen.length === 0}
        onClick={() => {
          if (chosen.length > 0) onChange([])
        }}
      >
        Öll merki
      </MakeChip>
      {shown.map((make) => (
        <MakeChip
          key={make}
          pressed={chosen.includes(make)}
          count={carCountOf(make)}
          onClick={() => toggle(make)}
        >
          {make}
        </MakeChip>
      ))}
      {hiddenCount > 0 && (
        // Opening with the text on the chip, so a voice command naming it
        // finds it
        <MakeChip label={`+${hiddenCount} merki, sýna öll`} onClick={onShowAll}>
          +{hiddenCount} merki
        </MakeChip>
      )}
    </fieldset>
  )
}
