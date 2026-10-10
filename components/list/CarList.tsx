'use client'

import { type ReactNode, useRef, useState } from 'react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { trackEvent } from 'fathom-client'

import Car from './NewCar'
import { GridIcon, ListIcon } from './ViewIcons'
import Title from '@/components/Title'
import Intro from './Intro'
import Toggles from '@/components/Toggles'
import FilterModal from '@/components/filters/FilterModal'
import ActiveFilters from '@/components/filters/ActiveFilters'
import cars from '@/modules/data/cars'
import carFilter from '@/modules/list/carFilter'
import type { Filters } from '@/modules/list/filters'
import {
  sortCars,
  sortingDefinitions,
  type Sorting,
} from '@/modules/list/sorting'
import type { View } from '@/modules/list/view'
import { agree } from '@/modules/copy/plural'
import prefersReducedMotion from '@/utils/prefersReducedMotion'
import { useFilters, useSorting, useView } from '@/utils/useListState'
import useRevealCar from '@/utils/useRevealCar'
import useComparison from '@/utils/useComparison'
import CompareTray from '@/components/compare/CompareTray'

// Keeps the AI SDK off the list's hydration path. The bar is fixed-position,
// so arriving a moment later shifts nothing.
const ChatContainer = dynamic(() => import('@/components/chat/ChatContainer'), {
  ssr: false,
})

// The header and the line under the list share the text column of a card
const column =
  'mx-auto max-w-column py-4 px-(--gutter) xs:py-6 md:pl-10 md:pr-6 md:max-w-none'

const carWord = (count: number) => agree(count, 'bíll', 'bílar')

const toggleSortings: Sorting[] = [
  'name',
  'price',
  'range',
  'acceleration',
  'value',
]

// From lg the grid outgrows the page, centred on it and kept clear of the
// window's edges, while the header above stays where the list has it. NewCar's
// grid `sizes` is worked out from these widths: change one, change both.
const gridLayout =
  'md:grid md:grid-cols-2 md:gap-x-6 md:ml-10 md:mr-8 lg:grid-cols-3 lg:mx-[calc((100%_-_min(100vw_-_5rem,_var(--container-grid)))_/_2)]'

const viewItems: Array<[string, View, ReactNode]> = [
  ['Listi', 'list', <ListIcon key="list" />],
  ['Yfirlit', 'grid', <GridIcon key="grid" />],
]

export default function CarList() {
  const { sorting, direction, toggleSorting } = useSorting()
  const { filters, setFilters, removeFilter } = useFilters()
  const { view, setView } = useView()

  const changeView = (next: View) => {
    if (next === view) return
    setView(next)
    trackEvent(next === 'grid' ? 'Switched to grid' : 'Switched to list')
  }

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

  const showCar = useRevealCar(filters, setFilters)

  const comparison = useComparison()
  const isComparing = comparison.selected.length > 0

  const filteredCars = cars.filter(carFilter(filters))

  const hasFilter = Object.values(filters).length > 0

  const filteredCarCount = cars.length - filteredCars.length

  return (
    <div className="max-w-page mx-auto">
      <header className={clsx('flex flex-col items-stretch md:pb-10', column)}>
        <Title />

        <Intro />

        <div
          ref={controlsRef}
          id="sorting-label"
          className="mb-2 text-sm font-semibold scroll-mt-4"
        >
          Raða eftir:
        </div>

        <div className="flex items-start gap-3">
          <Toggles<Sorting>
            currentValue={sorting}
            items={toggleSortings.map((value): [string, Sorting] => [
              sortingDefinitions[value].label,
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

          {/* Below md the grid would be one column, the list again */}
          <div className="hidden md:block">
            <Toggles<View>
              currentValue={view}
              items={viewItems}
              onClick={changeView}
              label="Útlit"
            />
          </div>
        </div>

        <ActiveFilters
          filters={filters}
          onRemoveFilter={removeFilter}
          onOpenFilterModal={() => setEditingFilters(true)}
          filteredCarsCount={filteredCars.length}
        />

        {/* The only feedback a screen reader gets for a sort or a filter, so
            it has to stay mounted to be announced at all */}
        <div aria-live="polite" className="sr-only">
          {`${filteredCars.length} ${carWord(filteredCars.length)} á listanum, raðað eftir ${sortingDefinitions[
            sorting
          ].label.toLowerCase()}, ${direction === 'desc' ? 'lækkandi' : 'hækkandi'} röð.`}
        </div>
      </header>

      <div className={clsx(view === 'grid' && gridLayout)}>
        {sortCars(filteredCars, sorting, direction).map((car, index) => (
          <Car
            preload={index <= 1}
            car={car}
            key={car.id}
            view={view}
            showValue={sorting === 'value' || Boolean(filters.value)}
            showSeats={Boolean(filters.seats)}
            compared={comparison.isSelected(car)}
            compareFull={comparison.isFull}
            onToggleCompare={() => comparison.toggle(car)}
          />
        ))}
      </div>

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
            className="border-0 shrink-0 m-0 mr-2 text-xs font-semibold py-1.25 px-3 rounded-full cursor-pointer text-center flex justify-center items-center bg-cloud transition-colors duration-200 text-tint hover:bg-smoke"
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

      {isComparing && (
        <CompareTray cars={comparison.selected} onRemove={comparison.remove} />
      )}

      {/* The tray takes the bar's place while there is a car in it */}
      <ChatContainer
        hide={editingFilters || isComparing}
        onShowCar={showCar}
        filters={filters}
        onApplyFilters={applySuggestedFilters}
      />
    </div>
  )
}
