'use client'

import { FunctionComponent, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'

import type { Car } from '@/modules/data/cars'
import carReviews from '@/modules/data/carReviews'
import { carSlug } from '@/modules/data/getCarId'
import { carPathOf } from '@/modules/detail/paths'
import { similarTo } from '@/modules/detail/similar'
import Modal, { panelMotion } from '@/components/Modal'
import CrossIcon from '@/components/CrossIcon'
import ExpandIcon from '@/components/ExpandIcon'
import { closeCarSheet, isPlainClick, showCarSheet } from '@/utils/carSheet'
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
  const path = carPathOf(car)

  // A similar car takes this one's place, read from its top. The link that
  // opened it is gone with the cars it listed, so focus needs a new home.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
    closeRef.current?.focus({ preventScroll: true })
  }, [car])

  return (
    <Modal
      labelledBy={SHEET_TITLE_ID}
      onDone={closeCarSheet}
      initialFocusRef={closeRef}
      className="items-center data-[state=visible]:backdrop:bg-backdrop-strong"
    >
      {({ close }) => (
        <div
          ref={panelRef}
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
                  trackEvent('Car sheet expanded')
                  if (!isPlainClick(event)) return
                  // Loaded in full, as Next would only keep the list under
                  // the address it is already at. In the sheet's place in
                  // history, so back from the page is the list.
                  event.preventDefault()
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
            // Buying advice, which a car no longer sold new is past
            review={car.deprecated ? undefined : carReviews[carSlug(car)]}
            sheet={{
              onOpenCar: (other, event) => {
                if (!isPlainClick(event)) return
                event.preventDefault()
                // In place, so closing the sheet is always back to the list
                showCarSheet(other, 'replace')
              },
            }}
          />
        </div>
      )}
    </Modal>
  )
}

export default CarSheet
