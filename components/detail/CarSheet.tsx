'use client'

import {
  FunctionComponent,
  MouseEvent,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPathOf } from '@/modules/detail/paths'
import { reviewOf } from '@/modules/detail/review'
import { similarTo } from '@/modules/detail/similar'
import { carAtPath } from '@/modules/detail/slugs'
import { neighboursOf } from '@/modules/list/neighbours'
import type { SheetStep } from '@/modules/detail/sheetStep'
import Modal, { panelMotion } from '@/components/Modal'
import CrossIcon from '@/components/CrossIcon'
import ExpandIcon from '@/components/ExpandIcon'
import ChevronIcon from '@/components/ChevronIcon'
import {
  closeCarSheet,
  holdSheetPanel,
  isPlainClick,
  sheetStepOf,
  showCarSheet,
} from '@/utils/carSheet'
import { getInputModality } from '@/utils/inputModality'
import { leavePageBeforeLoad } from '@/utils/pageBeforeLoad'
import { track } from '@/utils/track'
import CarView, { SHEET_TITLE_ID } from './CarView'

/** The chat bar's place in the sheet, and what it offers to ask there */
export interface SheetChat {
  container: HTMLElement
  starters?: ReadonlyArray<string>
}

interface Props {
  car: Car
  /** The list as sorted and filtered, which the sheet steps through */
  shown: ReadonlyArray<Car>
  /** Where the chat bar goes, as showModal() makes the page behind inert */
  onChat: (chat: SheetChat | null) => void
}

// Frosted, so they read over the photo and over the text it scrolls into
const glassButton =
  'flex items-center justify-center p-0 rounded-full border border-edge bg-glass/70 backdrop-blur-md text-tint no-underline cursor-pointer shadow-(--shadow-chip) transition duration-100 hover:bg-glass/90 active:scale-[0.95]'

const sheetButton = clsx(glassButton, 'w-9 h-9')

// aria-disabled rather than disabled, so a press at the end keeps its focus
const stepButton = clsx(
  glassButton,
  'shrink-0 w-11 h-11 aria-disabled:opacity-40 aria-disabled:cursor-default aria-disabled:hover:bg-glass/70 aria-disabled:active:scale-100',
)

// After the panel has started to rise, out from beside it rather than up with it
const stepMotion =
  'shrink-0 opacity-0 transition-[opacity,translate] duration-300 ease-in-cubic group-data-[state=visible]/modal:opacity-100 group-data-[state=visible]/modal:translate-x-0 group-data-[state=visible]/modal:ease-out-cubic group-data-[state=visible]/modal:delay-150 group-data-[state=leaving]/modal:duration-150'

const steps = {
  previous: {
    label: 'Fyrri bíll',
    key: 'ArrowLeft',
    chevron: 'left',
    from: 'translate-x-3',
  },
  next: {
    label: 'Næsti bíll',
    key: 'ArrowRight',
    chevron: 'right',
    from: '-translate-x-3',
  },
} as const

/**
 * A car's page over the list on a desktop, so a look at one car leaves the
 * list where it was. Loaded behind next/dynamic: it carries every car's
 * review, which a visitor who never opens one should not download.
 */
