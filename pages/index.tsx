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
import newCars, { expectedCars } from '../modules/newCars'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import getKmPerMinutesCharged from '../modules/getKmPerMinutesCharged'
import { NewCar, Drive } from '../types'
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

const getFiltersFromQuery = (query: ParsedUrlQuery): Filters => {
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
    filters.name = query.nafn as string
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

type Filters = {
  acceleration?: number
  drive?: Drive[]
  fastcharge?: number
  name?: string
  price?: number
  range?: number
  value?: number
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
              Number(
                getKmPerMinutesCharged(car.timeToCharge10T080, car.range),
              ) >= (filters.fastcharge ?? 0)
            case 'name':
              return `${car.make} ${car.model}`
                .toLowerCase()
                .includes(filters.name?.toLowerCase() ?? '')
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

const New: NextPage<Props> = ({
  sorting: initialSorting,
  filters: initialFilters,
}) => {
  const { pathname } = useRouter()
  const [sorting, setSorting] = useState<Sorting>(initialSorting)
  const [filters, setFilters] = useState<Filters>(initialFilters)

  useEffect(() => smoothscroll.polyfill(), [])

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

  const handleRemoveFilter = (name: keyof Filters) => () => {
    setFilters((filters) => {
      let newFilters = Object.assign({}, filters)
      delete newFilters[name]
      return newFilters
    })
  }

  const filteredCars = newCars.filter(carFilter(filters))

  return (
    <>
      <div className="content">
        <Head>
          <title key="title">Veldu Rafbíl</title>
          <meta
            key="description"
            name="description"
            content={`Listi yfir alla ${newCars.length} bílana sem eru seldir á Íslandi og eru 100% rafdrifnir, með hlekk á seljanda og helstu upplýsingum til samanburðar`}
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

          {Object.values(filters).length > 0 && (
            <div className="filters-box">
              <div className="filters-title">
                {filteredCars.length}{' '}
                {filteredCars.length.toString().match(/.*1$/m)
                  ? 'bíll passar'
                  : 'bílar passa'}{' '}
                við:
              </div>
              <div className="filters">
                {filters.acceleration && (
                  <button
                    className="filter"
                    onClick={handleRemoveFilter('acceleration')}
                  >
                    Hröðun {filters.acceleration.toFixed(1)}s
                  </button>
                )}
                {filters.drive && (
                  <button
                    className="filter"
                    onClick={handleRemoveFilter('drive')}
                  >
                    Drif: {filters.drive.join(', ')}
                  </button>
                )}

                {filters.fastcharge && (
                  <button
                    className="filter"
                    onClick={handleRemoveFilter('fastcharge')}
                  >
                    Hraðhleðsla: {filters.fastcharge} km/min
                  </button>
                )}

                {filters.name && (
                  <button
                    className="filter"
                    onClick={handleRemoveFilter('name')}
                  >
                    Nafn: {filters.name}
                  </button>
                )}

                {filters.price && (
                  <button
                    className="filter"
                    onClick={handleRemoveFilter('price')}
                  >
                    Verð: {addDecimalSeprators(filters.price)} kr.
                  </button>
                )}

                {filters.range && (
                  <button
                    className="filter"
                    onClick={handleRemoveFilter('range')}
                  >
                    Drægni: {filters.range} km.
                  </button>
                )}

                {filters.value && (
                  <button
                    className="filter"
                    onClick={handleRemoveFilter('value')}
                  >
                    Verði á km: `${addDecimalSeprators(filters.value)} kr.
                  </button>
                )}
              </div>
            </div>
          )}
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
          }
          .filter {
            position: relative;
            border: 0;
            margin: 0 8px 0 0;
            font-size: 12px;
            font-weight: 600;
            padding: 5px 8px 5px 12px;
            border-radius: 100px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #EEE;
            transition: all 0.2s;
          }
          .filter::after {
            content: '+';
            transform: rotate(45deg);
            margin-left: 6px;
            font-size: 18px;
            line-height: 10px;
            margin-top: -2px;
            color: #666;
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

          .expected {
            background-color: #F8F8F8;
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
