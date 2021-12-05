import React, { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import Router, { useRouter } from 'next/router'
import Link from 'next/link'
import smoothscroll from 'smoothscroll-polyfill'
import { ParsedUrlQuery } from 'querystring'

import Car from '../components/NewCar'
import Footer from '../components/Footer'
import Toggles from '../components/Toggles'
import LinkPill from '../components/LinkPill'
import FilterModal from '../components/FilterModal'
import newCars, { expectedCars } from '../modules/newCars'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import getKmPerMinutesCharged from '../modules/getKmPerMinutesCharged'
import { colors } from '../modules/globals'
import { NewCar, Filters, Drive } from '../types'

import stableSort from '../components/stableSort'

type Sorting =
  | 'name'
  | 'price'
  | 'range'
  | 'acceleration'
  | 'value'
  | 'fastcharge'

type SortingQuery =
  | 'nafni'
  | 'verdi'
  | 'draegni'
  | 'hrodun'
  | 'virdi'
  | 'hradhledslu'

const sortingToQuery: { [key in Sorting]: SortingQuery } = {
  name: 'nafni',
  price: 'verdi',
  range: 'draegni',
  acceleration: 'hrodun',
  value: 'virdi',
  fastcharge: 'hradhledslu',
}

const queryToSorting: { [key in SortingQuery]: Sorting } = {
  nafni: 'name',
  verdi: 'price',
  draegni: 'range',
  hrodun: 'acceleration',
  virdi: 'value',
  hradhledslu: 'fastcharge',
}

export const getFiltersFromQuery = (query: ParsedUrlQuery): Filters => {
  let filters: Filters = {}

  if (query.hrodun) {
    filters.acceleration = Number(query.hrodun)
  }
  if (query.drif) {
    filters.drive =
      typeof query.drif === 'string'
        ? [query.drif as Drive]
        : (query.drif as Drive[])
  }
  if (query.hradhledsla) {
    filters.fastcharge = Number(query.hradhledsla)
  }
  if (query.nafn) {
    filters.name =
      typeof query.nafn === 'string'
        ? [query.nafn as string]
        : (query.nafn as string[])
  }
  if (query.verd) {
    filters.price = Number(query.verd)
  }
  if (query.draegni) {
    filters.range = Number(query.draegni)
  }
  if (query.virdi) {
    filters.value = Number(query.virdi)
  }
  return filters
}

const carSorter =
  (sorting: Sorting) =>
  (a: NewCar, b: NewCar): number => {
    let padPrice = (car: NewCar): string =>
      car.price.toString().padStart(9, '0')
    switch (sorting) {
      case 'name':
        return `${a.make} ${a.model} ${padPrice(a)}`.localeCompare(
          `${b.make} ${b.model} ${padPrice(b)}`,
        )
      case 'price':
        return a.price - b.price
      case 'range':
        return b.range - a.range
      case 'acceleration':
        return a.acceleration - b.acceleration
      case 'value':
        return a.price / a.range - b.price / b.range
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
                  `${car.make} ${car.model}`
                    .toLowerCase()
                    .includes(nameFilter.toLowerCase()),
                ) || false
              )
            case 'price':
              return car.price <= (filters.price ?? Number.MAX_SAFE_INTEGER)
            case 'range':
              return car.range >= (filters.range ?? 0)
            case 'value':
              return (
                car.price / car.range <=
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

const New: NextPage<Props> = ({
  sorting: initialSorting,
  filters: initialFilters,
}) => {
  const { pathname } = useRouter()
  const [sorting, setSorting] = useState<Sorting>(initialSorting)
  const [filters, setFilters] = useState<Filters>(initialFilters)

  console.log("filters", filters)

  useEffect(() => smoothscroll.polyfill(), [])

  let [editingFilters, setEditingFilters] = useState<boolean>(false)

  useBodyScrollLock(editingFilters)

  useEffect(() => {
    const query = {} as ParsedUrlQuery
    if (sorting !== 'name') {
      query.radaeftir = sortingToQuery[sorting]
    }
    if (filters.acceleration) {
      query.hrodun = filters.acceleration.toString()
    }
    if (filters.drive) {
      query.drif = filters.drive
    }
    if (filters.fastcharge) {
      query.hradhledsla = filters.fastcharge.toString()
    }
    if (filters.name) {
      query.nafn = filters.name
    }
    if (filters.price) {
      query.verd = filters.price.toString()
    }
    if (filters.range) {
      query.draegni = filters.range.toString()
    }
    if (filters.value) {
      query.virdi = filters.value.toString()
    }
    Router.replace({ pathname, query }, undefined, { scroll: false })
  }, [sorting, filters])

  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const handleNewPress = useCallback(
    (event) => {
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

  return (
    <>
      <div className="content">
        <Head>
          <title key="title">Veldu Rafbíl</title>
          <meta
            key="description"
            name="description"
            content="Listi yfir alla bílana sem eru seldir á Íslandi og eru 100% rafdrifnir, með hlekk á seljanda og helstu upplýsingum til samanburðar"
          />
        </Head>

        <header>
          <h1>Veldu Rafbíl</h1>

          <nav className="headerLinks">
            <LinkPill current onClick={handleNewPress} href="#nyjir">
              Nýir ↓
            </LinkPill>

            <Link href="/notadir" passHref>
              <LinkPill>Notaðir →</LinkPill>
            </Link>
          </nav>

          <p className="description" id="nyjir" ref={descriptionRef}>
            Listi yfir alla {newCars.length} bílana sem eru seldir á Íslandi og
            eru 100% rafdrifnir. Upplýsingar um drægni eru samkvæmt{' '}
            <a href="http://wltpfacts.eu/">WLTP</a> mælingum frá framleiðenda en
            raundrægni er háð aðstæðum og aksturslagi.
            <em>Verð eru birt án ábyrgðar og geta verið úrelt.</em>
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
            <div className="filters-title">
              {filteredCars.length}{' '}
              {filteredCars.length.toString().match(/.*1$/m)
                ? `bíll${hasFilter ? ' passar við:' : ':'}`
                : `bílar${hasFilter ? ' passa við:' : ':'}`}
            </div>
            <div className="filters">
              {filters.name && (
                <button className="filter" onClick={handleRemoveFilter('name')}>
                  Nafn: <span>{filters.name.join(', ')}</span>
                </button>
              )}

              {filters.price && (
                <button
                  className="filter"
                  onClick={handleRemoveFilter('price')}
                >
                  Verð: <span>↑{addDecimalSeprators(filters.price)} kr.</span>
                </button>
              )}

              {filters.range && (
                <button
                  className="filter"
                  onClick={handleRemoveFilter('range')}
                >
                  Drægni: <span>↓{filters.range} km.</span>
                </button>
              )}

              {filters.drive && (
                <button
                  className="filter"
                  onClick={handleRemoveFilter('drive')}
                >
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
                <button
                  className="filter"
                  onClick={handleRemoveFilter('value')}
                >
                  Verði á km:{' '}
                  <span>↑{addDecimalSeprators(filters.value)} kr.</span>
                </button>
              )}

              {filters.fastcharge && (
                <button
                  className="filter"
                  onClick={handleRemoveFilter('fastcharge')}
                >
                  Hraðhleðsla: <span>↓{filters.fastcharge} km/min</span>
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

        {stableSort(filteredCars, carSorter(sorting)).map((car) => (
          <Car
            car={car}
            key={`${car.make} ${car.model} ${car.subModel}`}
            showValue={sorting === 'value'}
          />
        ))}
      </div>

      {expectedCars.length > 0 && (
        <section className="expected">
          <div className="content">
            <header>
              <h2 className="expectedHeader">Væntanlegir rafbílar</h2>
            </header>

            {stableSort(expectedCars, carSorter('name')).map((car) => (
              <Car
                car={car}
                key={`${car.make} ${car.model} ${car.subModel}`}
                onGray
              />
            ))}
          </div>
        </section>
      )}

      <Footer />

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
          h1 {
            font-size: 40px;
            font-weight: 600;
            line-height: 1.1;
            margin-bottom: 0.4em;
          }

          .headerLinks {
            display: flex;
            margin-bottom: 10px;
          }

          .description {
            line-height: 1.5;
            font-size: 14px;
            padding-top: 2em;
            margin: 0 0 2em 0;
            color: #555;
            max-width: 33em;
          }
          .description a {
            text-decoration: none;
            font-weight: 500;
            color: black;
          }
          .description a:hover {
            text-decoration: underline;
          }
          .description em {
            display: inline-block;
            font-size: 12px;
            color: #888;
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

          .expected {
            background-color: #f8f8f8;
            padding-bottom: 1px;
            margin-bottom: 2px;
          }

          h2 {
            font-size: 32px;
            font-weight: 500;
            line-height: 1.1;
            margin-bottom: 0.4em;
          }

          @media screen and (min-width: 375px) {
            header {
              padding: 24px;
            }
            h1 {
              font-size: 48px;
            }
            h2 {
              font-size: 40px;
            }
          }

          @media screen and (min-width: 768px) {
            header {
              padding-left: 40px;
              max-width: none;
              padding-bottom: 40px;
            }
            h1 {
              font-size: 64px;
            }
            h2 {
              font-size: 48px;
            }
            .description {
              font-size: 16px;
            }
          }
        `}
      </style>
    </>
  )
}

New.getInitialProps = ({ query }): Props => ({
  sorting: queryToSorting[(query.radaeftir as SortingQuery) ?? 'nafni'],
  filters: getFiltersFromQuery(query),
})

export default New
