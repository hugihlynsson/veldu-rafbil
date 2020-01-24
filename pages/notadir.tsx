import React, { useState } from 'react'
import { NextPage } from 'next'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import Toggles from '../components/Toggles'
import Footer from '../components/Footer'
import stableSort from '../components/stableSort'

import { ProcessedUsedCar } from '../types'
import Car from '../components/UsedCar'

type Sorting = 'price' | 'age' | 'milage' | 'name'

interface Props {
  cars: Array<ProcessedUsedCar>
}

const Used: NextPage<Props> = ({ cars }) => {
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const [sorting, setSorting] = useState<Sorting>('price')

  const carSorter = (a: ProcessedUsedCar, b: ProcessedUsedCar): number => {
    switch (sorting) {
      case 'price': {
        return (
          (a.price || Number.MAX_SAFE_INTEGER) -
          (b.price || Number.MAX_SAFE_INTEGER)
        )
      }
      case 'age': {
        return (
          Number((b.date.split('/')[1] || '').split(' ')[0]) -
          Number((a.date.split('/')[1] || '').split(' ')[0])
        )
      }
      case 'milage': {
        return (
          (Number(
            a.milage
              .replace(' km.', '')
              .split('.')
              .join(''),
          ) || 0) -
          (Number(
            b.milage
              .replace(' km.', '')
              .split('.')
              .join(''),
          ) || 0)
        )
      }
      case 'name': {
        return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)
      }
      default: {
        return 1
      }
    }
  }

  return (
    <>
      <div className="root" key="used">
        <Head>
          <title key="title">Notaðir Rafbílar</title>
        </Head>

        <h1>Notaðir Rafbílar</h1>

        <div className="sorting-title">Raða eftir:</div>
        <Toggles<Sorting>
          currentValue={sorting}
          items={[
            ['Verði', 'price'],
            ['Nafni', 'name'],
            ['Aldri', 'age'],
            ['Keyrslu', 'milage'],
          ]}
          onClick={setSorting}
        />

        <div className="filters">
          <div
            className="filter"
            style={!filter ? { backgroundColor: '#EEE' } : undefined}
            onClick={() => setFilter(undefined)}
          >
            ALLIR{' '}
            <span className="count">
              {cars.filter((car) => !car.filtered).length}
            </span>
          </div>

          {Object.entries(
            cars
              .filter((car) => !car.filtered)
              .map((car) => car.metadata?.make ?? car.make)
              .reduce<{ [key: string]: number }>(
                (makes, make) => ({
                  ...makes,
                  [make.toUpperCase()]: (makes[make.toUpperCase()] || 0) + 1,
                }),
                {},
              ),
          ).map(([make, count]) => (
            <div
              key={make}
              className="filter"
              style={filter === make ? { backgroundColor: '#EEE' } : undefined}
              onClick={() => setFilter(make)}
            >
              {make} <span className="count">{count}</span>
            </div>
          ))}
        </div>

        <div className="cars">
          {stableSort(cars, carSorter)
            .filter(
              (car) =>
                (!filter ||
                  car.make === filter ||
                  car.metadata?.make?.toUpperCase() === filter) &&
                !car.filtered,
            )
            .map((car) => (
              <Car car={car} key={car.link} />
            ))}
        </div>
      </div>

      <Footer />

      <style jsx>{`
          .root {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin 0 auto;
            max-width: 560px;
            padding: 24px;
          }
          h1 {
            font-size: 40px;
            font-weight: 600;
          }
          .sorting-title {
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
          }

          .filters {
            display: flex;
            flex-wrap: wrap;
            margin-top: 16px;
          }
          .filter {
            font-size: 11px;
            font-weight: 600;
            margin-right: 2px;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 2px;
          }
          .filter:hover {
            background-color: #F8F8F8;
          }
          .count {
            font-weight: 400;
            margin-left: 2px;
            color: #888;
          }

          .cars {
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }

          @media screen and (min-width: 768px) {
            .root {
              margin 0 auto;
              max-width: 1120px;
            }

            .cars {
              flex-direction: row;
              flex-wrap: wrap;
            }
          }
        `}</style>
    </>
  )
}

Used.getInitialProps = async ({ req }): Promise<Props> => {
  try {
    const baseUrl =
      req && req.headers
        ? `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers[
            'x-forwarded-host'
          ] || req.headers.host}`
        : ''
    const response = await fetch(`${baseUrl}/api/used`)
    const json = await response.json()
    if (json.error) {
      throw json.error
    }
    return { cars: json.cars as Array<ProcessedUsedCar> }
  } catch (error) {
    console.log('Failed to fetch cars', error)
    return { cars: [] }
  }
}

export default Used