const CarSheet: FunctionComponent<Props> = ({ car, shown, onChat }) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const chatSlotRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const shownCar = useRef(car)
  const path = carPathOf(car)
  const { previous, next } = neighboursOf(shown, car)

  // The close button for a keyboard, to start from; for a tap or a click the
  // panel, as focus moved by script rings what it lands on, and on the panel
  // the keys scroll the sheet
  const focusStart = () =>
    getInputModality() === 'keyboard' ? closeRef : panelRef
  const [initialFocusRef] = useState(focusStart)

  // A car linked from this one takes its place, read from its top. The link
  // that opened it is gone with the page it was on, so focus needs a new home.
  // Not on arrival, when the modal has already focused where it starts, nor
  // from a step button, which is still there to press again.
  useEffect(() => {
    if (shownCar.current === car) return
    shownCar.current = car
    panelRef.current?.scrollTo({ top: 0 })
    const focused = document.activeElement
    if (focused === previousRef.current || focused === nextRef.current) return
    focusStart().current?.focus({ preventScroll: true })
  }, [car])

  // From the address rather than the render, which a second quick press can
  // beat. In place in history, as a linked car is, so closing is back to the list.
  const step = (to: SheetStep, method: 'key' | 'button') => {
    const other = neighboursOf(
      shown,
      carAtPath(window.location.pathname) ?? car,
    )[to]
    if (!other) return
    track({
      name: 'car_sheet_stepped',
      car: carSlug(other),
      direction: to,
      method,
    })
    showCarSheet(other, 'replace')
  }

  const stepByKey = useEffectEvent((event: KeyboardEvent) => {
    const to = sheetStepOf(event, panelRef.current?.closest('dialog'))
    if (!to) return
    event.preventDefault()
    step(to, 'key')
  })

  const stepButtonTo = (to: SheetStep) => {
    const other = to === 'previous' ? previous : next
    return (
      <div className={clsx(stepMotion, steps[to].from)}>
        <button
          ref={to === 'previous' ? previousRef : nextRef}
          type="button"
          title={other?.label}
          aria-label={steps[to].label}
          aria-keyshortcuts={steps[to].key}
          aria-disabled={!other}
          className={stepButton}
          onClick={(event) => {
            // Safari does not focus a clicked button, and focus left on the
            // body would be moved to close
            event.currentTarget.focus({ preventScroll: true })
            step(to, 'button')
          }}
        >
          <ChevronIcon size={16} direction={steps[to].chevron} />
        </button>
      </div>
    )
  }
  const canStep = Boolean(previous || next)

  // On the window: a click on the sheet's text leaves the focus on the body
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => stepByKey(event)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // The review's questions come from here, which the list would otherwise
  // load with every car's review. Layout, so the bar is in before a paint.
  useLayoutEffect(() => {
    const container = chatSlotRef.current
    if (!container) return
    onChat({ container, starters: reviewOf(car)?.questions })
    return () => onChat(null)
  }, [car, onChat])

  // How far down it is read is the panel's scroll, the page being locked
  useEffect(() => {
    const panel = panelRef.current
    return panel ? holdSheetPanel(panel) : undefined
  }, [])

  // Every link to another car's page, wherever the page has one, so none
  // leaves the sheet for a page with the list gone from under it. Captured,
  // as a Link navigates in its own click unless that is prevented first. In
  // place in history, so closing the sheet is always back to the list.
  const openLinkedCar = (event: MouseEvent) => {
    if (!isPlainClick(event) || !(event.target instanceof Element)) return
    const link = event.target.closest('a')
    if (!link || link.origin !== window.location.origin || link.target) return
    const other = carAtPath(link.pathname)
    // The expand button links to this car, and opens its page on its own
    if (!other || other.id === car.id) return
    event.preventDefault()
    showCarSheet(other, 'replace')
  }

  return (
    <Modal
      labelledBy={SHEET_TITLE_ID}
      onDone={closeCarSheet}
      initialFocusRef={initialFocusRef}
      returnFocus="keyboard"
      className="items-center data-[state=visible]:backdrop:bg-backdrop-strong"
    >
      {({ close }) => (
        <>
          {/* Its gaps are the backdrop's, which a click there closes */}
          <div className="flex items-center gap-4 pointer-events-none *:pointer-events-auto">
            {canStep && stepButtonTo('previous')}
            {/* The car page's photo width, which is the list's content, less
                room at either side for a step button and its gap, kept when
                there are none so the sheet is one width. CarView's sheet
                `sizes` is worked out from it. */}
            {/* Only links are clicked here, and Enter on one clicks it too */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              ref={panelRef}
              tabIndex={-1}
              onClickCapture={openLinkedCar}
              className={clsx(
                'relative w-[min(960px,calc(100vw-11.5rem))] max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain outline-none rounded-sheet bg-surface shadow-(--shadow-modal)',
                panelMotion,
              )}
            >
              {/* No height of its own, so the photo starts at the sheet's top */}
              <div className="sticky top-0 z-2 h-0">
                <div className="absolute top-4 right-4 flex gap-2">
                  <a
                    href={path}
                    title="Opna síðu bílsins"
                    aria-label="Opna síðu bílsins"
                    className={sheetButton}
                    onClick={(event) => {
                      // Through track rather than Fathom, whose beacon the load
                      // can cancel: track sends what is waiting as the page hides
                      track({ name: 'car_sheet_expanded', car: carSlug(car) })
                      if (!isPlainClick(event)) return
                      // Loaded in full, as Next would only keep the list under
                      // the address it is already at. In the sheet's place in
                      // history, so back from the page is the list.
                      event.preventDefault()
                      leavePageBeforeLoad('car')
                      window.location.replace(path)
                    }}
                  >
                    <ExpandIcon size={14} />
                  </a>
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Loka"
                    className={sheetButton}
                    onClick={close}
                  >
                    <CrossIcon size={12} />
                  </button>
                </div>
              </div>

              <CarView
                car={car}
                similar={similarTo(car)}
                review={reviewOf(car)}
                sheet
              />
            </div>
            {canStep && stepButtonTo('next')}
          </div>
          {/* Beside the panel: its translate would hold the fixed bar inside */}
          <div ref={chatSlotRef} className="contents" />
        </>
      )}
    </Modal>
  )
}

export default CarSheet
