'use client'

import {
  type ReactNode,
  type SyntheticEvent,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { trackEvent } from 'fathom-client'

import Car from './NewCar'
import { GridIcon, ListIcon } from './ViewIcons'
import Title from '@/components/Title'
import { pageColumn } from '@/components/pageColumn'
import type { LatestNews as LatestNewsLine } from '@/modules/news/news'
import Intro from './Intro'
import LatestNews from './LatestNews'
import Toggles from '@/components/Toggles'
import ActiveFilters from '@/components/filters/ActiveFilters'
import MakeRow from '@/components/filters/MakeRow'
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
import { liftMakes } from '@/modules/list/makes'
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
import { prefetchCarReview } from '@/utils/carFiles'
import useComparison, {
  addComparedCar,
  toggleComparedCar,
} from '@/utils/useComparison'
import useInputModality, { getInputModality } from '@/utils/inputModality'
import type { SheetChat } from '@/components/detail/CarSheet'
import { track } from '@/utils/track'
import afterLoad from '@/utils/afterLoad'
import type { TrackedEvent } from '@/modules/analytics/events'
import useChatSettings from '@/utils/chatSlot'

// Fetched as a pointer first reaches the cars, where it would open: a mouse
// passing over, or a tablet's first touch, which is mostly a scroll
const loadCarSheet = () => import('@/components/detail/CarSheet')
const CarSheet = dynamic(loadCarSheet, { ssr: false })

// Shown only once they are opened, or once a car is in the tray, so they are
// fetched after the page has loaded, off the bandwidth the first photo needs,
// and are in by the time anyone taps
const loadFilterModal = () => import('@/components/filters/FilterModal')
const FilterModal = dynamic(loadFilterModal, { ssr: false })
const loadMakeSheet = () => import('@/components/filters/MakeSheet')
const MakeSheet = dynamic(loadMakeSheet, { ssr: false })
const loadCompareTray = () => import('@/components/detail/CompareTray')
const CompareTray = dynamic(loadCompareTray, { ssr: false })

// The header and the line under the list share the text column of a card
const column = `${pageColumn} py-4 xs:py-6`

const carWord = (count: number) => agree(count, 'bíll', 'bílar')

const toggleSortings: Sorting[] = [
  'price',
  'range',
  'value',
  'acceleration',
  'name',
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

interface Props {
  /** Worked out on the server, so the change log never reaches the browser */
  latest?: LatestNewsLine
}

type FilterChangeSource = Extract<
  TrackedEvent,
  { name: 'filters_changed' }
>['source']

export default function CarList({ latest }: Props) {
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
  const changeFilters = (requested: Filters, source: FilterChangeSource) => {
    const next = liftMakes(requested)
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
  const [choosingMakes, setChoosingMakes] = useState(false)
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

  useEffect(
    () =>
      afterLoad(() => {
        void loadFilterModal()
        void loadMakeSheet()
        void loadCompareTray()
      }),
    [],
  )

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

  // A full tray takes no more, and the toggle says so
  const toggleCompared = (car: CarData) => {
    const toggled = toggleComparedCar(car)
    if (toggled)
      track({
        name: 'compare_toggled',
        car: carSlug(car),
        ...toggled,
        source: 'card',
      })
  }

  const addSuggested = (car: CarData) => {
    const added = addComparedCar(car)
    if (added)
      track({
        name: 'compare_toggled',
        car: carSlug(car),
        ...added,
        source: 'suggestion',
      })
  }

  const removeCompared = (car: CarData) => {
    comparison.remove(car)
    track({
      name: 'compare_toggled',
      car: carSlug(car),
      added: false,
      count: comparison.selected.length - 1,
      source: 'tray',
    })
  }

  // What a card's link opens, fetched as a mouse, a finger or the focus
  // reaches it: the review where it opens a sheet, so the sheet opens with it
  // in rather than shifting what is under it once it arrives, and otherwise
  // the car's page, which a tap's press gives a head start on its click. On a
  // move rather than an over, which the list scrolling under a still pointer
  // fires for every card it passes, and only a hovering one's, as a finger's
  // moves are a scroll. Kept with the sheet's state, which a resize can flip
  // between the move and the click.
  const prefetched = useRef<{ link: Element; sheet: boolean } | null>(null)
  const prefetchLinked = (event: SyntheticEvent) => {
    if (!(event.target instanceof Element)) return
    const link = event.target.closest('a')
    if (!link) return
    const sheet = opensInSheet()
    const last = prefetched.current
    if (last?.link === link && last.sheet === sheet) return
    prefetched.current = { link, sheet }
    const linked = carAtPath(link.pathname)
    if (!linked) return
    if (sheet) prefetchCarReview(carSlug(linked))
    else router.prefetch(link.pathname)
  }

  // The cards follow a tap a frame behind the controls, in a render that
  // yields: reordering every card in one go held a phone's next paint for
  // longer than the 200ms a tap is given. The toggle and the chips answer at
  // once, and the count and the cards catch up.
  const listSorting = useDeferredValue(sorting)
  const listDirection = useDeferredValue(direction)
  const listFilters = useDeferredValue(filters)
  const listView = useDeferredValue(view)

  const filteredCars = cars.filter(carFilter(listFilters))
  const shownCars = sortCars(filteredCars, listSorting, listDirection)

  const hasFilter = Object.values(listFilters).length > 0

  const filteredCarCount = cars.length - filteredCars.length

  // The tray takes the bar's place while there is a car in it, on the page
  // but not over it in the sheet. There the chat is about the sheet's car, as
  // it is on the car's page.
  useChatSettings({
    hide: editingFilters || choosingMakes || (isComparing && !sheetChat),
    container: sheetChat?.container,
    placeTaken: isComparing,
    about: sheetChat && sheetCar ? [sheetCar] : undefined,
    starters: sheetChat?.starters,
    onShowCar: showCar,
    filters,
    onApplyFilters: applySuggestedFilters,
  })
  return (
    <div className="max-w-page mx-auto">
      <header
        className={clsx('flex flex-col items-stretch md:pb-10 lg:pr-6', column)}
      >
        <Title />

        {/* The newest update beside the intro from lg, where the intro alone
            leaves half the header empty, and under it on narrower screens.
            The header gives up some of its right padding there for it */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <Intro />

          {latest && (
            <LatestNews
              latest={latest}
              preload
              className="self-start -mx-1 mt-1 mb-10 lg:self-center lg:mx-0 lg:mt-6 lg:mb-8"
            />
          )}
        </div>

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

        <MakeRow
          chosen={filters.make ?? []}
          onChange={(make) => changeFilters({ ...filters, make }, 'make-row')}
          onShowAll={() => setChoosingMakes(true)}
        />

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
            listSorting
          ].label.toLowerCase()}, ${listDirection === 'desc' ? 'lækkandi' : 'hækkandi'} röð.`}
        </div>
      </header>

      <div
        className={clsx(listView === 'grid' && gridLayout)}
        onPointerEnter={() => {
          if (opensInSheet()) void loadCarSheet()
        }}
        onPointerMove={(event) => {
          const hovering =
            event.pointerType === 'mouse' ||
            (event.pointerType === 'pen' && event.buttons === 0)
          if (hovering) prefetchLinked(event)
        }}
        onPointerDown={prefetchLinked}
        onFocus={prefetchLinked}
      >
        {shownCars.map((car, index) => (
          <Car
            position={index}
            car={car}
            key={car.id}
            view={listView}
            showValue={listSorting === 'value' || Boolean(listFilters.value)}
            showSeats={Boolean(listFilters.seats)}
            showTowing={Boolean(listFilters.towing)}
            showGroundClearance={Boolean(listFilters.groundClearance)}
            compared={comparison.isSelected(car)}
            compareFull={comparison.isFull}
            onToggleCompare={toggleCompared}
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

      {choosingMakes && (
        <MakeSheet
          initialMakes={filters.make ?? []}
          onSubmit={(make) => changeFilters({ ...filters, make }, 'make-sheet')}
          onDone={() => setChoosingMakes(false)}
          getCountPreview={(make) =>
            cars.filter(carFilter(normalizeFilters({ ...filters, make })))
              .length
          }
        />
      )}

      {isComparing && (
        <CompareTray
          cars={comparison.selected}
          onRemove={removeCompared}
          onAdd={addSuggested}
        />
      )}

      {sheetCar && (
        <CarSheet car={sheetCar} shown={shownCars} onChat={setSheetChat} />
      )}
    </div>
  )
}
