import { useRef, type FunctionComponent } from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { comparisonPathOf } from '@/modules/detail/paths'
import { MAX_COMPARED, MIN_COMPARED } from '@/modules/detail/comparison'
import { getInputModality } from '@/utils/inputModality'
import { rememberListSearch } from '@/utils/listReturn'
import CrossIcon from '@/components/CrossIcon'
import PlusIcon from '@/components/PlusIcon'
import RollingNumber from './RollingNumber'
import { track } from '@/utils/track'

// The similar-cars list waits until a car is in the tray, off the list's
// first load
const CompareSuggestions = dynamic(() => import('./CompareSuggestions'), {
  ssr: false,
})

interface Props {
  cars: ReadonlyArray<Car>
  onRemove: (car: Car) => void
  onAdd: (car: Car) => void
}

const slot = 'relative h-12 w-18 shrink-0 rounded-xl'
const button =
  'inline-flex items-center shrink-0 py-1.5 px-3.5 text-sm font-semibold rounded-full no-underline'

/**
 * The cars picked to compare, in the chat bar's place at the foot of the
 * list. It goes once the last car is taken out of it, and the bar comes back.
 */
const CompareTray: FunctionComponent<Props> = ({ cars, onRemove, onAdd }) => {
  const ready = cars.length >= MIN_COMPARED
  const suggesting = cars.length < MAX_COMPARED

  // A pill picked by key goes as the car it named arrives, and would take the
  // focus with it to the page's start: it goes on to the comparison instead
  const focusCompare = useRef(false)
  const add = (car: Car) => {
    focusCompare.current = getInputModality() === 'keyboard'
    onAdd(car)
  }

  return (
    <div
      className="fixed bottom-[calc(1rem+var(--keyboard-inset))] left-1/2 -translate-x-1/2 z-1000 pointer-events-none flex flex-col-reverse items-center gap-3 sm:bottom-[calc(1.5rem+var(--keyboard-inset))]"
      // Read by the footer, which makes room for the pills
      data-compare-suggestions={suggesting || undefined}
    >
      <section
        aria-label="Samanburður"
        className="pointer-events-auto w-[min(25rem,calc(100vw-1.5rem))] animate-bar-in"
      >
        <div className="flex flex-col gap-2 p-2 bg-veil/70 backdrop-blur-xl rounded-sheet shadow-(--shadow-pill) border border-edge">
          <div className="flex items-center justify-between gap-3 pl-1.5">
            <h2 className="m-0 text-sm font-semibold">
              Samanburður{' '}
              <span className="font-medium text-stone">
                <RollingNumber value={cars.length} /> af {MAX_COMPARED}
              </span>
            </h2>

            {ready ? (
              <Link
                href={comparisonPathOf(cars)}
                ref={(link) => {
                  if (!link || !focusCompare.current) return
                  focusCompare.current = false
                  link.focus()
                }}
                onClick={() => {
                  rememberListSearch(window.location.search)
                  trackEvent('Comparison opened')
                  track({
                    name: 'comparison_opened',
                    cars: cars.map(carSlug),
                    source: 'tray',
                  })
                }}
                className={clsx(
                  button,
                  'bg-sky text-on-sky transition duration-100 hover:bg-sky-hover active:scale-96 active:duration-75',
                )}
              >
                Bera saman <span aria-hidden>&nbsp;→</span>
              </Link>
            ) : (
              <span
                aria-disabled
                className={clsx(button, 'bg-cloud text-clay')}
              >
                Bera saman <span aria-hidden>&nbsp;→</span>
              </span>
            )}
          </div>

          <ul className="flex gap-1.5 m-0 p-0 list-none">
            {cars.map((car) => (
              <li key={car.id} className={clsx(slot, 'animate-bar-in')}>
                {/* The size the box renders at, so the pair lands on 128 */}
                <Image
                  alt={car.label}
                  src={`/images/${car.heroImageName}.jpg`}
                  width={72}
                  height={48}
                  className="w-full h-full object-cover rounded-xl block"
                />
                <button
                  type="button"
                  aria-label={`Taka ${car.label} úr samanburði`}
                  onClick={() => onRemove(car)}
                  // A hit area past the small badge it draws
                  className="absolute -top-2.5 -right-2.5 p-1 border-0 bg-transparent cursor-pointer group"
                >
                  <span
                    aria-hidden
                    className="flex w-5 h-5 items-center justify-center rounded-full bg-tint text-lab transition-colors duration-100 group-hover:bg-tint/80"
                  >
                    <CrossIcon size={8} />
                  </span>
                </button>
              </li>
            ))}

            {cars.length < MAX_COMPARED && (
              <li
                className={clsx(
                  slot,
                  'flex items-center justify-center gap-1.5 border border-dashed border-line-strong text-xs font-medium text-stone',
                  !ready && 'grow',
                )}
              >
                <PlusIcon size={10} />
                {ready ? (
                  <span className="sr-only">Pláss fyrir annan bíl</span>
                ) : (
                  'Veldu annan bíl'
                )}
              </li>
            )}
          </ul>
        </div>
      </section>

      <CompareSuggestions cars={cars} onAdd={add} />
    </div>
  )
}

export default CompareTray
