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
import PageTop from './PageTop'
import Review from './Review'

interface Props {
  car: Car
  similar: ReadonlyArray<Car>
  /** None for a car whose review is yet to be written */
  review?: CarReview
}

const gutter = 'px-(--gutter) md:px-10'
// Price per km of range is left to the list's sorting: a ratio few buyers
// weigh a car by, beside a price shown under the name
const figureOrder: SpecKey[] = [
  'range',
  'acceleration',
  'capacity',
  'power',
  'seats',
  'charging',
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
    <main className="max-w-page mx-auto pb-14">
      <header className={gutter}>
        <PageTop />
      </header>

      <div className="md:grid md:grid-cols-[3fr_2fr] md:items-center md:gap-10 md:px-10">
        {/* Edge to edge on a phone, as on the list; 4px past the column beside */}
        <div className="md:-mx-1">
          <Image
            alt=""
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 60vw, 600px"
            src={`/images/${car.heroImageName}.jpg`}
            width={1920}
            height={1280}
            preload
            className="w-full h-auto block md:rounded-lg"
          />
        </div>

        <div className={clsx(gutter, 'pt-4 md:p-0')}>
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
                {car.hasGrant && ' með styrk'}. Svipaðir bílar sem eru í sölu
                eru hér fyrir neðan.
              </div>
            </div>
          ) : (
            <PricePill car={car} className="mt-3 -ml-0.5" />
          )}
        </div>
      </div>

      <dl
        className={clsx(
          gutter,
          'm-0 mt-8 grid grid-cols-2 gap-x-6 gap-y-5 md:mt-10 md:grid-cols-3',
        )}
      >
        {figures.map((row) => (
          <div key={row.key}>
            <dt className={eyebrow}>{row.label}</dt>
            <dd className="m-0 mt-1">
              <div className="text-2xl font-normal">{row.cells[0].text}</div>
              {row.cells[0].detail && (
                <div className="mt-0.5 text-xs font-medium text-stone">
                  {row.cells[0].detail}
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {car.evDatabaseUrl && (
        <div className={clsx(gutter, 'mt-6')}>
          <EvDatabaseLink href={car.evDatabaseUrl} />
        </div>
      )}

      {review && <Review review={review} />}

      <section aria-labelledby="similar" className={clsx(gutter, 'mt-12')}>
        <h2 id="similar" className={sectionLabel}>
          Þú gætir líka haft áhuga á:
        </h2>
        <ul className="mt-3 mb-0 p-0 list-none grid gap-3 sm:grid-cols-3">
          {similar.map((other) => (
            // The whole card opens the car's page
            <li
              key={other.id}
              className="relative flex items-center gap-3 p-2 rounded-card border border-line transition-colors duration-200 hover:bg-cloud sm:flex-col sm:items-stretch"
            >
              {/* The size the box renders at on a phone, and near enough beside */}
              <Image
                alt=""
                sizes="(max-width: 499px) 96px, 30vw"
                src={`/images/${other.heroImageName}.jpg`}
                width={96}
                height={64}
                className="w-24 h-16 shrink-0 rounded-lg object-cover sm:w-full sm:h-auto sm:aspect-[3/2]"
              />
              <div className="flex-1 min-w-0 sm:px-1">
                <Link
                  href={carPathOf(other)}
                  className="text-sm font-semibold leading-tight text-tint no-underline after:absolute after:inset-0 after:rounded-card"
                >
                  {other.make}{' '}
                  <span className="font-normal">{other.model}</span>
                </Link>
                <div className="mt-1 text-xs font-medium text-stone">
                  {addDecimalSeparators(other.priceWithGrant)} kr. ·{' '}
                  {other.range} km
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className={clsx(gutter, 'mt-10 flex justify-center')}>
        <ShareButton
          title={car.label}
          label="Deila bílnum"
          event="Car shared"
        />
      </div>
    </main>
  )
}

export default CarView
