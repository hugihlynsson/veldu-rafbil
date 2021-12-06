import React, { useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import Link from 'next/link'
import smoothscroll from 'smoothscroll-polyfill'

import Car from '../components/NewCar'
import Footer from '../components/Footer'
import LinkPill from '../components/LinkPill'
import { expectedCars } from '../modules/newCars'

interface Props {}

const New: NextPage<Props> = ({}) => {
  useEffect(() => smoothscroll.polyfill(), [])

  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const handleCurrentPagePress = useCallback(
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
          <title key="title">Veldu Rafbíl | Væntanlegir</title>
          <meta
            key="description"
            name="description"
            content={`Listi yfir ${expectedCars.length} rafbíla sem eru 100% rafdrifnir og eru væntanlegir í sölu á Íslandi.`}
          />
        </Head>

        <header>
          <h1>Veldu Rafbíl</h1>

          <nav className="headerLinks">
            <Link href="/" passHref>
              <LinkPill>Nýir ←</LinkPill>
            </Link>

            <LinkPill current onClick={handleCurrentPagePress} href="#nyjir">
              Væntanlegir ↓
            </LinkPill>

            <Link href="/notadir" passHref>
              <LinkPill>Notaðir →</LinkPill>
            </Link>
          </nav>

          <p className="description" id="nyjir" ref={descriptionRef}>
            Listi yfir {expectedCars.length} rafbíla sem eru 100% rafdrifnir og
            eru væntanlegir í sölu á Íslandi. Upplýsingar um drægni eru samkvæmt{' '}
            <a href="http://wltpfacts.eu/">WLTP</a> mælingum frá framleiðenda og
            eru áætlaðar liggi þær ekki fyrir.
            <em>Verð eru birt án ábyrgðar og geta verið úrelt.</em>
          </p>
        </header>

        {expectedCars.map((car) => (
          <Car
            car={car}
            key={`${car.make} ${car.model} ${car.subModel}`}
            onGray
          />
        ))}
      </div>

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
          .description a {
            text-decoration: none;
            font-weight: 500;
            color: black;
          }
          .description a:hover {
            text-decoration: underline;
          }
          .description em {
            display: inline-block;
            font-size: 12px;
            color: #888;
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

export default New
