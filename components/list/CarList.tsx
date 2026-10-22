'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { trackEvent } from 'fathom-client'

import Car from './NewCar'
import { GridIcon, ListIcon } from './ViewIcons'
import Title from '@/components/Title'
import { pageColumn } from '@/components/pageColumn'
import Intro from './Intro'
import GrantChangeNotice from './GrantChangeNotice'
import Toggles from '@/components/Toggles'
import FilterModal from '@/components/filters/FilterModal'
import ActiveFilters from '@/components/filters/ActiveFilters'
import cars, { type Car as CarData } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPathOf } from '@/modules/detail/paths'
import { carAtPath } from '@/modules/detail/slugs'
import carFilter from '@/modules/list/carFilter'
import {
  fieldsFromFilters,
  filterKeys,
  normalizeFilters,
  type FilterKey,
  type Filters,
} from '@/modules/list/filters'
import {
  sortCars,
  sortingDefinitions,
  type Sorting,
} from '@/modules/list/sorting'
import type { View } from '@/modules/list/view'
import { agree } from '@/modules/copy/plural'
import prefersReducedMotion from '@/utils/prefersReducedMotion'
import { useFilters, useSorting, useView } from '@/utils/useListState'
import { rememberListSearch } from '@/utils/listReturn'
import {
  opensInSheet,
  scrollSheetToTop,
  showCarSheet,
  useListShown,
} from '@/utils/carSheet'
import useComparison from '@/utils/useComparison'
import useInputModality, { getInputModality } from '@/utils/inputModality'
import CompareTray from '@/components/detail/CompareTray'
import type { SheetChat } from '@/components/detail/CarSheet'
import { track } from '@/utils/track'

// Keeps the AI SDK off the list's hydration path. The bar is fixed-position,
// so arriving a moment later shifts nothing.
const ChatContainer = dynamic(() => import('@/components/chat/ChatContainer'), {
  ssr: false,
})

// Fetched as a pointer first reaches the cars, where it would open: a mouse
// passing over, or a tablet's first touch, which is mostly a scroll
const loadCarSheet = () => import('@/components/detail/CarSheet')
const CarSheet = dynamic(loadCarSheet, { ssr: false })

