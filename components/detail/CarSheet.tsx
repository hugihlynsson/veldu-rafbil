'use client'

import { FunctionComponent, MouseEvent, useEffect, useRef } from 'react'
import clsx from 'clsx'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPathOf } from '@/modules/detail/paths'
import { reviewOf } from '@/modules/detail/review'
import { similarTo } from '@/modules/detail/similar'
import { carAtPath } from '@/modules/detail/slugs'
import Modal, { panelMotion } from '@/components/Modal'
import CrossIcon from '@/components/CrossIcon'
import ExpandIcon from '@/components/ExpandIcon'
import {
  closeCarSheet,
  holdSheetPanel,
  isPlainClick,
  showCarSheet,
} from '@/utils/carSheet'
import { leavePageBeforeLoad } from '@/utils/pageBeforeLoad'
import { track } from '@/utils/track'
import CarView, { SHEET_TITLE_ID } from './CarView'

interface Props {
  car: Car
}

// Frosted, so they read over the photo and over the text it scrolls into
const sheetButton =
  'flex items-center justify-center w-9 h-9 p-0 rounded-full border border-edge bg-glass/70 backdrop-blur-md text-tint no-underline cursor-pointer shadow-(--shadow-chip) transition duration-100 hover:bg-glass/90 active:scale-[0.95]'

/**
 * A car's page over the list on a desktop, so a look at one car leaves the
 * list where it was. Loaded behind next/dynamic: it carries every car's
 * review, which a visitor who never opens one should not download.
 */
const CarSheet: FunctionComponent<Props> = ({ car }) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const shownCar = useRef(car)
  const path = carPathOf(car)

  // A car linked from this one takes its place, read from its top. The link
  // that opened it is gone with the page it was on, so focus needs a new home.
  // Not on arrival, when the modal has already focused the close button.
  useEffect(() => {
    if (shownCar.current === car) return
    shownCar.current = car
    panelRef.current?.scrollTo({ top: 0 })
    closeRef.current?.focus({ preventScroll: true })
  }, [car])

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
      initialFocusRef={closeRef}
      className="items-center data-[state=visible]:backdrop:bg-backdrop-strong"
    >
      {({ close }) => (
        // Only links are clicked here, and Enter on one clicks it too
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          ref={panelRef}
          onClickCapture={openLinkedCar}
          className={clsx(
            'relative w-[calc(100%-4rem)] max-w-[880px] max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain rounded-sheet bg-surface shadow-(--shadow-modal)',
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
      )}
    </Modal>
  )
}

export default CarSheet
