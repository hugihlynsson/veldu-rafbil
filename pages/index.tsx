import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import Router, { useRouter } from 'next/router'

import Car from '../components/NewCar'
import Footer from '../components/Footer'
import Toggles from '../components/Toggles'
import cars from '../data/cars.json'
import { NewCar } from '../types'
import stableSort from '../components/stableSort'

type Sorting = 'name' | 'price' | 'range' | 'acceleration'
type SortingQuery = 'nafni' | 'verdi' | 'draegni' | 'hrodun'

const sortingToQuery: { [key in Sorting]: SortingQuery } = {
  name: 'nafni',
  price: 'verdi',
  range: 'draegni',
  acceleration: 'hrodun',
}

const queryToSorting: { [key in SortingQuery]: Sorting } = {
  nafni: 'name',
  verdi: 'price',
  draegni: 'range',
  hrodun: 'acceleration',
}

interface Props {
  initialSorting: SortingQuery | undefined
}

const Used: NextPage<Props> = ({ initialSorting }) => {
  const { pathname } = useRouter()
  const [sorting, setSorting] = useState<Sorting>(
    queryToSorting[initialSorting || 'nafni'],
  )

  useEffect(() => {
    const query =
      sorting === 'name' ? {} : { radaeftir: sortingToQuery[sorting] }
    Router.replace({ pathname, query })
  }, [sorting])

  const carSorter = (a: NewCar, b: NewCar) => {
    switch (sorting) {
      case 'name':
        return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)
      case 'price':
        return a.price - b.price
      case 'range':
        return b.range - a.range
      case 'acceleration':
        return a.acceleration - b.acceleration
    }
  }

  return (
    <>
      <div className="root" key="new">
        <Head>
          <title key="title">Veldu Rafbíl</title>
          <meta
            key="description"
            name="description"
            content={`Listi yfir alla ${cars.length} bílana sem eru seldir á Íslandi og eru 100% rafdrifnir, með hlekk á seljanda og helstu upplýsingum til samanburðar`}
          />
        </Head>

        <header>
          <h1>Veldu Rafbíl</h1>

          <p className="description">
            Listi yfir alla {cars.length} bílana sem eru seldir á Íslandi og eru
            100% rafdrifnir. Upplýsingar um drægni eru samkvæmt{' '}
            <a href="http://wltpfacts.eu/">WLTP</a> mælingum frá framleiðenda en
            raundrægni er háð aðstæðum og aksturslagi.
          </p>

          <div className="sorting-title">Raða eftir:</div>

          <Toggles<Sorting>
            currentValue={sorting}
            items={[
              ['Nafni', 'name'],
              ['Verði', 'price'],
              ['Drægni', 'range'],
              ['Hröðun', 'acceleration'],
            ]}
            onClick={setSorting}
          />
        </header>

        {stableSort(cars, carSorter).map((car, i) => (
          <Car
            car={car}
            key={`${car.make} ${car.model} ${car.capacity}`}
            lazyLoad={i >= 2}
          />
        ))}
      </div>

      <Footer />

      <style jsx>
        {`
          .root {
            max-width: 1024px;
            margin: 0 auto;
          }
          header {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin 0 auto;
            max-width: 480px;
            padding: 16px;
          }
          h1 {
            font-size: 40px;
            font-weight: 600;
            line-height: 1.1;
          }
          .description {
            line-height: 1.5;
            font-size: 14px;
            margin: 0 0 2.5em 0;
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

          .sorting-title {
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
          }

          @media screen and (min-width: 375px) {
            header {
              padding: 24px;
            }
            h1 {
              font-size: 48px;
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
            .description {
              font-size: 16px;
            }
          }
        `}
      </style>
    </>
  )
}

Used.getInitialProps = ({ query }) =>
  Promise.resolve({
    initialSorting: query.radaeftir as SortingQuery | undefined,
  })

export default Used
