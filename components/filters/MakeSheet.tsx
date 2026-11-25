import { useState } from 'react'
import clsx from 'clsx'

import { carCountOf, makesInOrder } from '@/modules/list/makes'
import useScrollEdges from '@/utils/useScrollEdges'
import Modal, { sheetPanel } from '@/components/Modal'
import CloseButton from '@/components/CloseButton'
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
  const edges = useScrollEdges()
  const [chosen, setChosen] = useState<string[]>(() => [...initialMakes])

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
        <section className={sheetPanel}>
          <header
            className={clsx(
              'relative bg-surface text-center px-4 py-3 border-b transition-colors duration-200 sheet-panel:py-4.5',
              edges.scrolled ? 'border-line' : 'border-transparent',
            )}
          >
            <CloseButton onClick={close} className="sheet-panel:left-4" />
            <h2 id="make-sheet-title" className="m-0 text-lg font-semibold">
              Merki
            </h2>
          </header>
          {/* The scroller is a div: a fieldset will not shrink in a flex
              column, so the makes ran on under the footer */}
          <div
            ref={edges.ref}
            className="grow shrink min-h-0 overflow-y-auto p-5 pb-8 sheet-panel:p-6 sheet-panel:pb-8"
          >
            <fieldset
              aria-labelledby="make-sheet-title"
              className="m-0 min-w-0 border-0 p-0 flex flex-wrap gap-1.5"
            >
              <MakeChip
                pressed={chosen.length === 0}
                onClick={() => setChosen([])}
              >
                Öll merki
              </MakeChip>
              {makesInOrder.map((make) => (
                <MakeChip
                  key={make}
                  pressed={chosen.includes(make)}
                  count={carCountOf(make)}
                  onClick={() => toggle(make)}
                >
                  {make}
                </MakeChip>
              ))}
            </fieldset>
          </div>
          <footer
            className={clsx(
              'p-4 flex justify-end z-1 transition-shadow duration-200',
              !edges.atEnd && 'shadow-(--shadow-sheet-footer)',
            )}
          >
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
