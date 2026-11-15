import { useState } from 'react'
import clsx from 'clsx'

import { carCountOf, makesInOrder } from '@/modules/list/makes'
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
          <header className="relative bg-surface text-center px-4 py-3 border-b border-line">
            <CloseButton onClick={close} />
            <h2 id="make-sheet-title" className="m-0 text-lg font-semibold">
              Merki
            </h2>
          </header>
          <fieldset
            aria-labelledby="make-sheet-title"
            className="m-0 min-w-0 border-0 flex flex-wrap content-start gap-2 grow shrink overflow-y-auto p-5 pb-8"
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
                onClick={() => toggle(make)}
              >
                {make}
                <span className="font-medium text-stone">
                  {carCountOf(make)}
                </span>
              </MakeChip>
            ))}
          </fieldset>
          <footer className="p-4 flex justify-end shadow-(--shadow-sheet-footer) z-1">
            <button
              className="appearance-none px-4 pt-2.75 pb-3 bg-sky border-0 rounded-full text-on-sky text-sm font-semibold cursor-pointer transition duration-200 hover:bg-sky-hover active:scale-[0.98]"
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
