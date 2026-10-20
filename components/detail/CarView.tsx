import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import type { Car } from '@/modules/data/cars'
import type { CarReview } from '@/modules/data/carReviews'
import { carName } from '@/modules/data/getCarId'
import { comparisonPathOf } from '@/modules/detail/paths'
import { specRows, type SpecKey } from '@/modules/detail/specs'
import { carSubtitle, deprecatedNotice } from '@/modules/detail/subtitle'
import { grantChangeNotice } from '@/modules/detail/grantChange'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import PricePill from '@/components/PricePill'
import EvDatabaseLink from '@/components/EvDatabaseLink'
import ShareButton from '@/components/ShareButton'
import { pageColumn } from '@/components/pageColumn'
import PageTop from './PageTop'
import SimilarCars from './SimilarCars'

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

/** One car's own page: its photo and figures, a review, and the cars like it */
const CarView: FunctionComponent<Props> = ({ car, similar, review }) => {
  const subTitle = carSubtitle(car)
  const notice = deprecatedNotice(car)
  const grantChange = grantChangeNotice(car)
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
                {/* Nothing to pass on about a car that cannot be bought */}
                {!notice && (
                  <ShareButton
                    title={car.label}
                    label="Deila"
                    event="Car shared"
                    variant="quiet"
                    className="shrink-0 mt-1"
                  />
                )}
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
              {grantChange && (
                <div className="mt-3 py-2.5 px-3.5 rounded-card bg-cloud text-sm text-pretty">
                  <div className="font-semibold">{grantChange.title}</div>
                  <div className="mt-0.5 font-medium text-stone">
                    {grantChange.text}
                  </div>
                </div>
              )}
            </div>

            <dl className="m-0 mt-10 md:mt-14 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3">
              {figures.map((row) => (
                <div key={row.key}>
                  <dt className={eyebrow}>{row.label}</dt>
                  <dd className="m-0 mt-1">
                    <div className="text-2xl font-normal">
                      {row.cells[0]?.text}
                    </div>
                    {row.cells[0]?.detail && (
                      <div className="mt-0.5 text-xs font-medium text-stone">
                        {row.cells[0]?.detail}
                      </div>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {review && (
            <section aria-labelledby="review" className="mt-8 mb-6">
              {/* 65ch of the wrapper's 16px, not the 18px text, keeps lines
                  near 70 */}
              <div className="max-w-prose">
                <h2 id="review" className="m-0 text-sm font-semibold">
                  Í hnotskurn:
                </h2>
                {review.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-2 mb-0 text-base leading-normal text-pretty md:text-lg [&+&]:mt-3"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {(!notice || car.evDatabaseUrl) && (
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              {!notice && (
                <ShareButton
                  title={car.label}
                  label="Deila bílnum"
                  event="Car shared"
                  className="-ml-0.5"
                />
              )}
              {car.evDatabaseUrl && (
                <EvDatabaseLink car={car} href={car.evDatabaseUrl} />
              )}
            </div>
          )}

          <SimilarCars
            cars={similar}
            heading="Þú gætir líka haft áhuga á:"
            all={{
              href: comparisonPathOf([car, ...similar]),
              label: 'Bera alla saman',
            }}
            compareWith={(other) => ({
              href: comparisonPathOf([car, other]),
              label: `Bera ${carName(car, [car])} saman við ${carName(other, [other])}`,
            })}
            className="mt-12 md:mt-16"
          />
        </div>
      </div>
    </main>
  )
}

export default CarView
