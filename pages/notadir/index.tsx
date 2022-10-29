import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import smoothscroll from 'smoothscroll-polyfill'

import { ProcessedUsedCar, UsedCarModel } from '../../types'
import Toggles from '../../components/Toggles'
import Footer from '../../components/Footer'
import ModelCard from '../../components/UsedCarModelCard'
import estimateWLTP from '../../modules/estimateWLTP'
import usedCarModels from '../../apiHelpers/usedCarModels'
import LinkPill from '../../components/LinkPill'

type Sorting = 'price' | 'name' | 'range' | 'acceleration' | 'value' | 'age'

interface Model {
  count: number
  images: Array<string>
  lowestPrice?: number
  model: UsedCarModel
  oldest?: number
  years: Array<number>
}

const getRange = (modelItem: Model): number => {
  if (modelItem.model.range) {
    return modelItem.model.range
  }

  if (modelItem.model.rangeNEDC) {
    return estimateWLTP(modelItem.model.rangeNEDC)
  }

  return 0
}

type Models = { [id: string]: Array<ProcessedUsedCar> }

const carsToModels = (models: Models, car: ProcessedUsedCar): Models => ({
  ...models,
  [car.metadata!.id]: models[car.metadata!.id]
    ? [...models[car.metadata!.id], car]
    : [car],
})

type SortingQuery = 'nafni' | 'verdi' | 'draegni' | 'hrodun' | 'virdi' | 'aldri'

const sortingToQuery: { [key in Sorting]: SortingQuery } = {
  name: 'nafni',
  price: 'verdi',
  range: 'draegni',
  acceleration: 'hrodun',
  value: 'virdi',
  age: 'aldri',
}

const queryToSorting: { [key in SortingQuery]: Sorting } = {
  nafni: 'name',
  verdi: 'price',
  draegni: 'range',
  hrodun: 'acceleration',
  virdi: 'value',
  aldri: 'age',
}

interface Props {
  cars: Array<ProcessedUsedCar>
  initialSorting: SortingQuery | undefined
}

