'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Car from '../components/NewCar'
import getPriceWithGrant from '../modules/getPriceWithGrant'
import Title from '../components/Title'
import Toggles from '../components/Toggles'
import FilterModal from '../components/FilterModal'
import ChatContainer from '../components/ChatContainer'
import newCars from '../modules/newCars'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import getKmPerMinutesCharged from '../modules/getKmPerMinutesCharged'
import { NewCar, Filters, Sorting } from '../types'
import { carSorter, sortingToQuery } from '../modules/sorting'
import stableSort from '../modules/stableSort'

const carFilter =
  (filters: Filters) =>
  (car: NewCar): boolean => {
    if (Object.keys(filters).length === 0) return true
    return Object.keys(filters).every((name): boolean => {
      switch (name as keyof Filters) {
        case 'acceleration':
          return (
            car.acceleration <=
            (filters.acceleration ?? Number.MAX_SAFE_INTEGER)
          )
        case 'availability':
          return (
            Boolean(car.expectedDelivery) ===
            (filters.availability === 'expected')
          )
        case 'drive':
          return filters.drive?.includes(car.drive) || false
        case 'fastcharge':
          return (
            Number(getKmPerMinutesCharged(car.timeToCharge10T080, car.range)) >=
            (filters.fastcharge ?? 0)
          )
        case 'name':
          return (
            filters.name?.some((nameFilter) =>
              `${car.make} ${car.model} ${car.subModel}`
                .toLowerCase()
                .includes(nameFilter.toLowerCase()),
            ) || false
          )
        case 'price':
          return (
            getPriceWithGrant(car.price) <=
            (filters.price ?? Number.MAX_SAFE_INTEGER)
          )
        case 'range':
          return car.range >= (filters.range ?? 0)
        case 'value':
          return (
            getPriceWithGrant(car.price) / car.range <=
            (filters.value ?? Number.MAX_SAFE_INTEGER)
          )
      }
    })
  }

const useBodyScrollLock = (lock: boolean): void => {
  const [scrollY, setScrollY] = useState<number>(0)

  useEffect(() => {
    setScrollY(window.scrollY)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (lock) {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      window.scrollTo(0, parseInt(scrollY) * -1)
    }
  }, [lock])
}

const useSorting = (initial: Sorting) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sorting, setSorting] = useState<Sorting>(initial)

  useEffect(() => {
    let updatedSearchParams = new URLSearchParams(searchParams)

    sorting === 'name'
      ? updatedSearchParams.delete('radaeftir')
      : updatedSearchParams.set('radaeftir', sortingToQuery[sorting])

    router.replace(`${pathname}?${updatedSearchParams.toString()}`, {
      scroll: false,
    })
  }, [sorting])

  return [sorting, setSorting] as const
}

const useFilters = (initial: Filters) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<Filters>(initial)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    let {
      name,
      acceleration,
      availability,
      drive,
      fastcharge,
      price,
      range,
      value,
    } = filters

    name ? params.set('nafn', name.join(',')) : params.delete('nafn')
    acceleration
      ? params.set('hrodun', acceleration.toString())
      : params.delete('hrodun')
    availability
      ? params.set(
          'frambod',
          availability === 'available' ? 'faanlegir' : 'vaentanlegir',
        )
      : params.delete('frambod')
    drive ? params.set('drif', drive.join(',')) : params.delete('drif')
    fastcharge
      ? params.set('hradhledsla', fastcharge.toString())
      : params.delete('hradhledsla')
    price ? params.set('verd', price.toString()) : params.delete('verd')
    range ? params.set('draegni', range.toString()) : params.delete('draegni')
    value ? params.set('virdi', value.toString()) : params.delete('virdi')

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [filters])

  return [filters, setFilters] as const
}

const filterClasses =
  "shrink-0 relative text-xs font-semibold py-1 pr-2 pl-2.5 border border-smoke rounded-full cursor-pointer text-center flex justify-center items-center bg-lab transition-all duration-200 text-clay after:content-['+'] after:rotate-45 after:ml-1.5 after:text-base after:leading-[10px] after:-mt-px after:text-clay after:transition-colors hover:bg-[#f8f8f8] hover:after:text-[#222] active:text-black"

interface Props {
  sorting: Sorting
  filters: Filters
}

