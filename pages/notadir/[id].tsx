import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Error from 'next/error'
import smoothscroll from 'smoothscroll-polyfill'

import Toggles from '../../components/Toggles'
import Footer from '../../components/Footer'
import stableSort from '../../components/stableSort'
import usedCarModels from '../../apiHelpers/usedCarModels'

import { ProcessedUsedCar, UsedCarModel } from '../../types'
import Car from '../../components/UsedCarByModel'
import estimateWLTP from '../../modules/estimateWLTP'
import isSingular from '../../modules/isSingular'
import LinkPill from '../../components/LinkPill'

type Sorting = 'price' | 'age' | 'milage'

const carSorter = (sorting: Sorting) => (
  a: ProcessedUsedCar,
  b: ProcessedUsedCar,
): number => {
  switch (sorting) {
    case 'price': {
      return (
        (a.price || Number.MAX_SAFE_INTEGER) -
        (b.price || Number.MAX_SAFE_INTEGER)
      )
    }
    case 'milage': {
      return getCarMilage(a) - getCarMilage(b)
    }
    case 'age': {
      return (
        Number((b.date.split('/')[1] || '').split(' ')[0]) -
        Number((a.date.split('/')[1] || '').split(' ')[0])
      )
    }
    default: {
      return 1
    }
  }
}

const getCarMilage = (car: ProcessedUsedCar) =>
  Number(car.milage.replace(' km.', '').split('.').join('')) ?? 0

interface Props {
  error?: number
  cars?: Array<ProcessedUsedCar>
  model?: UsedCarModel
}

const UsedModel: NextPage<Props> = ({ cars, error, model }) => {
  const [sorting, setSorting] = useState<Sorting>('price')

  useEffect(() => {
    smoothscroll.polyfill()
  }, [])

  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const handleNewPress = useCallback(
    (event) => {
      event.preventDefault()
      descriptionRef.current?.scrollIntoView({ behavior: 'smooth' })
    },
    [descriptionRef],
  )

  if (error || !cars || !model) {
    return <Error statusCode={error ?? 500} />
  }

  const filtered = cars.filter(
    (car) => !car.filtered && car.metadata && car.metadata.id === model.id,
  )

  return (
    <>
      <div className="root" key="used">
        <Head>
          <title key="title">
            Veldu Rafbíl – Notaðir – {model.make} {model.model}
          </title>
        </Head>

        <header>
          <h1>Veldu Rafbíl</h1>

          <nav className="headerLinks">
            <Link href="/notadir" passHref>
              <LinkPill>Notaðir ←</LinkPill>
            </Link>

            <LinkPill href="#info" current onClick={handleNewPress}>
              {model.make} {model.model} ↓
            </LinkPill>
          </nav>

          <section className="info-card">
            <h2>
              {model.make} {model.model}
            </h2>

            <div id="info" className="info" ref={descriptionRef}>
              <div className="info-item">
                <div className="info-item-label">0-100 km/klst</div>
                <div className="info-item-value">{model.acceleration}s</div>
              </div>

              <div className="info-item" style={{ flexShrink: 0 }}>
                <div className="info-item-label">Rafhlaða</div>
                <div className="info-item-value">{model.capacity} kWh</div>
              </div>

              <div className="info-item" title="Samkvæmt WLTP prófunum">
                <div className="info-item-label">
                  Drægni{model.rangeNEDC && <strong>*</strong>}
                </div>
                <div className="info-item-value">
                  {model.range ??
                    (model.rangeNEDC && estimateWLTP(model.rangeNEDC))}
                  km
                </div>
              </div>
            </div>

            {model.evDatabaseURL && (
              <LinkPill href={model.evDatabaseURL} external onGray>
                Nánar á ev-database.org ↗
              </LinkPill>
            )}
          </section>

          <p className="description">
            {filtered.length}{' '}
            {isSingular(filtered.length) ? 'notaður' : 'notaðir'} til sölu
          </p>

          <div className="sorting-title">Raða eftir:</div>
          <Toggles<Sorting>
            currentValue={sorting}
            items={[
              ['Verði', 'price'],
              ['Keyrslu', 'milage'],
              ['Aldri', 'age'],
            ]}
            onClick={setSorting}
          />
        </header>

        <div className="cars">
          {stableSort(filtered, carSorter(sorting)).map((car) => (
            <Car car={car} key={car.link} />
          ))}
        </div>
      </div>

      <Footer />

      <style jsx>{`
          .root {
            margin 0 auto;
            padding: 0;
          }

          header {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin 0 auto;
            max-width: 480px;
            padding: 16px 16px 0;
          }

          h1 {
            font-size: 40px;
            font-weight: 600;
            line-height: 1.1;
            margin-bottom: 0.4em;
          }

          .headerLinks {
            display: flex;
            margin-bottom: 32px;
          }

          .info-card {
            padding: 16px;
            background: #F8F8F8;
            border-radius: 16px;
            margin-left: -8px;
            margin-right: -8px;
            max-width: 360px;
          }

          h2 {
            font-size: 36px;
            font-weight: 500;
            line-height: 1.1;
            margin-bottom: 24px;
            margin-top: 0;
          }

          .info {
            display: flex;
            margin-bottom: 16px;
            max-width: 320px;
            justify-content: space-between;
          }
          .info-item {
            margin-right: 8px;
            flex-basis: 33.33%;
          }
          .info-item:last-child {
            margin-right: 0;
          }
          .info-item-label {
            text-transform: uppercase;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
            color: #555;
          }
          .info-item-label strong {
            color: #000;
          }
          .info-item-value {
            font-size: 24px;
            font-weight: 400;
          }

          .description {
            line-height: 1.5;
            font-size: 24px;
            margin: 1.2em 0 0.5em 0;
            color: #000;
            font-weight: 500;
            max-width: 33em;
          }

          .sorting-title {
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
          }

          .cars {
            display: grid;
            grid-gap: 24px;
            grid-template-columns: 1fr;
            margin: 16px;
          }

          @media screen and (min-width: 375px) {
            header {
              padding: 24px 24px 0;
            }
            h1 {
              font-size: 48px;
            }

            .info-item {
              margin-right: 16px;
            }

            .cars {
              margin: 24px;
            }
          }

          @media screen and (min-width: 768px) {
            header {
              padding-left: 40px;
              max-width: 1024px;
            }
            h1 {
              font-size: 64px;
            }

            .cars {
              grid-template-columns: 1fr 1fr;
              grid-gap: 32px;
              margin: 32px;
            }
          }

          @media screen and (min-width: 1194px) {
            .root {
              margin 0 auto;
              max-width: 1280px;
            }

            .cars {
              grid-template-columns: 1fr 1fr 1fr;
            }
          }
        `}</style>
    </>
  )
}

UsedModel.getInitialProps = async ({ req, query }): Promise<Props> => {
  try {
    if (!query.id) {
      return { error: 404 }
    }

    const baseUrl =
      req && req.headers
        ? `${req.headers['x-forwarded-proto'] || 'https'}://${
            req.headers['x-forwarded-host'] || req.headers.host
          }`
        : ''

    const model = usedCarModels.find((model) => model.id === query.id)
    if (!model) {
      return { error: 404 }
    }

    const response = await fetch(`${baseUrl}/api/used`)
    const json = await response.json()

    if (json.error) {
      throw json.error
    }

    return { cars: json.cars as Array<ProcessedUsedCar>, model }
  } catch (error) {
    console.log('Failed to fetch cars', error)
    return { error: 500 }
  }
}

export default UsedModel
