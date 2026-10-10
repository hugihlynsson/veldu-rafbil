import { FunctionComponent, ReactNode } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import {
  comparisonPath,
  comparisonTitle,
  MIN_COMPARED,
} from '@/modules/compare/comparison'
import { compareSpecs } from '@/modules/compare/specs'
import { agree } from '@/modules/copy/plural'
import PricePill from '@/components/PricePill'
import EvDatabaseLink from '@/components/EvDatabaseLink'
import CompareMoreLink from './CompareMoreLink'
import ListLink from './ListLink'
import ShareButton from './ShareButton'

interface Props {
  cars: ReadonlyArray<Car>
  /** The path's segments, gone cars included, for the links that take one out */
  slugs: ReadonlyArray<string>
  goneCount: number
  /** The model's verdict, in a boundary of its own so the figures never wait on it */
  verdict: ReactNode
}

const gutter = 'px-(--gutter) md:px-10'
const eyebrow =
  'm-0 uppercase text-eyebrow font-semibold tracking-wider text-stone'
const secondaryButton =
  'inline-flex items-center justify-center gap-1.5 py-2 px-4 text-sm font-semibold rounded-full no-underline bg-cloud text-tint transition duration-100 hover:bg-smoke active:scale-[0.98]'

const deliveryText = (expectedDelivery: string) =>
  `Væntanlegur ${expectedDelivery.toLowerCase()}`

const columns: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