// The header and the line under the list share the text column of a card
const column = `${pageColumn} py-4 xs:py-6`

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
  const { filters, setFilters } = useFilters()
  const { view, setView } = useView()

  const changeSorting = (tapped: Sorting) =>
    track({ name: 'sorting_changed', ...toggleSorting(tapped) })

  const changeView = (next: View) => {
    if (next === view) return
    setView(next)
    trackEvent(next === 'grid' ? 'Switched to grid' : 'Switched to list')
    track({ name: 'view_changed', view: next })
  }

  // The filters as the URL will hold them, so a modal closed with nothing
  // changed is not counted as a change
  const changeFilters = (
    next: Filters,
    source: 'modal' | 'chip' | 'cleared' | 'suggestion',
  ) => {
    const fields = fieldsFromFilters(normalizeFilters(next))
    if (JSON.stringify(fields) === JSON.stringify(fieldsFromFilters(filters))) {
      return
    }
    setFilters(next)
    track({
      name: 'filters_changed',
      source,
      filters: filterKeys.flatMap((key) => {
        const value = fields[key]
        return value === undefined ? [] : [{ key, value }]
      }),
      count: cars.filter(carFilter(next)).length,
    })
  }

  const removeFilterChip = (key: FilterKey) => {
    const rest = { ...filters }
    delete rest[key]
    changeFilters(rest, 'chip')
  }

  const [editingFilters, setEditingFilters] = useState<boolean>(false)
  const controlsRef = useRef<HTMLDivElement>(null)

  // A suggested filter replaces the cars under the reader, so a place halfway
  // down the old list means nothing: bring back the sorting and the filters,
  // and the start of the new list, when they have been scrolled past. Focus
  // stays in the chat input.
  const applySuggestedFilters = (next: Filters) => {
    changeFilters(next, 'suggestion')
    const controls = controlsRef.current
    if (controls && controls.getBoundingClientRect().top < 0) {
      controls.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
    }
  }

  const router = useRouter()
  // A car picked in the chat opens as a card does: in a sheet on a desktop,
  // and otherwise its page, which leads back to the list as it was left
  // From the bar in a sheet, the sheet's own car is scrolled up to, as on its
  // page, and another takes the sheet's place in history
  const showCar = (car: CarData) => {
    rememberListSearch(window.location.search)
    if (sheetCar?.id === car.id) scrollSheetToTop()
    else if (opensInSheet()) showCarSheet(car, sheetCar ? 'replace' : 'push')
    else router.push(carPathOf(car))
  }

  // Open for as long as the URL is the car's, so back closes it
  const sheetCar = carAtPath(usePathname())
  const [sheetChat, setSheetChat] = useState<SheetChat | null>(null)
  useListShown()
  // From the start, so the sheet knows whether a key or a tap opened it
  useInputModality()

  // Closing hands a key's focus back to the card that opened the sheet, which
  // a step through it has since left behind: the list goes to the car last
  // shown instead, focused only for a key, as a tap would ring it. Smooth, so
  // the list is seen to move from where the sheet opened. A task later, as
  // the browser puts back the list's scroll as of opening once the back's
  // popstate is done, which Next renders in, and would cut a scroll short.
  const openedSheetCar = useRef(sheetCar)
  const lastSheetCar = useRef(sheetCar)
  useEffect(() => {
    const opened = openedSheetCar.current
    const last = lastSheetCar.current
    lastSheetCar.current = sheetCar
    if (sheetCar) {
      if (!last) openedSheetCar.current = sheetCar
      return
    }
    if (!last || last.id === opened?.id) return
    const card = document.getElementById(last.id)
    if (!card) return
    const timer = setTimeout(() => {
      card.scrollIntoView({
        block: 'center',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
      if (getInputModality() === 'keyboard') {
        card.focus({ preventScroll: true })
      }
    })
    return () => clearTimeout(timer)
  }, [sheetCar])

  const comparison = useComparison()
  const isComparing = comparison.selected.length > 0

  const toggleCompared = (car: CarData) => {
    const added = !comparison.isSelected(car)
    // A full tray takes no more, and the toggle says so
    if (added && comparison.isFull) return
    comparison.toggle(car)
    track({
      name: 'compare_toggled',
      car: carSlug(car),
      added,
      count: comparison.selected.length + (added ? 1 : -1),
    })
  }

  const removeCompared = (car: CarData) => {
    comparison.remove(car)
    track({
      name: 'compare_toggled',
      car: carSlug(car),
      added: false,
      count: comparison.selected.length - 1,
    })
  }

  const filteredCars = cars.filter(carFilter(filters))
  const shownCars = sortCars(filteredCars, sorting, direction)

  const hasFilter = Object.values(filters).length > 0

  const filteredCarCount = cars.length - filteredCars.length

  return (
    <div className="max-w-page mx-auto">
      <header className={clsx('flex flex-col items-stretch md:pb-10', column)}>
        <Title />

        <Intro />

        <GrantChangeNotice />

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
            onClick={changeSorting}
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
          onRemoveFilter={removeFilterChip}
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

      <div
        className={clsx(view === 'grid' && gridLayout)}
        onPointerEnter={() => {
          if (opensInSheet()) void loadCarSheet()
        }}
      >
        {shownCars.map((car, index) => (
          <Car
            preload={index <= 1}
            position={index}
            car={car}
            key={car.id}
            view={view}
            showValue={sorting === 'value' || Boolean(filters.value)}
            showSeats={Boolean(filters.seats)}
            compared={comparison.isSelected(car)}
            compareFull={comparison.isFull}
            onToggleCompare={() => toggleCompared(car)}
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
              changeFilters({}, 'cleared')
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
          onSubmit={(next) => changeFilters(next, 'modal')}
          onDone={() => setEditingFilters(() => false)}
          getCountPreview={(filters: Filters) =>
            cars.filter(carFilter(filters)).length
          }
        />
      )}

      {isComparing && (
        <CompareTray cars={comparison.selected} onRemove={removeCompared} />
      )}

      {sheetCar && (
        <CarSheet car={sheetCar} shown={shownCars} onChat={setSheetChat} />
      )}

      {/* The tray takes the bar's place while there is a car in it, on the
          page but not over it in the sheet. There the chat is about the
          sheet's car, as it is on the car's page. */}
      <ChatContainer
        hide={editingFilters || (isComparing && !sheetChat)}
        container={sheetChat?.container}
        about={sheetChat && sheetCar ? [sheetCar] : undefined}
        starters={sheetChat?.starters}
        onShowCar={showCar}
        filters={filters}
        onApplyFilters={applySuggestedFilters}
      />
    </div>
  )
}
