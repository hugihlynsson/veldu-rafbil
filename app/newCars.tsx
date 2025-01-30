'use client'

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FunctionComponent,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import smoothscroll from 'smoothscroll-polyfill'

import Car, { getPriceWithGrant } from '../components/NewCar'
import Title from '../components/Title'
import Toggles from '../components/Toggles'
import FilterModal from '../components/FilterModal'
import newCarsWithDiscontinued from '../modules/newCars'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import getKmPerMinutesCharged from '../modules/getKmPerMinutesCharged'
import { colors } from '../modules/globals'
import { NewCar, Filters, Sorting, SortingQuery } from '../types'

import stableSort from '../modules/stableSort'

let newCars = newCarsWithDiscontinued.filter((car) => !car.discontinued)

const sortingToQuery: { [key in Sorting]: SortingQuery } = {
  name: 'nafni',
  price: 'verdi',
  range: 'draegni',
  acceleration: 'hrodun',
  value: 'virdi',
  fastcharge: 'hradhledslu',
}

const carSorter =
  (sorting: Sorting) =>
  (a: NewCar, b: NewCar): number => {
    let padPrice = (car: NewCar): string =>
      getPriceWithGrant(car.price).toString().padStart(9, '0')

    switch (sorting) {
      case 'name':
        return `${a.make} ${a.model} ${padPrice(a)}`.localeCompare(
          `${b.make} ${b.model} ${padPrice(b)}`,
        )
      case 'price':
        return getPriceWithGrant(a.price) - getPriceWithGrant(b.price)
      case 'range':
        return b.range - a.range
      case 'acceleration':
        return a.acceleration - b.acceleration
      case 'value':
        return (
          getPriceWithGrant(a.price) / a.range -
          getPriceWithGrant(b.price) / b.range
        )
      case 'fastcharge':
        return (
          Number(getKmPerMinutesCharged(b.timeToCharge10T080, b.range)) -
          Number(getKmPerMinutesCharged(a.timeToCharge10T080, a.range))
        )
    }
  }

