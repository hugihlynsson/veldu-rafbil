import { FunctionComponent, ReactNode } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'
import { specRows } from '@/modules/detail/specs'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import PricePill from '@/components/PricePill'
import EvDatabaseLink from '@/components/EvDatabaseLink'
import ShareButton from '@/components/ShareButton'
import PageTop from './PageTop'

interface Props {
  car: Car
  similar: ReadonlyArray<Car>
  /** The model's review, in a boundary of its own so the figures never wait on it */
  verdict: ReactNode
}

const gutter = 'px-(--gutter) md:px-10'
const eyebrow =
  'm-0 uppercase text-eyebrow font-semibold tracking-wider text-stone'

/** One car's own page: its photo and figures, a review, and the cars like it */
const CarView: FunctionComponent<Props> = ({ car, similar, verdict }) => {
  const subTitle = [
    car.subModel,
    car.expectedDelivery && `Væntanlegur ${car.expectedDelivery.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(' · ')
  // The price is the pill under the name
  const figures = specRows([car]).filter(({ key }) => key !== 'price')

  return (
    <main className="max-w-page mx-auto pb-14">
      <header className={clsx(gutter, 'pt-6 md:pt-10')}>
        <PageTop>
          <ShareButton
            title={car.label}
            label="Deila"
            event="Car shared"
            variant="quiet"
          />
        </PageTop>
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
          <h1 className="m-0 font-semibold text-display leading-tight">
            <span>{car.make}</span>{' '}
            <span className="font-normal">{car.model}</span>
          </h1>
          {subTitle && (
            <p className="mt-1 mb-0 text-base font-medium text-stone">
              {subTitle}
            </p>
          )}
          <PricePill car={car} className="mt-3 -ml-0.5" />
        </div>
      </div>

      <dl
        className={clsx(
          gutter,
          'm-0 mt-8 grid grid-cols-2 gap-x-6 gap-y-5 md:mt-10 md:grid-cols-4',
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

      {verdict}

      <section aria-labelledby="similar" className={clsx(gutter, 'mt-12')}>
        <h2 id="similar" className={eyebrow}>
          Svipaðir bílar
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
