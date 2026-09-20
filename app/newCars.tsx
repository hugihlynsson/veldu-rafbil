'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

import Car from '../components/NewCar'
import Title from '../components/Title'
import Toggles from '../components/Toggles'
import FilterModal from '../components/FilterModal'
import ActiveFilters from '../components/ActiveFilters'
import newCars from '../modules/newCars'
import carFilter from '../modules/carFilter'
import { filterQueryKeys, getQueryFromFilters } from '../modules/filters'
import getCarId from '../modules/getCarId'
import { Filters, Sorting, SortingDirection } from '../types'
import {
  defaultDirection,
  flipDirection,
  getQueryFromSorting,
  sortCars,
  sortingQueryKeys,
} from '../modules/sorting'
import { agree } from '../modules/plural'
import { grantAmountText, grantCeilingText } from '../modules/grantCopy'
import useBodyScrollLock from '../utils/useBodyScrollLock'

// Keeps the AI SDK off the list's hydration path. The bar is fixed-position,
// so arriving a moment later shifts nothing.
const ChatContainer = dynamic(() => import('../components/ChatContainer'), {
  ssr: false,
})

// Clears the keys the serialiser left out, so switching a filter off takes its
// parameter. Straight to the history, so the effects below don't depend on it.
const replaceQuery = (
  keys: readonly string[],
  query: Record<string, string>,
) => {
  const params = new URLSearchParams(window.location.search)

  for (const key of keys) {
    const value = query[key]
    if (value === undefined) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  }

  window.history.replaceState(null, '', `?${params.toString()}`)
}

const useSorting = (initial: Sorting, initialDirection: SortingDirection) => {
  const [sorting, setSorting] = useState<Sorting>(initial)
  const [direction, setDirection] = useState<SortingDirection>(initialDirection)

  useEffect(() => {
    replaceQuery(sortingQueryKeys, getQueryFromSorting(sorting, direction))
  }, [sorting, direction])

  // The active sorting flips; another one starts in its default direction
  const toggleSorting = (value: Sorting) => {
    if (value === sorting) {
      setDirection(flipDirection)
    } else {
      setSorting(value)
      setDirection(defaultDirection[value])
    }
  }

  return [sorting, direction, toggleSorting] as const
}

const useFilters = (initial: Filters) => {
  const [filters, setFilters] = useState<Filters>(initial)

  useEffect(() => {
    replaceQuery(filterQueryKeys, getQueryFromFilters(filters))
  }, [filters])

  return [filters, setFilters] as const
}

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

interface Props {
  sorting: Sorting
  direction: SortingDirection
  filters: Filters
}

export default function NewCars({
  sorting: initialSorting,
  direction: initialDirection,
  filters: initialFilters,
}: Props) {
  const [sorting, direction, toggleSorting] = useSorting(
    initialSorting,
    initialDirection,
  )
  const [filters, setFilters] = useFilters(initialFilters)

  const [editingFilters, setEditingFilters] = useState<boolean>(false)

  useBodyScrollLock(editingFilters)

  const handleRemoveFilter = (name: keyof Filters) =>
    setFilters((filters) => {
      const newFilters = Object.assign({}, filters)
      delete newFilters[name]
      return newFilters
    })

  const filteredCars = newCars.filter(carFilter(filters))

  const hasFilter = Object.values(filters).length > 0

  const filteredCarCount = newCars.length - filteredCars.length

  return (
    <div className="max-w-[1024px] mx-auto">
      <header className="flex flex-col items-stretch mx-auto max-w-[480px] p-4 xs:p-6 md:pl-10 md:max-w-none md:pb-10">
        <Title />

        <p className="leading-6 text-sm pt-6 m-0 mb-8 text-stone max-w-[33em] text-pretty md:text-base">
          Listi yfir alla {newCars.length} bílana sem eru seldir á Íslandi og
          eru 100% rafdrifnir. Upplýsingar um drægni eru samkvæmt{' '}
          <a
            href="http://wltpfacts.eu/"
            className="no-underline font-semibold text-tint hover:underline"
          >
            WLTP
          </a>{' '}
          mælingum frá framleiðenda en raundrægni er háð aðstæðum og
          aksturslagi.
          <em className="inline-block text-xs text-stone mt-2">
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
          </em>
        </p>

        <div id="sorting-label" className="mb-2 text-sm font-semibold">
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
          onRemoveFilter={handleRemoveFilter}
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
          key={getCarId(car)}
          showValue={sorting === 'value' || Boolean(filters.value)}
          showSeats={Boolean(filters.seats)}
        />
      ))}

      {hasFilter && filteredCarCount > 0 && (
        <div className="p-4 flex items-center mx-auto max-w-[480px] gap-2 text-xs font-medium mb-10 xs:p-6 md:pl-10 md:max-w-none">
          {filteredCarCount} {carWord(filteredCarCount)}{' '}
          {agree(filteredCarCount, 'passaði', 'pössuðu')} ekki við leitina{' '}
          <button
            className="border-0 shrink-0 m-0 mr-2 text-xs font-semibold py-[5px] px-3 rounded-full cursor-pointer text-center flex justify-center items-center bg-cloud transition-all duration-200 text-tint hover:bg-haze"
            onClick={(_event) => {
              setFilters(() => ({}))
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
          onSubmit={(filters: Filters) => setFilters(() => filters)}
          onDone={() => setEditingFilters(() => false)}
          getCountPreview={(filters: Filters) =>
            newCars.filter(carFilter(filters)).length
          }
        />
      )}

      <ChatContainer hide={editingFilters} />
    </div>
  )
}
