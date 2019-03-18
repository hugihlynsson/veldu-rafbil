import React, { useState } from 'react'
import { NextStatelessComponent } from 'next'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import Toggles from '../components/Toggles'
import Footer from '../components/Footer'

import { UsedCar } from '../../types'
import Car from '../components/UsedCar'

type Sorting = 'price' | 'age' | 'milage' | 'name'

interface Props {
  cars: Array<UsedCar>
}

const Used: NextStatelessComponent<Props> = ({ cars }) => {
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const [sorting, setSorting] = useState<Sorting>('price')

  const carSorter = (a: UsedCar, b: UsedCar) => {
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
        <Toggles
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
            ALLIR <span className="count">{cars.length}</span>
          </div>

          {Object.entries(
            cars
              .map((car) => car.make)
              .reduce<{ [key: string]: number }>(
                (makes, make) =>
                  makes[make]
                    ? { ...makes, [make]: makes[make] + 1 } // Add one count
                    : { ...makes, [make]: 1 }, // Create a new make and set to 1
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
          {cars
            .filter((car) => !filter || car.make === filter)
            .slice() // Make sure the sorting doesn't try to mutate the original
            .sort(carSorter)
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
      process.env.LOCAL_BASE_URL || (req ? `https://${req.headers.host}` : '')
    const response = await fetch(`${baseUrl}/api/used.ts`)
    const json = await response.json()
    if (json.error) {
      throw json.error
    }
    return { cars: json.cars as Array<UsedCar> }
  } catch (error) {
    console.log('Failed to fetch cars', error)
    return { cars: [] }
  }
}

export default Used
