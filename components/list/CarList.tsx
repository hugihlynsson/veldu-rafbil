'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

import Car from './NewCar'
import Title from '@/components/Title'
import Toggles from '@/components/Toggles'
import FilterModal from '@/components/filters/FilterModal'
import ActiveFilters from '@/components/filters/ActiveFilters'
import cars, { type Car as CarData } from '@/modules/data/cars'
import carFilter, { filtersShowing } from '@/modules/list/carFilter'
import type { Filters } from '@/modules/list/filters'
import type { Sorting } from '@/modules/list/sorting'
import { sortCars } from '@/modules/list/sorting'
import { agree } from '@/modules/copy/plural'
import { grantAmountText, grantCeilingText } from '@/modules/copy/grantCopy'
import prefersReducedMotion from '@/utils/prefersReducedMotion'
import useBodyScrollLock from '@/utils/useBodyScrollLock'
import { useFilters, useSorting } from '@/utils/useListState'

// Keeps the AI SDK off the list's hydration path. The bar is fixed-position,
// so arriving a moment later shifts nothing.
const ChatContainer = dynamic(() => import('@/components/chat/ChatContainer'), {
  ssr: false,
})

// The header and the line under the list share the text column of a card
const column =
  'mx-auto max-w-column py-4 px-(--gutter) xs:py-6 md:pl-10 md:pr-6 md:max-w-none'

const carWord = (count: number) => agree(count, 'bíll', 'bílar')

const sortingLabels: Record<Sorting, string> = {
  name: 'Nafni',
  price: 'Verði',
  range: 'Drægni',
  acceleration: 'Hröðun',
  value: 'Verði á km',
  fastcharge: 'Hraðhleðslu',
}

const toggleSortings: Sorting[] = [
  'name',
  'price',
  'range',
  'acceleration',
  'value',
]

export default function CarList() {
  const { sorting, direction, toggleSorting } = useSorting()
  const { filters, setFilters, removeFilter } = useFilters()

  const [editingFilters, setEditingFilters] = useState<boolean>(false)
  const controlsRef = useRef<HTMLDivElement>(null)

  // A suggested filter replaces the cars under the reader, so a place halfway
  // down the old list means nothing: bring back the sorting and the filters,
  // and the start of the new list, when they have been scrolled past. Focus
  // stays in the chat input.
  const applySuggestedFilters = (next: Filters) => {
    setFilters(next)
    const controls = controlsRef.current
    if (controls && controls.getBoundingClientRect().top < 0) {
      controls.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
    }
  }

  // The chat can point at a car the filters are hiding, and its card is only
  // there to scroll to once the render without them has happened
  const carToReveal = useRef<string | null>(null)

  const revealCar = (id: string) => {
    const card = document.getElementById(id)
    if (!card) return
    card.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    })
    // Without this the reader is scrolled somewhere their focus is not
    card.focus({ preventScroll: true })
  }

  const showCar = (car: CarData) => {
    if (carFilter(filters)(car)) return revealCar(car.id)
    carToReveal.current = car.id
    setFilters(filtersShowing(filters, car))
  }

  useEffect(() => {
    if (!carToReveal.current) return
    revealCar(carToReveal.current)
    carToReveal.current = null
  })

  useBodyScrollLock(editingFilters)

  const filteredCars = cars.filter(carFilter(filters))

  const hasFilter = Object.values(filters).length > 0

  const filteredCarCount = cars.length - filteredCars.length

  return (
    <div className="max-w-page mx-auto">
      <header className={clsx('flex flex-col items-stretch md:pb-10', column)}>
        <Title />

        <p className="leading-6 text-sm pt-6 m-0 mb-8 text-stone max-w-[33em] text-pretty md:text-base">
          Listi yfir alla {cars.length} bílana sem eru seldir á Íslandi og eru
          100% rafdrifnir. Upplýsingar um drægni eru samkvæmt{' '}
          <a
            href="http://wltpfacts.eu/"
            className="no-underline font-semibold text-tint hover:underline"
          >
            WLTP
          </a>{' '}
          mælingum frá framleiðenda en raundrægni er háð aðstæðum og
          aksturslagi.
          <span className="inline-block text-xs text-stone mt-2">
            Kaupendur nýskráðra rafbíla sem kosta minna en {
              grantCeilingText
            }{' '}
            eiga kost á að{' '}
            <a
              href="https://island.is/rafbilastyrkir"
              className="no-underline font-semibold text-tint hover:underline"
            >
              sækja um {grantAmountText} rafbílastyrk
            </a>
            .
          </span>
        </p>

        <div
          ref={controlsRef}
          id="sorting-label"
          className="mb-2 text-sm font-semibold scroll-mt-4"
        >
          Raða eftir:
        </div>

        <Toggles<Sorting>
          currentValue={sorting}
          items={toggleSortings.map((value): [string, Sorting] => [
            sortingLabels[value],
            value,
          ])}
          onClick={toggleSorting}
          labelledBy="sorting-label"
          indicatorLabel={
            direction === 'desc' ? 'lækkandi röð' : 'hækkandi röð'
          }
          indicator={
            <span
              aria-hidden
              className={clsx(
                'leading-none ease-in-out transition-transform duration-150 -mr-1',
                direction === 'desc' && 'rotate-180',
              )}
            >
              ↑
            </span>
          }
        />

        <ActiveFilters
          filters={filters}
          onRemoveFilter={removeFilter}
          onOpenFilterModal={() => setEditingFilters(true)}
          filteredCarsCount={filteredCars.length}
        />

        {/* The only feedback a screen reader gets for a sort or a filter, so
            it has to stay mounted to be announced at all */}
        <div aria-live="polite" className="sr-only">
          {`${filteredCars.length} ${carWord(filteredCars.length)} á listanum, raðað eftir ${sortingLabels[
            sorting
          ].toLowerCase()}, ${direction === 'desc' ? 'lækkandi' : 'hækkandi'} röð.`}
        </div>
      </header>

      {sortCars(filteredCars, sorting, direction).map((car, index) => (
        <Car
          preload={index <= 1}
          car={car}
          key={car.id}
          showValue={sorting === 'value' || Boolean(filters.value)}
          showSeats={Boolean(filters.seats)}
        />
      ))}

      {hasFilter && filteredCarCount > 0 && (
        <div
          className={clsx(
            'flex items-center gap-2 text-xs font-medium mb-10',
            column,
          )}
        >
          {filteredCarCount} {carWord(filteredCarCount)}{' '}
          {agree(filteredCarCount, 'passaði', 'pössuðu')} ekki við leitina{' '}
          <button
            className="border-0 shrink-0 m-0 mr-2 text-xs font-semibold py-[5px] px-3 rounded-full cursor-pointer text-center flex justify-center items-center bg-cloud transition-all duration-200 text-tint hover:bg-smoke"
            onClick={(_event) => {
              setFilters({})
              window.scrollTo({ top: 0 })
            }}
          >
            Sýna alla
          </button>
        </div>
      )}

      {editingFilters && (
        <FilterModal
          initialFilters={filters}
          onSubmit={setFilters}
          onDone={() => setEditingFilters(() => false)}
          getCountPreview={(filters: Filters) =>
            cars.filter(carFilter(filters)).length
          }
        />
      )}

      <ChatContainer
        hide={editingFilters}
        onShowCar={showCar}
        filters={filters}
        onApplyFilters={applySuggestedFilters}
      />
    </div>
  )
}
