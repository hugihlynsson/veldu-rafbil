'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Car from '../components/NewCar'
import Title from '../components/Title'
import Toggles from '../components/Toggles'
import FilterModal from '../components/FilterModal'
import ActiveFilters from '../components/ActiveFilters'
import ChatContainer from '../components/ChatContainer'
import newCars from '../modules/newCars'
import carFilter from '../modules/carFilter'
import { Filters, Sorting } from '../types'
import { carSorter, sortingToQuery } from '../modules/sorting'
import stableSort from '../modules/stableSort'

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

  const handleRemoveFilter = (name: keyof Filters) =>
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
          <em className="inline-block text-xs text-stone mt-2">
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

        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onOpenFilterModal={() => setEditingFilters(true)}
          filteredCarsCount={filteredCars.length}
        />
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
