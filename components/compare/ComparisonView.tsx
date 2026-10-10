import { FunctionComponent, ReactNode } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import {
  comparedName,
  comparisonPath,
  comparisonTitle,
  MIN_COMPARED,
} from '@/modules/compare/comparison'
import { compareSpecs } from '@/modules/compare/specs'
import { agree } from '@/modules/copy/plural'
import CompareMoreLink from './CompareMoreLink'
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
  const grid = clsx('grid gap-x-3 md:gap-x-6', columns[cars.length])
  const crowded = cars.length > 3
  const canRemove = cars.length > MIN_COMPARED

  return (
    <main className="max-w-page mx-auto pb-14">
      <header className={clsx(gutter, 'pt-6 pb-5 md:pt-10 md:pb-8')}>
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/"
            className="text-sm font-semibold text-stone no-underline transition-colors duration-100 hover:text-tint"
          >
            ← Allir rafbílar
          </Link>
          <ShareButton title={title} quiet />
        </div>
        <p className={eyebrow}>Samanburður</p>
        <h1 className="mt-1 mb-0 text-2xl font-semibold leading-tight md:text-display">
          {title}
        </h1>
      </header>

      <div className={clsx(grid, gutter)}>
        {cars.map((car) => (
          <div key={car.id} className="relative">
            <Image
              alt=""
              sizes={`(max-width: 1023px) ${Math.ceil(100 / cars.length)}vw, ${Math.ceil(1024 / cars.length)}px`}
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
          'sticky top-0 z-10 py-2.5 bg-lab/90 backdrop-blur-md shadow-(--shadow-hairline)',
        )}
      >
        {cars.map((car) => (
          // The make over the model rather than beside it, as a make like
          // Volkswagen is wider than a phone's fourth of the page
          <h2 key={car.id} className="m-0 min-w-0 leading-tight">
            <span className="block text-xs font-semibold text-stone">
              {car.make}
            </span>
            <span
              className={clsx(
                'block font-semibold [overflow-wrap:anywhere]',
                crowded ? 'text-sm' : 'text-base md:text-xl',
              )}
            >
              {car.model}
            </span>
            {car.subModel && (
              <span className="block mt-0.5 text-xs font-medium text-stone">
                {car.subModel}
              </span>
            )}
          </h2>
        ))}
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
          <div key={row.key} className="py-3.5 border-b border-line">
            <dt className={eyebrow}>{row.label}</dt>
            <dd className={clsx(grid, 'm-0 mt-1.5')}>
              {row.cells.map((cell, index) => (
                <div key={cars[index].id} className="min-w-0">
                  <div
                    className={clsx(
                      crowded ? 'text-sm' : 'text-base md:text-lg',
                      cell.best ? 'font-semibold' : 'font-normal',
                    )}
                  >
                    {cell.text}
                    {cell.best && <span className="sr-only">, fremstur</span>}
                  </div>
                  {cell.detail && (
                    <div className="mt-0.5 text-xs font-medium text-stone">
                      {cell.detail}
                    </div>
                  )}
                  {cell.share !== undefined && (
                    <div
                      aria-hidden
                      className={clsx(
                        'mt-1.5 h-1 rounded-full',
                        cell.best ? 'bg-bar-lead' : 'bg-bar',
                      )}
                      style={{ width: `${Math.max(cell.share * 100, 4)}%` }}
                    />
                  )}
                </div>
              ))}
            </dd>
          </div>
        ))}

        <div className="py-3.5">
          <dt className={eyebrow}>Nánar</dt>
          <dd className={clsx(grid, 'm-0 mt-1.5')}>
            {cars.map((car) => (
              <div
                key={car.id}
                className="flex flex-col items-start gap-1 text-sm font-medium"
              >
                <a
                  href={car.sellerUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-tint font-semibold no-underline hover:underline"
                >
                  Seljandi ↗
                </a>
                {car.evDatabaseUrl && (
                  <a
                    href={car.evDatabaseUrl}
                    target="_blank"
                    rel="noopener"
                    title="ev-database.org"
                    className="text-stone no-underline hover:underline hover:text-tint"
                  >
                    Ítarefni ↗
                  </a>
                )}
              </div>
            ))}
          </dd>
        </div>
      </dl>

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

/** The verdict's place while the model writes it, the height it will roughly take */
export const VerdictPlaceholder: FunctionComponent = () => (
  <div className={clsx(gutter, 'mt-5 mb-3')}>
    <div className="p-4 rounded-card bg-cloud">
      <p className={eyebrow}>Í stuttu máli</p>
      <div aria-hidden className="mt-3 flex flex-col gap-2 animate-pulse">
        <div className="h-3.5 w-full rounded-full bg-smoke" />
        <div className="h-3.5 w-4/5 rounded-full bg-smoke" />
        <div className="h-3.5 w-3/5 rounded-full bg-smoke" />
      </div>
      <p className="mt-3 mb-0 text-fine font-medium text-clay">
        Gervigreindin ber bílana saman…
      </p>
    </div>
  </div>
)

interface VerdictProps {
  cars: ReadonlyArray<Car>
  summary: string
  picks: ReadonlyArray<{ car: Car; when: string }>
}

export const VerdictCard: FunctionComponent<VerdictProps> = ({
  cars,
  summary,
  picks,
}) => (
  <section aria-labelledby="verdict" className={clsx(gutter, 'mt-5 mb-3')}>
    <div className="p-4 rounded-card bg-cloud animate-message-in">
      <h2 id="verdict" className={eyebrow}>
        Í stuttu máli
      </h2>
      {summary && <p className="mt-2 mb-0 text-base leading-snug">{summary}</p>}
      {picks.length > 0 && (
        <ul className="mt-3 mb-0 p-0 list-none flex flex-col gap-2">
          {picks.map(({ car, when }) => (
            <li key={car.id} className="text-sm leading-snug">
              <span className="font-semibold">
                Veldu {comparedName(car, cars)}
              </span>{' '}
              ef {when}.
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 mb-0 text-fine font-medium text-clay">
        Skrifað af gervigreind út frá tölunum hér fyrir neðan
      </p>
    </div>
  </section>
)
