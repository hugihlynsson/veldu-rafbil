import clsx from 'clsx'

import { rowMakes } from '@/modules/list/makes'

const chipClasses =
  'shrink-0 border-0 rounded-full py-2 px-3.5 text-control font-semibold whitespace-nowrap cursor-pointer transition duration-200 active:scale-[0.98]'

interface Props {
  chosen: ReadonlyArray<string>
  onChange: (makes: string[]) => void
}

/**
 * All makes, or the ones chosen of them. A make chosen that the row does not
 * hold, from a link or the search, stands after "Öll merki" so it is seen to
 * be on; the row's own makes keep their places, so none moves under a tap.
 */
export default function MakeRow({ chosen, onChange }: Props) {
  const shown = [
    ...chosen.filter((make) => !rowMakes.includes(make)),
    ...rowMakes,
  ]

  const toggle = (make: string) =>
    onChange(
      chosen.includes(make)
        ? chosen.filter((other) => other !== make)
        : [...chosen, make],
    )

  const chip = (label: string, pressed: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      aria-pressed={pressed}
      className={clsx(
        chipClasses,
        pressed
          ? 'bg-sky text-on-sky hover:bg-sky-hover'
          : 'bg-cloud text-tint hover:bg-smoke',
      )}
      onClick={onClick}
    >
      {label}
    </button>
  )

  return (
    // Scrolled sideways on a phone, out to the screen's edges; wrapped from
    // md, where the row nearly fits and nothing should hide past the edge
    <fieldset
      aria-label="Merki"
      className="m-0 min-w-0 border-0 p-0 flex gap-2 mt-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:-mx-(--gutter) max-md:px-(--gutter) max-md:scroll-px-(--gutter) md:flex-wrap md:overflow-visible"
    >
      {chip('Öll merki', chosen.length === 0, () => {
        if (chosen.length > 0) onChange([])
      })}
      {shown.map((make) =>
        chip(make, chosen.includes(make), () => toggle(make)),
      )}
    </fieldset>
  )
}
