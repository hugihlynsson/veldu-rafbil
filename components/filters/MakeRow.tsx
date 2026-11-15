import { type ReactNode, useState } from 'react'
import clsx from 'clsx'

import { makes, rowMakes } from '@/modules/list/makes'
import { chipOff, chipOn } from './chipTone'

interface ChipProps {
  pressed?: boolean
  label?: string
  onClick: () => void
  children: ReactNode
}

/** A make to switch on or off, in the row and in the sheet of every make */
export function MakeChip({ pressed, label, onClick, children }: ChipProps) {
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
    // Scrolled sideways below md, out past the gutters; wrapped from md, where
    // the row nearly fits and nothing should hide past the edge
    <fieldset
      aria-label="Merki"
      className="m-0 min-w-0 border-0 p-0 flex gap-2 mt-4 overflow-x-auto no-scrollbar max-md:-mx-(--gutter) max-md:px-(--gutter) max-md:scroll-px-(--gutter) md:flex-wrap md:overflow-visible"
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
          onClick={() => toggle(make)}
        >
          {make}
        </MakeChip>
      ))}
      {hiddenCount > 0 && (
        <MakeChip label={`Sýna öll ${makes.length} merkin`} onClick={onShowAll}>
          +{hiddenCount} merki
        </MakeChip>
      )}
    </fieldset>
  )
}