const carFilter =
  (filters: Filters) =>
  (car: NewCar): boolean =>
    Object.keys(filters).length === 0
      ? true
      : Object.keys(filters).every((name): boolean => {
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
                Number(
                  getKmPerMinutesCharged(car.timeToCharge10T080, car.range),
                ) >= (filters.fastcharge ?? 0)
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

interface Props {
  sorting: Sorting
  filters: Filters
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

const New: FunctionComponent<Props> = ({
  sorting: initialSorting,
  filters: initialFilters,
}) => {
  const pathname = usePathname()
  const [sorting, setSorting] = useState<Sorting>(initialSorting)
  const [filters, setFilters] = useState<Filters>(initialFilters)

  useEffect(() => smoothscroll.polyfill(), [])

  let [editingFilters, setEditingFilters] = useState<boolean>(false)

  useBodyScrollLock(editingFilters)

  const router = useRouter()

  useEffect(() => {
    const query: Record<string, string> = {}

    let {
      acceleration,
      availability,
      drive,
      fastcharge,
      name,
      price,
      range,
      value,
    } = filters

    if (sorting !== 'name') query.radaeftir = sortingToQuery[sorting]
    if (acceleration) query.hrodun = acceleration.toString()
    if (availability)
      query.frambod =
        availability === 'available' ? 'faanlegir' : 'vaentanlegir'
    if (drive) query.drif = drive.join(',')
    if (fastcharge) query.hradhledsla = fastcharge.toString()
    if (name) query.nafn = name.join(',')
    if (price) query.verd = price.toString()
    if (range) query.draegni = range.toString()
    if (value) query.virdi = value.toString()

    let searchParams = new URLSearchParams(query)
    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false })
  }, [sorting, filters])

  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const handleNewPress = useCallback(
    (
      event: React.MouseEvent<
        HTMLAnchorElement | HTMLButtonElement,
        MouseEvent
      >,
    ) => {
      event.preventDefault()
      descriptionRef.current?.scrollIntoView({ behavior: 'smooth' })
    },
    [descriptionRef],
  )

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
    <div className="content">
      <header>
        <Title />

        <p className="description" id="nyjir" ref={descriptionRef}>
          Listi yfir alla {newCars.length} bílana sem eru seldir á Íslandi og
          eru 100% rafdrifnir. Upplýsingar um drægni eru samkvæmt{' '}
          <a href="http://wltpfacts.eu/">WLTP</a> mælingum frá framleiðenda en
          raundrægni er háð aðstæðum og aksturslagi.
          <em>
            Kaupendur nýskráðra rafbíla sem kosta minna en 10 milljónir eiga
            kost á að{' '}
            <a href="https://island.is/rafbilastyrkir">
              sækja um 900.000 kr. rafbílastyrk
            </a>
            .
          </em>
        </p>

        <div className="sorting-title">Raða eftir:</div>

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

        <div className="filters-box">
          {hasFilter && (
            <div className="filters-title">
              {filteredCars.length}{' '}
              {filteredCars.length.toString().match(/.*1$/m)
                ? 'bíll passar við:'
                : 'bílar passa við:'}
            </div>
          )}
          <div className="filters">
            {filters.name && (
              <button className="filter" onClick={handleRemoveFilter('name')}>
                Nafn: <span>{filters.name.join(', ')}</span>
              </button>
            )}

            {filters.price && (
              <button className="filter" onClick={handleRemoveFilter('price')}>
                Verð: <span>↓{addDecimalSeprators(filters.price)} kr.</span>
              </button>
            )}

            {filters.range && (
              <button className="filter" onClick={handleRemoveFilter('range')}>
                Drægni: <span>↑{filters.range} km.</span>
              </button>
            )}

            {filters.drive && (
              <button className="filter" onClick={handleRemoveFilter('drive')}>
                Drif: <span>{filters.drive.join(', ')}</span>
              </button>
            )}

            {filters.acceleration && (
              <button
                className="filter"
                onClick={handleRemoveFilter('acceleration')}
              >
                Hröðun <span>↓{filters.acceleration.toFixed(1)}s</span>
              </button>
            )}

            {filters.value && (
              <button className="filter" onClick={handleRemoveFilter('value')}>
                Verði á km:{' '}
                <span>↓{addDecimalSeprators(filters.value)} kr.</span>
              </button>
            )}

            {filters.fastcharge && (
              <button
                className="filter"
                onClick={handleRemoveFilter('fastcharge')}
              >
                Hraðhleðsla: <span>↑{filters.fastcharge} km/min</span>
              </button>
            )}

            {filters.availability && (
              <button
                className="filter"
                onClick={handleRemoveFilter('availability')}
              >
                Framboð:{' '}
                <span>
                  {filters.availability === 'available'
                    ? 'Fáanlegir'
                    : 'Væntanlegir'}
                </span>
              </button>
            )}
            <button
              className="add-filter"
              onClick={() => setEditingFilters(() => true)}
            >
              + Bæta við síu
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
        <div className="filters-reset-box">
          {filteredCarCount}
          {filteredCarCount.toString().match(/.*1$/m)
            ? ' bíll passaði '
            : ' bílar pössuðu '}
          ekki við síurnar{' '}
          <button
            className="filters-reset-button"
            onClick={(event) => {
              setFilters(() => ({}))
              handleNewPress(event)
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

      <style jsx>
        {`
          .content {
            max-width: 1024px;
            margin: 0 auto;
          }
          header {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin: 0 auto;
            max-width: 480px;
            padding: 16px;
          }

          .description {
            line-height: 1.5;
            font-size: 14px;
            padding-top: 1.5em;
            margin: 0 0 2em 0;
            color: ${colors.stone};
            max-width: 33em;
          }
          .description a {
            text-decoration: none;
            font-weight: 600;
            color: black;
          }
          .description a:hover {
            text-decoration: underline;
          }
          .description em {
            display: inline-block;
            font-size: 12px;
            color: #777;
            margin-top: 0.5em;
          }
          .description em a {
            color: #222;
          }

          .sorting-title,
          .filters-title {
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
          }

          .filters-box {
            margin-top: 20px;
          }
          .filters {
            display: flex;
            max-width: 100%;
            align-self: flex-start;
            margin-left: -2px;
            flex-wrap: wrap;
          }
          .filter {
            flex-shrink: 0;
            position: relative;
            margin: 0 8px 0 0;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 6px 5px 8px;
            border: 1px solid ${colors.smoke};
            border-radius: 100px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${colors.lab};
            transition: all 0.2s;
            color: ${colors.clay};
            margin-bottom: 8px;
          }
          .filter span {
            color: ${colors.tint};
            transition: color 0.2s;
            margin-left: 3px;
          }
          .filter:hover span {
            color: ${colors.stone};
          }
          .filter::after {
            content: '+';
            transform: rotate(45deg);
            margin-left: 6px;
            font-size: 16px;
            line-height: 10px;
            margin-top: -1px;
            color: ${colors.clay};
            transition: color 0.2s;
          }
          .filter:last-child {
            border-right-width: 0;
          }
          .filter:active {
            color: #000;
          }
          .filter:hover {
            background-color: #f8f8f8;
          }
          .filter:hover::after {
            color: #222;
          }

          .add-filter {
            border: 0;
            flex-shrink: 0;
            margin: 0 8px 0 0;
            font-size: 12px;
            font-weight: 600;
            padding: 5px 12px 5px 12px;
            border-radius: 100px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #eee;
            transition: all 0.2s;
            color: ${colors.tint};
            margin-bottom: 8px;
          }
          .add-filter:hover {
            background-color: #f8f8f8;
          }

          .filters-reset-box {
            padding: 16px;
            display: flex;
            align-items: center;
            margin: 0 auto;
            max-width: 480px;
            grid-gap: 8px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 40px;
          }

          .filters-reset-button {
            border: 0;
            flex-shrink: 0;
            margin: 0 8px 0 0;
            font-size: 12px;
            font-weight: 600;
            padding: 5px 12px 5px 12px;
            border-radius: 100px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #eee;
            transition: all 0.2s;
            color: ${colors.tint};
          }
          .filters-reset-button:hover {
            background-color: #f8f8f8;
          }

          @media screen and (min-width: 375px) {
            header {
              padding: 24px;
            }
            .filters-reset-box {
              padding: 24px;
            }
          }

          @media screen and (min-width: 768px) {
            header {
              padding-left: 40px;
              max-width: none;
              padding-bottom: 40px;
            }
            .description {
              font-size: 16px;
            }
            .filters-reset-box {
              padding-left: 40px;
              max-width: none;
            }
          }
        `}
      </style>
    </div>
  )
}

export default New
