import React, { useState } from 'react'
import { NextPage } from 'next'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'

import Toggles from '../components/Toggles'
import Footer from '../components/Footer'
import stableSort from '../components/stableSort'
import estimateWLTP from '../modules/estimateWLTP'

import { ProcessedUsedCar } from '../types'
import Car from '../components/UsedCar'

type Sorting = 'price' | 'age' | 'milage' | 'name' | 'range' | 'acceleration'

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
        const getName = (car: ProcessedUsedCar): string =>
          car.metadata?.model
            ? `${car.metadata.make} ${car.metadata.model}`
            : `${car.make} ${car.model}`
        return getName(a).localeCompare(getName(b))
      }
      case 'range': {
        const getRange = (car: ProcessedUsedCar): number => {
          if (car.metadata?.range) {
            return car.metadata.range
          }
          if (car.metadata?.rangeNEDC) {
            return Number(estimateWLTP(car.metadata.rangeNEDC))
          }
          return 0
        }

        return getRange(b) - getRange(a)
      }
      case 'acceleration': {
        return (
          (a.metadata?.acceleration ?? Number.MAX_SAFE_INTEGER) -
          (b.metadata?.acceleration ?? Number.MAX_SAFE_INTEGER)
        )
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

        <header>
          <h1>Notaðir Rafbílar</h1>

          <p className="description">
            Listi yfir alla {cars.filter((car) => !car.filtered).length} notuðu
            bílana sem eru til sölu á Íslandi og eru 100% rafdrifnir.
            Upplýsingar um drægni eru samkvæmt{' '}
            <a href="http://wltpfacts.eu/">WLTP</a> mælingum þegar bíllinn nýr
            en ekki er tekið tillit til rýrnunar með aldri eða notkun
            rafhlöðunnar. <strong>*</strong>Stjörnumerkt drægni er áætluð úr
            NEDC þar sem nýrri mælingar eru ekki til.
          </p>

          <div className="sorting-title">Raða eftir:</div>
          <Toggles<Sorting>
            currentValue={sorting}
            items={[
              ['Verði', 'price'],
              ['Nafni', 'name'],
              ['Aldri', 'age'],
              ['Keyrslu', 'milage'],
              ['Drægni', 'range'],
              ['Hröðun', 'acceleration'],
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
                .map((make) => (make === 'VW' ? 'Volkswagen' : make))
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
                style={
                  filter === make ? { backgroundColor: '#EEE' } : undefined
                }
                onClick={() => setFilter(make)}
              >
                {make} <span className="count">{count}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="cars">
          {stableSort(cars, carSorter)
            .filter(
              (car) =>
                (!filter ||
                  car.make === filter ||
                  car.metadata?.make?.toUpperCase() === filter ||
                  (filter === 'VOLKSWAGEN' && car.make === 'VW')) &&
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
            margin 0 auto;
            padding: 24px 0;
          }

          header {
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
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
          .description a,
          .description strong {
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
            display: grid;
            grid-gap: 32px;
            grid-template-columns: 1fr;
            margin-top: 32px;
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
            .root {
              margin 0 auto;
              max-width: 1180px;
            }

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

            .cars {
              grid-template-columns: 1fr 1fr;
              margin: 24px;
            }
          }

          @media screen and (min-width: 1200px) {
            .cars {
              grid-template-columns: 1fr 1fr 1fr;
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
