import { useRef, useState } from 'react'
import clsx from 'clsx'

import { carCountOf, makesInOrder } from '@/modules/list/makes'
import Modal, { sheetPanel } from '@/components/Modal'
import CloseButton from '@/components/CloseButton'
import { getInputModality } from '@/utils/inputModality'
import { MakeChip } from './MakeRow'

interface Props {
  initialMakes: ReadonlyArray<string>
  onSubmit: (makes: string[]) => void
  /** The cars the list would show with these makes and the other filters */
  getCountPreview: (makes: string[]) => number
  onDone: () => void
}

/**
 * Every make, for the ones the row leaves out. Chosen here and applied on the
 * button, as in the filter modal, so the list does not change under the sheet
 * while it is open. Closed any other way, nothing changes.
 */
export default function MakeSheet({
  initialMakes,
  onSubmit,
  getCountPreview,
  onDone,
}: Props) {
  const [chosen, setChosen] = useState<string[]>(() => [...initialMakes])
  const makesRef = useRef<HTMLFieldSetElement>(null)

  const toggle = (make: string) =>
    setChosen((current) =>
      current.includes(make)
        ? current.filter((other) => other !== make)
        : [...current, make],
    )

  return (
    <Modal
      labelledBy="make-sheet-title"
      onDone={onDone}
      returnFocus="keyboard"
      className={clsx(
        'items-end data-[state=visible]:backdrop:bg-backdrop-strong',
        'sheet-panel:items-center',
      )}
    >
      {({ close }) => (
        // Wider than the filter modal from lg, so four columns fit the
        // longest make with its count
        <section className={clsx(sheetPanel, 'lg:sheet-panel:max-w-176')}>
          <header className="relative bg-surface text-center px-4 py-3 border-b border-line sheet-panel:py-4.5">
            <CloseButton onClick={close} className="sheet-panel:left-4" />
            <h2 id="make-sheet-title" className="m-0 text-lg font-semibold">
              Merki
            </h2>
          </header>
          {/* The scroller is a div: a fieldset will not shrink in a flex
              column, so the makes ran on under the footer */}
          <div className="grow shrink min-h-0 overflow-y-auto p-5 pb-8 sheet-panel:p-6 sheet-panel:pb-8">
            <fieldset
              ref={makesRef}
              aria-labelledby="make-sheet-title"
              className="m-0 min-w-0 border-0 p-0 grid grid-cols-2 gap-1.5 sheet-panel:grid-cols-3 lg:sheet-panel:grid-cols-4"
            >
              {makesInOrder.map((make) => (
                <MakeChip
                  key={make}
                  pressed={chosen.includes(make)}
                  count={carCountOf(make)}
                  fill
                  onClick={() => toggle(make)}
                >
                  {make}
                </MakeChip>
              ))}
            </fieldset>
          </div>
          <footer className="p-4 flex justify-between shadow-(--shadow-sheet-footer) z-1">
            <button
              className="appearance-none border-0 bg-transparent p-0 pl-1 sheet-panel:pl-2 text-stone text-sm font-semibold transition-[color,opacity] duration-200 cursor-pointer hover:enabled:text-tint disabled:opacity-40 disabled:cursor-default"
              disabled={chosen.length === 0}
              onClick={() => {
                setChosen([])
                // Disabling the focused button drops focus out of the sheet
                if (getInputModality() === 'keyboard') {
                  makesRef.current?.querySelector('button')?.focus()
                }
              }}
            >
              Öll merki
            </button>
            <button
              className="appearance-none px-4 pt-2.75 pb-3 bg-sky border-0 rounded-full text-on-sky text-sm font-semibold cursor-pointer transition duration-150 hover:bg-sky-hover active:scale-96 active:duration-75"
              onClick={() => {
                onSubmit(chosen)
                close()
              }}
            >
              Sýna niðurstöður{' '}
              <span className="opacity-80">{getCountPreview(chosen)}</span>
            </button>
          </footer>
        </section>
      )}
    </Modal>
  )
}
