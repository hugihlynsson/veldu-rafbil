import React, { useState } from 'react'
import { NextPage } from 'next'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'

import usedCarModels from '../../apiHelpers/usedCarModels'
import Footer from '../../components/Footer'
import { ProcessedUsedCar } from '../../types'
import UsedAdminCar from '../../components/UsedAdminCar'

interface Props {
  cars: Array<ProcessedUsedCar>
}

const Used: NextPage<Props> = ({ cars }) => {
  const [usedCars, setUsedCars] = useState<Array<ProcessedUsedCar>>(cars)

  const setCar = (index: number, updatedCar: ProcessedUsedCar): void =>
    setUsedCars(
      usedCars.map((usedCar, usedCarIndex) =>
        index === usedCarIndex ? updatedCar : usedCar,
      ),
    )

  const handleMetadataChange = async (
    carListIndex: number,
    car: ProcessedUsedCar,
    usedModelId: string,
  ) => {
    const selectedMetadata = usedCarModels.find(
      (model) => model.id === usedModelId,
    )

    const originalMetadata = car.metadata

    // Optimistic update
    setCar(carListIndex, { ...car, metadata: selectedMetadata })

    try {
      const response = await fetch('/api/updateUsedMetadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carIndex: carListIndex,
          metadata: selectedMetadata,
        }),
      })
      if (response.status !== 200) {
        throw new Error(`Failed to update ${response.statusText}`)
      }
    } catch (error) {
      // Revert to old metadata
      setCar(carListIndex, { ...car, metadata: originalMetadata })
      console.log('Failed to update metadata', error)
      alert('Failed to update car metadata')
    }
  }

  const handleFilteredChange = async (
    selectedCarIndex: number,
    car: ProcessedUsedCar,
    filtered: boolean,
  ) => {
    // Optimistic update
    setCar(selectedCarIndex, { ...car, filtered })

    try {
      const response = await fetch('/api/updateUsedFiltered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carIndex: selectedCarIndex, filtered }),
      })
      if (response.status !== 200) {
        throw new Error(`Failed to update ${response.statusText}`)
      }
    } catch (error) {
      // Revert to old filtered
      setCar(selectedCarIndex, { ...car, filtered: !filtered })
      console.log('Failed to update filter status', error)
      alert('Failed to update car filter status')
    }
  }

  const unTagged = usedCars
    .map((car, index) => ({ car, index }))
    .filter(({ car }) => !car.metadata)

  return (
    <>
      <div className="root">
        <Head>
          <title key="title">Stjórnborð notaðra rafbíla</title>
        </Head>

        <h1>Stjórnborð notaðra rafbíla</h1>

        <h2>
          Ómerktir <span>{unTagged.length}</span>
        </h2>

        <div className="cars">
          {unTagged.map(({ car, index }) => (
            <UsedAdminCar
              key={car.link}
              car={car}
              onFilteredChange={(filtered: boolean) =>
                handleFilteredChange(index, car, filtered)
              }
              onMetadataChange={(usedCarId) =>
                handleMetadataChange(index, car, usedCarId)
              }
            />
          ))}
        </div>

        <h2>
          Allir <span>{usedCars.length}</span>
        </h2>

        <div className="cars">
          {usedCars.map((car, index) => (
            <UsedAdminCar
              key={car.link}
              car={car}
              onFilteredChange={(filtered) =>
                handleFilteredChange(index, car, filtered)
              }
              onMetadataChange={(usedCarId) =>
                handleMetadataChange(index, car, usedCarId)
              }
            />
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

          h2 {
            font-size: 32px;
            font-weight: 600;
          }

          h2 span {
            font-weight: 400;
          }

          .cars {
            display: grid;
            grid-gap: 32px;
            grid-template-columns: 100%;
            margin-top: 32px;
          }

          @media screen and (min-width: 767px) {
            .root {
              margin 0 auto;
              max-width: 1180px;
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