const Used: NextPage<Props> = ({ cars, initialSorting }) => {
  const { pathname } = useRouter()
  const [sorting, setSorting] = useState<Sorting>(
    queryToSorting[initialSorting || 'verdi'],
  )

  useEffect(() => {
    const query =
      sorting === 'price' ? {} : { radaeftir: sortingToQuery[sorting] }
    Router.replace({ pathname, query }, undefined, { scroll: false })
  }, [sorting])

  const models = useMemo(
    () =>
      cars
        .filter(({ filtered }) => !filtered)
        .filter(({ metadata }) => Boolean(metadata?.id))
        .reduce(carsToModels, {}),
    [cars],
  )

  useEffect(() => smoothscroll.polyfill(), [])

  const modelSorter = (a: Model, b: Model): number => {
    switch (sorting) {
      case 'price': {
        return (
          (a.lowestPrice || Number.MAX_SAFE_INTEGER) -
          (b.lowestPrice || Number.MAX_SAFE_INTEGER)
        )
      }
      case 'age': {
        return (b.oldest || 0) - (a.oldest || 0)
      }
      case 'name': {
        const getName = (modelItem: Model): string =>
          `${modelItem.model.make} ${modelItem.model.model}`
        return getName(a).localeCompare(getName(b))
      }
      case 'value': {
        return (
          (a.lowestPrice || Number.MAX_SAFE_INTEGER) / getRange(a) -
          (b.lowestPrice || Number.MAX_SAFE_INTEGER) / getRange(b)
        )
      }
      case 'range': {
        return getRange(b) - getRange(a)
      }
      case 'acceleration': {
        return (
          (a.model.acceleration ?? Number.MAX_SAFE_INTEGER) -
          (b.model.acceleration ?? Number.MAX_SAFE_INTEGER)
        )
      }
      default: {
        return 1
      }
    }
  }

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

  const totalUsedCount = Object.values(models).reduce(
    (sum, model) => sum + model.length,
    0,
  )

  return (
    <>
      <div className="root" key="used">
        <Head>
          <title key="title">Veldu Rafbíl – Notaðir</title>
        </Head>

        <header>
          <h1>Veldu Rafbíl</h1>

          <nav className="">
            <LinkPill href="/">Nýir ←</LinkPill>

            <LinkPill href="#notadir" current onClick={handleNewPress}>
              Notaðir ↓
            </LinkPill>
          </nav>

          <p className="description" ref={descriptionRef}>
            Listi yfir alla {totalUsedCount} notuðu bílana sem eru til sölu á
            Íslandi og eru 100% rafdrifnir. Upplýsingar um drægni eru samkvæmt{' '}
            <a href="http://wltpfacts.eu/">WLTP</a> mælingum þegar bíllinn er
            nýr en ekki er tekið tillit til rýrnunar með aldri eða notkun
            rafhlöðunnar. <strong>*</strong>Stjörnumerkt drægni er áætluð úr
            NEDC þar sem nýrri mælingar eru ekki til.
          </p>

          <div className="sorting-title">Raða eftir:</div>
          <Toggles<Sorting>
            currentValue={sorting}
            items={[
              ['Verði', 'price'],
              // ['Aldri', 'age'],
              ['Drægni', 'range'],
              ['Hröðun', 'acceleration'],
              ['Nafni', 'name'],
              ['Verði á km', 'value'],
            ]}
            onClick={setSorting}
          />
        </header>

        <div className="cars">
          {Object.entries(models)
            .map(
              ([id, cars]): Model => ({
                model: usedCarModels.find((model) => model.id === id)!,
                images: cars
                  .map((car) => car.image)
                  .filter(Boolean) as Array<string>,
                count: cars.length,
                lowestPrice: cars.reduce(
                  (lowest: number | undefined, { price }) =>
                    lowest ? (price ? Math.min(price, lowest) : lowest) : price,
                  undefined,
                ),
                oldest: cars.reduce((oldest: number | undefined, { date }) => {
                  const maybeYear = Number(
                    (date.split('/')[1] || '').split(' ')[0],
                  )
                  if (isNaN(maybeYear)) {
                    return oldest
                  }
                  return oldest ? Math.min(maybeYear, oldest) : maybeYear
                }, undefined),
                years: cars.map(({ date }) =>
                  Number(date.split('/')[1] || ''.split(' ')[0]),
                ),
              }),
            )
            .sort(modelSorter)
            .map(({ model, images, count, lowestPrice, years }) => (
              <ModelCard
                key={model.id}
                model={model}
                count={count}
                images={images}
                lowestPrice={lowestPrice}
                years={years}
                showValue={sorting === 'value'}
              />
            ))}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .root {
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

        .cars {
          display: grid;
          grid-gap: 32px;
          grid-template-columns: 1fr;
          margin-top: 0px;
          margin-left: 16px;
          margin-right: 16px;
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
            max-width: 1024px;
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
            margin: 0px 40px 40px;
          }
        }

        @media screen and (min-width: 1194px) {
          header {
            padding-bottom: 40px;
          }

          .root {
            margin: 0 auto;
            max-width: 1280px;
          }

          .cars {
            grid-template-columns: 1fr 1fr 1fr;
            margin-left: 24px;
            margin-right: 24px;
          }
        }
      `}</style>
    </>
  )
}

Used.getInitialProps = async ({ req, query }): Promise<Props> => {
  try {
    const baseUrl =
      req && req.headers
        ? `${req.headers['x-forwarded-proto'] || 'https'}://${
            req.headers['x-forwarded-host'] || req.headers.host
          }`
        : ''
    const response = await fetch(`${baseUrl}/api/used`)
    const json = await response.json()
    if (json.error) {
      throw json.error
    }
    return {
      cars: json.cars as Array<ProcessedUsedCar>,
      initialSorting: query.radaeftir as SortingQuery | undefined,
    }
  } catch (error) {
    console.log('Failed to fetch cars', error)
    return {
      cars: [],
      initialSorting: query.radaeftir as SortingQuery | undefined,
    }
  }
}

export default Used