export default function NewCars({
  sorting: initialSorting,
  filters: initialFilters,
}: Props) {
  const [sorting, setSorting] = useSorting(initialSorting)
  const [filters, setFilters] = useFilters(initialFilters)

  let [editingFilters, setEditingFilters] = useState<boolean>(false)

  useBodyScrollLock(editingFilters)

  const handleRemoveFilter = (name: keyof Filters) => () =>
    setFilters((filters) => {
      let newFilters = Object.assign({}, filters)
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
            className="no-underline font-semibold text-black hover:underline"
          >
            WLTP
          </a>{' '}
          mælingum frá framleiðenda en raundrægni er háð aðstæðum og
          aksturslagi.
          <em className="inline-block text-xs text-[#777] mt-2">
            Kaupendur nýskráðra rafbíla sem kosta minna en 10 milljónir eiga
            kost á að{' '}
            <a
              href="https://island.is/rafbilastyrkir"
              className="no-underline font-semibold text-[#222] hover:underline"
            >
              sækja um 900.000 kr. rafbílastyrk
            </a>{' '}
            út árið 2025.
          </em>
        </p>

        <div className="mb-2 text-sm font-semibold">Raða eftir:</div>

        <Toggles<Sorting>
          currentValue={sorting}
          items={[
            ['Nafni', 'name'],
            ['Verði', 'price'],
            ['Drægni', 'range'],
            ['Hröðun', 'acceleration'],
            ['Verði á km', 'value'],
          ]}
          onClick={setSorting}
        />

        <div className="mt-5">
          {hasFilter && (
            <div className="mb-2 text-sm font-semibold">
              {filteredCars.length}{' '}
              {filteredCars.length.toString().match(/.*1$/m)
                ? 'bíll passar við:'
                : 'bílar passa við:'}
            </div>
          )}
          <div className="flex flex-wrap gap-2 self-start max-w-full -ml-[2px]">
            {filters.name && (
              <button
                className={filterClasses}
                onClick={handleRemoveFilter('name')}
              >
                Nafn:{' '}
                <span className="text-tint transition-colors ml-[3px]">
                  {filters.name.join(', ')}
                </span>
              </button>
            )}

            {filters.price && (
              <button
                className={filterClasses}
                onClick={handleRemoveFilter('price')}
              >
                Verð:{' '}
                <span className="text-tint transition-colors ml-[3px]">
                  ↓{addDecimalSeprators(filters.price)} kr.
                </span>
              </button>
            )}

            {filters.range && (
              <button
                className={filterClasses}
                onClick={handleRemoveFilter('range')}
              >
                Drægni:{' '}
                <span className="text-tint transition-colors ml-[3px]">
                  ↑{filters.range} km.
                </span>
              </button>
            )}

            {filters.drive && (
              <button
                className={filterClasses}
                onClick={handleRemoveFilter('drive')}
              >
                Drif:{' '}
                <span className="text-tint transition-colors ml-[3px]">
                  {filters.drive.join(', ')}
                </span>
              </button>
            )}

            {filters.acceleration && (
              <button
                className={filterClasses}
                onClick={handleRemoveFilter('acceleration')}
              >
                Hröðun{' '}
                <span className="text-tint transition-colors ml-[3px]">
                  ↓{filters.acceleration.toFixed(1)}s
                </span>
              </button>
            )}

            {filters.value && (
              <button
                className={filterClasses}
                onClick={handleRemoveFilter('value')}
              >
                Verði á km:{' '}
                <span className="text-tint transition-colors ml-[3px]">
                  ↓{addDecimalSeprators(filters.value)} kr.
                </span>
              </button>
            )}

            {filters.fastcharge && (
              <button
                className={filterClasses}
                onClick={handleRemoveFilter('fastcharge')}
              >
                Hraðhleðsla:{' '}
                <span className="text-tint transition-colors ml-[3px]">
                  ↑{filters.fastcharge} km/min
                </span>
              </button>
            )}

            {filters.availability && (
              <button
                className={filterClasses}
                onClick={handleRemoveFilter('availability')}
              >
                Framboð:{' '}
                <span className="text-tint transition-colors ml-[3px]">
                  {filters.availability === 'available'
                    ? 'Fáanlegir'
                    : 'Væntanlegir'}
                </span>
              </button>
            )}
            <button
              className="flex justify-center items-center shrink-0 gap-1.5 py-2 pr-4 pl-3 border-0 rounded-full text-[13px] font-semibold cursor-pointer text-center bg-black/6 transition-all duration-200 text-tint hover:bg-black/9 active:translate-y-0"
              onClick={() => setEditingFilters(() => true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="none"
                className="opacity-70"
              >
                <path
                  fill="#000"
                  d="m14.298 13.202-3.87-3.87A5.514 5.514 0 0 0 11.55 6C11.55 2.94 9.061.45 6 .45 2.94.45.45 2.94.45 6c0 3.061 2.49 5.55 5.55 5.55a5.514 5.514 0 0 0 3.332-1.122l3.87 3.87a.775.775 0 1 0 1.096-1.096ZM1.55 6A4.455 4.455 0 0 1 6 1.55 4.455 4.455 0 0 1 10.45 6 4.455 4.455 0 0 1 6 10.45 4.455 4.455 0 0 1 1.55 6Z"
                />
              </svg>
              Leita
            </button>
          </div>
        </div>
      </header>

      {stableSort(filteredCars, carSorter(sorting)).map((car, index) => (
        <Car
          priority={index <= 1}
          car={car}
          key={`${car.make} ${car.model} ${car.subModel} ${car.price}`}
          showValue={sorting === 'value' || Boolean(filters.value)}
        />
      ))}

      {hasFilter && filteredCarCount > 0 && (
        <div className="p-4 flex items-center mx-auto max-w-[480px] gap-2 text-xs font-medium mb-10 xs:p-6 md:pl-10 md:max-w-none">
          {filteredCarCount}
          {filteredCarCount.toString().match(/.*1$/m)
            ? ' bíll passaði '
            : ' bílar pössuðu '}
          ekki við leitina{' '}
          <button
            className="border-0 shrink-0 m-0 mr-2 text-xs font-semibold py-[5px] px-3 rounded-full cursor-pointer text-center flex justify-center items-center bg-cloud transition-all duration-200 text-tint hover:bg-[#f8f8f8]"
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
