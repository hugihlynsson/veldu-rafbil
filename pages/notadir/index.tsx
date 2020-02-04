import React, { useState, useMemo } from 'react'
import { NextPage } from 'next'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'

import { ProcessedUsedCar, UsedCarModel } from '../../types'
import Toggles from '../../components/Toggles'
import Footer from '../../components/Footer'
import ModelCard from '../../components/UsedCarModelCard'
import estimateWLTP from '../../modules/estimateWLTP'
import usedCarModels from '../../apiHelpers/usedCarModels'

type Sorting = 'price' | 'name' | 'range' | 'acceleration' | 'value' | 'age'

interface Model {
  count: number
  images: Array<string>
  lowestPrice?: number
  model: UsedCarModel
  oldest?: number
}

const getRange = (modelItem: Model): number => {
  if (modelItem.model.range) {
    return modelItem.model.range
  }

  if (modelItem.model.rangeNEDC) {
    return Number(estimateWLTP(modelItem.model.rangeNEDC))
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

interface Props {
  cars: Array<ProcessedUsedCar>
}

const Used: NextPage<Props> = ({ cars }) => {
  const [sorting, setSorting] = useState<Sorting>('name')

  const models = useMemo(
    () =>
      cars
        .filter(({ filtered }) => !filtered)
        .filter(({ metadata }) => Boolean(metadata?.id))
        .reduce(carsToModels, {}),
    [cars],
  )

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
            <a href="http://wltpfacts.eu/">WLTP</a> mælingum þegar bíllinn er
            nýr en ekki er tekið tillit til rýrnunar með aldri eða notkun
            rafhlöðunnar. <strong>*</strong>Stjörnumerkt drægni er áætluð úr
            NEDC þar sem nýrri mælingar eru ekki til.
          </p>

          <div className="sorting-title">Raða eftir:</div>
          <Toggles<Sorting>
            currentValue={sorting}
            items={[
              ['Nafni', 'name'],
              ['Verði', 'price'],
              ['Verði á km', 'value'],
              ['Aldri', 'age'],
              ['Drægni', 'range'],
              ['Hröðun', 'acceleration'],
            ]}
            onClick={setSorting}
          />
        </header>

        <div className="cars">
          {Object.entries(models)
            .map(
              ([id, cars]): Model => ({
                model: usedCarModels.find((model) => model.id === id)!,
                images: cars.map((car) => car.image).filter(Boolean) as Array<
                  string
                >,
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
              }),
            )
            .sort(modelSorter)
            .map(({ model, images, count, lowestPrice }) => (
              <ModelCard
                key={model.id}
                model={model}
                count={count}
                images={images}
                lowestPrice={lowestPrice}
              />
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

          @media screen and (min-width: 1194px) {
            header {
              max-width: none;
              padding-bottom: 40px; 
            }
            
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