const ComparisonView: FunctionComponent<Props> = ({
  cars,
  slugs,
  goneCount,
  verdict,
}) => {
  const title = comparisonTitle(cars)
  const crowded = cars.length > 3
  // Narrower gaps at four, which a price pill needs every pixel of
  const grid = clsx(
    'grid md:gap-x-6',
    crowded ? 'gap-x-2' : 'gap-x-3',
    columns[cars.length],
  )
  const canRemove = cars.length > MIN_COMPARED
  // Three or four outgrow the page from lg, as the list's grid does
  const wide = cars.length > 2
  const pageWidth = wide ? 1200 : 1024

  return (
    <main className={clsx('max-w-page mx-auto pb-14', wide && 'lg:max-w-grid')}>
      <header className={clsx(gutter, 'pt-6 pb-5 md:pt-10 md:pb-8')}>
        <div className="flex items-center justify-between gap-4 mb-6">
          <ListLink className="text-sm font-semibold text-stone no-underline transition-colors duration-100 hover:text-tint">
            ← Allir rafbílar
          </ListLink>
          <ShareButton title={title} quiet />
        </div>
        <p className={eyebrow}>Samanburður</p>
        <h1 className="mt-1 mb-0 text-2xl font-semibold leading-tight md:text-display">
          {title}
        </h1>
      </header>

      {/* Each photo reaches 4px past its column on either side, and the gaps
          are 8px wider to leave the same space between them */}
      <div
        className={clsx(
          'grid md:gap-x-8',
          crowded ? 'gap-x-4' : 'gap-x-5',
          columns[cars.length],
          gutter,
        )}
      >
        {cars.map((car) => (
          <div key={car.id} className="relative -mx-1">
            <Image
              alt=""
              sizes={`(max-width: ${pageWidth - 1}px) ${Math.ceil(100 / cars.length)}vw, ${Math.ceil(pageWidth / cars.length)}px`}
              src={`/images/${car.heroImageName}.jpg`}
              width={1920}
              height={1280}
              preload
              className="w-full h-auto rounded-lg block"
            />
            {canRemove && (
              <Link
                href={comparisonPath(slugs.filter((s) => s !== carSlug(car)))}
                aria-label={`Taka ${car.label} úr samanburðinum`}
                className="absolute top-1 right-1 p-1 no-underline group"
                replace
              >
                <span
                  aria-hidden
                  className="flex w-6 h-6 items-center justify-center rounded-full bg-lab/80 backdrop-blur-sm text-tint text-sm font-bold leading-none transition-transform duration-100 group-hover:scale-110"
                >
                  ×
                </span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Stays in view through the figures, so a column is never anonymous */}
      <div
        className={clsx(
          grid,
          gutter,
          'sticky top-0 z-10 py-2.5 md:py-4 bg-lab/90 backdrop-blur-md border-b border-line/50',
        )}
      >
        {cars.map((car) => (
          <h2
            key={car.id}
            className={clsx(
              'm-0 min-w-0 font-semibold leading-tight',
              crowded ? 'text-sm md:text-2xl' : 'text-base md:text-2xl',
            )}
          >
            <span>{car.make}</span>{' '}
            <span className="font-normal">{car.model}</span>
            {(car.subModel || car.expectedDelivery) && (
              <span className="block mt-0.5 text-xs font-medium text-stone md:mt-1 md:text-base">
                {car.subModel}
                {/* Beside the variant as on the list's cards, but read after
                    the heading rather than as part of the car's name */}
                {car.expectedDelivery && (
                  <span aria-hidden>
                    {car.subModel && ' · '}
                    {deliveryText(car.expectedDelivery)}
                  </span>
                )}
              </span>
            )}
          </h2>
        ))}
        {cars.map(
          (car) =>
            car.expectedDelivery && (
              <p key={car.id} className="sr-only">
                {car.label}: {deliveryText(car.expectedDelivery)}
              </p>
            ),
        )}
      </div>

      {goneCount > 0 && (
        <p className={clsx(gutter, 'mt-4 mb-0 text-sm font-medium text-stone')}>
          {goneCount === 1 ? 'Einn' : goneCount}{' '}
          {agree(goneCount, 'bíll', 'bílar')} úr þessum samanburði{' '}
          {agree(goneCount, 'er', 'eru')} ekki lengur{' '}
          {agree(goneCount, 'seldur nýr', 'seldir nýir')}.
        </p>
      )}

      {cars.length >= MIN_COMPARED && verdict}

      <dl className={clsx(gutter, 'mt-2 mb-0')}>
        {compareSpecs(cars).map((row) => (
          <div key={row.key} className="py-3.5 border-b border-line/50">
            <dt className={eyebrow}>{row.label}</dt>
            <dd className={clsx(grid, 'm-0 mt-1.5')}>
              {row.cells.map((cell, index) => (
                <div key={cars[index].id} className="min-w-0">
                  {row.key === 'price' ? (
                    <PricePill
                      car={cars[index]}
                      light={!cell.best}
                      compact={crowded}
                      bare
                      className="max-w-full -ml-0.5"
                    />
                  ) : (
                    <div
                      className={clsx(
                        crowded
                          ? 'text-sm md:text-2xl'
                          : 'text-base md:text-2xl',
                        cell.best ? 'font-semibold' : 'font-normal',
                      )}
                    >
                      {cell.text}
                    </div>
                  )}
                  {cell.best && <span className="sr-only">, fremstur</span>}
                  {cell.detail && (
                    <div className="mt-0.5 text-xs font-medium text-stone">
                      {cell.detail}
                    </div>
                  )}
                </div>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      {cars.some((car) => car.evDatabaseUrl) && (
        <div className={clsx(grid, gutter, 'mt-4')}>
          {cars.map((car) => (
            <div key={car.id} className="min-w-0">
              {car.evDatabaseUrl && <EvDatabaseLink href={car.evDatabaseUrl} />}
            </div>
          ))}
        </div>
      )}

      <div
        className={clsx(
          gutter,
          'mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center',
        )}
      >
        <ShareButton title={title} />
        <CompareMoreLink
          cars={cars}
          className={clsx(secondaryButton, 'py-3 px-5')}
        >
          <span aria-hidden>+</span> Bera saman fleiri
        </CompareMoreLink>
      </div>
    </main>
  )
}

export default ComparisonView
