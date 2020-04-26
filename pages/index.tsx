import React, { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import Router, { useRouter } from 'next/router'
import Link from 'next/link'
import smoothscroll from 'smoothscroll-polyfill'

import Car from '../components/NewCar'
import Footer from '../components/Footer'
import Toggles from '../components/Toggles'
import LinkPill from '../components/LinkPill'
import newCars, { expectedCars } from '../modules/newCars'
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

const carSorter = (sorting: Sorting) => (a: NewCar, b: NewCar) => {
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

interface Props {
  initialSorting: SortingQuery | undefined
}

const New: NextPage<Props> = ({ initialSorting }) => {
  const { pathname } = useRouter()
  const [sorting, setSorting] = useState<Sorting>(
    queryToSorting[initialSorting || 'nafni'],
  )

  useEffect(() => smoothscroll.polyfill(), [])

  useEffect(() => {
    const query =
      sorting === 'name' ? {} : { radaeftir: sortingToQuery[sorting] }
    Router.replace({ pathname, query })
  }, [sorting])

  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const handleNewPress = useCallback(
    (event) => {
      event.preventDefault()
      descriptionRef.current?.scrollIntoView({ behavior: 'smooth' })
    },
    [descriptionRef],
  )

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

        {stableSort(newCars, carSorter(sorting)).map((car, i) => (
          <Car
            car={car}
            key={`${car.make} ${car.model} ${car.capacity}`}
            lazyLoad={i >= 2}
          />
        ))}
      </div>

      <section className="expected">
        <div className="content">
          <header>
            <h2 className="expectedHeader">Væntanlegir rafbílar</h2>
          </header>

          {stableSort(expectedCars, carSorter('name')).map((car) => (
            <Car
              car={car}
              key={`${car.make} ${car.model} ${car.capacity}`}
              lazyLoad
            />
          ))}
        </div>
      </section>

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
            margin 0 auto;
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

          .sorting-title {
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
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

New.getInitialProps = ({ query }) =>
  Promise.resolve({
    initialSorting: query.radaeftir as SortingQuery | undefined,
  })

export default New
