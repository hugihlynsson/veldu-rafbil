import React, { useState, useEffect, ChangeEvent } from 'react'
import { NextPage } from 'next'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'

import usedCarModels from '../apiHelpers/usedCarModels'
import Footer from '../components/Footer'
import { ProcessedUsedCar } from '../types'
import Car from '../components/UsedCar'

interface Props {
  cars: Array<ProcessedUsedCar>
}

const Used: NextPage<Props> = ({ cars }) => {
  const [usedCars, setUsedCars] = useState<Array<ProcessedUsedCar>>(cars)

  useEffect(() => setUsedCars(cars), [cars])

  return (
    <>
      <div className="root">
        <Head>
          <title key="title">Stjórnborð notaðra rafbíla</title>
        </Head>

        <h1>Stjórnborð notaðra rafbíla</h1>

        <div className="cars">
          {usedCars.map((car, index) => {
            const handleMetadataChange = async (
              event: ChangeEvent<HTMLSelectElement>,
            ) => {
              const metadata = usedCarModels.find(
                (model) => model.id === event.target.value,
              )
              console.log('Selected', event.target.value, metadata)

              const originalMetadata = car.metadata

              // Optimistic update
              setUsedCars(
                usedCars.map((usedCar, usedCarIndex) =>
                  index === usedCarIndex ? { ...usedCar, metadata } : usedCar,
                ),
              )

              try {
                await fetch('/api/updateUsedMetadata', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ carIndex: index, metadata: metadata }),
                })
              } catch (error) {
                // Revert to old metadata
                setUsedCars(
                  usedCars.map((usedCar, usedCarIndex) =>
                    index === usedCarIndex
                      ? { ...usedCar, originalMetadata }
                      : usedCar,
                  ),
                )
                console.log('Failed to update metadata', error)
                alert('Failed to update car metadata')
              }
            }

            const handleFilteredChange = async (
              event: ChangeEvent<HTMLInputElement>,
            ) => {
              const filtered = event.target.checked
              console.log('filtered', filtered)

              // Optimistic update
              setUsedCars(
                usedCars.map((usedCar, usedCarIndex) =>
                  index === usedCarIndex ? { ...usedCar, filtered } : usedCar,
                ),
              )

              try {
                await fetch('/api/updateUsedFiltered', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ carIndex: index, filtered }),
                })
              } catch (error) {
                // Revert to old filtered
                setUsedCars(
                  usedCars.map((usedCar, usedCarIndex) =>
                    index === usedCarIndex
                      ? { ...usedCar, filtered: !filtered }
                      : usedCar,
                  ),
                )
                console.log('Failed to update filter status', error)
                alert('Failed to update car filter status')
              }
            }

            return (
              <div key={car.link}>
                <Car car={car} />

                <div className="car-settings">
                  <select
                    value={car.metadata?.id}
                    onChange={handleMetadataChange}
                  >
                    <option value={undefined}>Ekki valið</option>

                    {usedCarModels.map((carOption) => (
                      <option value={carOption.id} key={carOption.id}>
                        {carOption.make} {carOption.model}: {carOption.id}
                      </option>
                    ))}
                  </select>

                  <input
                    id={`filtered-${car.link}`}
                    type="checkbox"
                    checked={car.filtered}
                    onChange={handleFilteredChange}
                  />
                  <label htmlFor={`filtered-${car.link}`}>Filtered</label>
                </div>
              </div>
            )
          })}
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

          .cars {
            display: grid;
            grid-gap: 32px;
            grid-template-columns: 100%;
            margin-top: 32px;
          }

          .car-settings {
            margin-top: 8px;
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
