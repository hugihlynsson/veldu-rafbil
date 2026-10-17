import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import type { CarReview } from '@/modules/data/carReviews'
import { carPathOf } from '@/modules/detail/paths'
import { specRows, type SpecKey } from '@/modules/detail/specs'
import { carSubtitle, deprecatedNotice } from '@/modules/detail/subtitle'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import PricePill from '@/components/PricePill'
import EvDatabaseLink from '@/components/EvDatabaseLink'
import ShareButton from '@/components/ShareButton'
import { pageColumn } from '@/components/pageColumn'
import PageTop from './PageTop'
import Review from './Review'

interface Props {
  car: Car
  similar: ReadonlyArray<Car>
  /** None for a car whose review is yet to be written */
  review?: CarReview
}

// Price per km of range is left to the list's sorting: a ratio few buyers
// weigh a car by, beside a price shown under the name
const figureOrder: SpecKey[] = [
  'range',
  'acceleration',
  'capacity',
  'seats',
  'charging',
  'power',
]

const eyebrow =
  'm-0 uppercase text-eyebrow font-semibold tracking-wider text-stone'
// As the list labels its sorting
const sectionLabel = 'm-0 text-sm font-semibold'

/** One car's own page: its photo and figures, a review, and the cars like it */
const CarView: FunctionComponent<Props> = ({ car, similar, review }) => {
  const subTitle = carSubtitle(car)
  const notice = deprecatedNotice(car)
  // The price is the pill under the name
  const figures = specRows([car])
    .filter(({ key }) => figureOrder.includes(key))
    .toSorted((a, b) => figureOrder.indexOf(a.key) - figureOrder.indexOf(b.key))

  return (
    <main className="max-w-page mx-auto pb-14 md:pb-24">
      {/* The list's gap from the logo to its intro, which pads its top */}
      <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6')}>
        <PageTop />
      </header>

      {/* Edge to edge on a phone, and from md as wide as the column, as the
          list has its photos */}
      <div className="md:pl-10 md:pr-6">
        <Image
          alt=""
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) calc(100vw - 64px), 960px"
          src={`/images/${car.heroImageName}.jpg`}
          width={1920}
          height={1280}
          preload
          className="w-full h-auto block md:rounded-lg"
        />
      </div>

      <div className={pageColumn}>
        {/* The review's measure, which the rest of the page keeps, centred
            under the photo as it is on a phone */}
        <div className="md:max-w-prose md:mx-auto">
          {/* The name and the figures read as one block, narrower than the
              text under them */}
          <div className="md:max-w-column">
            <div className="pt-8 md:pt-14">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="m-0 font-semibold text-display leading-tight">
                    <span>{car.make}</span>{' '}
                    <span className="font-normal">{car.model}</span>
                  </h1>
                  {subTitle && (
                    <p className="mt-1 mb-0 text-base font-medium text-stone">
                      {subTitle}
                    </p>
                  )}
                </div>
                <ShareButton
                  title={car.label}
                  label="Deila"
                  event="Car shared"
                  variant="quiet"
                  className="shrink-0 mt-1"
                />
              </div>
              {notice ? (
                // In place of the price, which links to a seller no longer
                // selling it
                <div className="mt-3 py-2.5 px-3.5 rounded-card bg-cloud text-sm">
                  <div className="font-semibold">{notice}</div>
                  <div className="mt-0.5 font-medium text-stone">
                    Síðasta verð {addDecimalSeparators(car.priceWithGrant)} kr.
                    {car.hasGrant && ' með styrk'}. Svipaðir bílar sem eru í
                    sölu eru hér fyrir neðan.
                  </div>
                </div>
              ) : (
                <PricePill car={car} className="mt-3 -ml-0.5" />
              )}
            </div>

            <dl className="m-0 mt-10 md:mt-14 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3">
              {figures.map((row) => (
                <div key={row.key}>
                  <dt className={eyebrow}>{row.label}</dt>
                  <dd className="m-0 mt-1">
                    <div className="text-2xl font-normal">
                      {row.cells[0].text}
                    </div>
                    {row.cells[0].detail && (
                      <div className="mt-0.5 text-xs font-medium text-stone">
                        {row.cells[0].detail}
                      </div>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {review && <Review review={review} />}

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ShareButton
              title={car.label}
              label="Deila bílnum"
              event="Car shared"
            />
            {car.evDatabaseUrl && <EvDatabaseLink href={car.evDatabaseUrl} />}
          </div>

          <section aria-labelledby="similar" className="mt-12 md:mt-16">
            <h2 id="similar" className={sectionLabel}>
              Þú gætir líka haft áhuga á:
            </h2>
            <ul className="mt-3 mb-0 p-0 list-none grid gap-3 md:grid-cols-3">
              {similar.map((other) => (
                // The whole card opens the car's page
                <li
                  key={other.id}
                  className="relative flex items-center gap-3 rounded-card overflow-hidden transition-colors duration-200 hover:bg-cloud md:flex-col md:items-stretch md:overflow-visible md:hover:bg-transparent md:isolate md:before:absolute md:before:-inset-1 md:before:-bottom-3 md:before:-z-10 md:before:rounded-xl md:before:bg-cloud md:before:opacity-0 md:before:transition-opacity md:before:duration-200 md:hover:before:opacity-100"
                >
                  {/* Beside the name, flush to the card with its border drawn
                      over it. Above the name it needs no border, and on hover
                      the card shows 4px past the photo: rounded-xl is the
                      photo's rounded-lg grown by those 4px, at whatever
                      --corner scales them by */}
                  <Image
                    alt=""
                    sizes="(max-width: 767px) 128px, 210px"
                    src={`/images/${other.heroImageName}.jpg`}
                    width={128}
                    height={85}
                    className="w-32 h-auto aspect-[3/2] shrink-0 object-cover md:w-full md:rounded-lg"
                  />
                  <div className="flex-1 min-w-0 py-2 pr-3 md:p-0 md:px-1">
                    <Link
                      href={carPathOf(other)}
                      className="text-sm font-semibold leading-tight text-tint md:text-base no-underline after:absolute after:inset-0 after:rounded-card after:border after:border-line md:after:border-0"
                    >
                      {other.make}{' '}
                      <span className="font-normal">{other.model}</span>
                    </Link>
                    <div className="mt-1 text-xs font-medium text-stone md:text-sm">
                      {addDecimalSeparators(other.priceWithGrant)} kr. ·{' '}
                      {other.range} km
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}

export default CarView
