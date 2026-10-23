import { FunctionComponent, ReactNode } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { carPathOf, comparisonPath } from '@/modules/detail/paths'
import { comparisonTitle, MIN_COMPARED } from '@/modules/detail/comparison'
import { specRows } from '@/modules/detail/specs'
import { deprecatedNotice } from '@/modules/detail/subtitle'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { agree } from '@/modules/copy/plural'
import PricePill from '@/components/PricePill'
import EvDatabaseLink from '@/components/EvDatabaseLink'
import CompareMoreLink from './CompareMoreLink'
import PageTop from './PageTop'
import { Lane, ScrollLanes } from './ScrollLanes'
import ShareButton from '@/components/ShareButton'
import CrossIcon from '@/components/CrossIcon'
import PlusIcon from '@/components/PlusIcon'
import { pageColumn } from '@/components/pageColumn'

interface Props {
  cars: ReadonlyArray<Car>
  /** The path's segments, for the links that take one out */
  slugs: ReadonlyArray<string>
  /** The model's verdict, in a boundary of its own so the figures never wait on it */
  verdict: ReactNode
}

// The car page's photo and the list's cards keep these edges from md
const gutter = 'px-(--gutter) md:pl-10 md:pr-6'
// Three or four cars outgrow the page from lg, centred on it as the list's
// grid is, while the header stays where the list has it
const breakout =
  'lg:mx-[calc((100%_-_min(100vw_-_5rem,_var(--container-grid)))_/_2)]'
const wideGutter = `lg:px-0 ${breakout}`
// On a phone, three or four columns are kept at least this wide, 9.5rem, and
// scroll sideways: two and a bit in view, the bit saying there is more. The
// gaps are the names' and figures' at that count.
const scrollingWidth: Record<number, string> = {
  3: 'max-md:w-[max(100%,calc(3*9.5rem+1.5rem+2*var(--gutter)))]',
  4: 'max-md:w-[max(100%,calc(4*9.5rem+1.5rem+2*var(--gutter)))]',
}
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

const ComparisonView: FunctionComponent<Props> = ({ cars, slugs, verdict }) => {
  const goneCount = cars.filter((car) => car.deprecated).length
  const title = comparisonTitle(cars)
  const crowded = cars.length > 3
  // Narrower gaps at four, which a price pill needs every pixel of
  const grid = clsx(
    'grid md:gap-x-6',
    crowded ? 'gap-x-2' : 'gap-x-3',
    columns[cars.length],
  )
  const canRemove = cars.length > MIN_COMPARED
  const wide = cars.length > 2
  const body = clsx(gutter, wide && wideGutter)
  // A strip of the columns, which scrolls sideways on a phone with three or
  // four; the gutter is inside it, so the first column starts where the
  // page's text does and the last can scroll clear of the edge
  const lane = clsx(wide && breakout)
  const laneContent = clsx(
    gutter,
    wide && 'lg:px-0',
    scrollingWidth[cars.length],
  )
  // The width the columns share: the page less its edges, or the grid's
  const pageWidth = wide ? 1200 : 960

  return (
    <main className="max-w-page mx-auto pb-14 md:pb-24">
      {/* The list's gap from the logo to its intro, as a car's page has it */}
      <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6 md:pb-8')}>
        <PageTop />
        {/* Further from the logo than a car's name, which the photo parts
            from it. Padding, as a margin would collapse into the logo's */}
        <div className="pt-4 md:pt-6">
          <p className={eyebrow}>Samanburður</p>
          <div className="mt-1 flex items-center justify-between gap-4">
            <h1 className="m-0 min-w-0 text-2xl font-semibold leading-tight md:text-display">
              {title}
            </h1>
            <ShareButton
              title={title}
              label="Deila samanburði"
              event="Comparison shared"
              variant="icon"
            />
          </div>
        </div>
      </header>

      <ScrollLanes>
        {/* Each photo reaches 4px past its column on either side, and the gaps
          are 8px wider to leave the same space between them */}
        <Lane scrolls={wide} className={lane}>
          <div
            className={clsx(
              'grid md:gap-x-8',
              crowded ? 'gap-x-4' : 'gap-x-5',
              columns[cars.length],
              laneContent,
            )}
          >
            {cars.map((car) => (
              <div key={car.id} className="relative -mx-1 snap-start">
                <Image
                  alt=""
                  sizes={
                    wide
                      ? `(max-width: 767px) 45vw, (max-width: ${pageWidth - 1}px) ${Math.ceil(100 / cars.length)}vw, ${Math.ceil(pageWidth / cars.length)}px`
                      : `(max-width: ${pageWidth - 1}px) ${Math.ceil(100 / cars.length)}vw, ${Math.ceil(pageWidth / cars.length)}px`
                  }
                  src={`/images/${car.heroImageName}.jpg`}
                  width={1920}
                  height={1280}
                  preload
                  className="w-full h-auto rounded-lg block"
                />
                {canRemove && (
                  <Link
                    href={comparisonPath(
                      slugs.filter((s) => s !== carSlug(car)),
                    )}
                    aria-label={`Taka ${car.label} úr samanburðinum`}
                    className="absolute top-1 right-1 p-1 no-underline group"
                    replace
                  >
                    <span
                      aria-hidden
                      className="flex w-6 h-6 items-center justify-center rounded-full bg-glass/50 backdrop-blur-md text-tint transition-colors duration-100 group-hover:bg-glass/70"
                    >
                      <CrossIcon size={10} />
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Lane>

        {/* Stays in view through the figures, so a column is never anonymous.
          The backdrop reaches the page's edges, and the line under the names
          only the columns, as the lines between the figures do */}
        <Lane
          scrolls={wide}
          className={clsx(lane, 'sticky top-0 z-10 bg-lab/90 backdrop-blur-md')}
        >
          <div className={laneContent}>
            <div
              className={clsx(grid, 'py-2.5 md:py-4 border-b border-line/50')}
            >
              {cars.map((car) => (
                <h2
                  key={car.id}
                  className={clsx(
                    'm-0 min-w-0 snap-start font-semibold leading-tight',
                    crowded ? 'text-sm md:text-2xl' : 'text-base md:text-2xl',
                  )}
                >
                  <Link
                    href={carPathOf(car)}
                    className="text-inherit no-underline decoration-2 underline-offset-4 hover:underline"
                  >
                    <span>{car.make}</span>{' '}
                    <span className="font-normal">{car.model}</span>
                  </Link>
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
          </div>
        </Lane>

        {goneCount > 0 && (
          <p className={clsx(body, 'mt-4 mb-0 text-sm font-medium text-stone')}>
            {goneCount === 1 ? 'Einn' : goneCount}{' '}
            {agree(goneCount, 'bíll', 'bílar')} úr þessum samanburði{' '}
            {agree(goneCount, 'er', 'eru')} ekki lengur{' '}
            {agree(goneCount, 'seldur nýr', 'seldir nýir')}.
          </p>
        )}

        {/* None for a car no longer sold, as its own page has no review */}
        {cars.length >= MIN_COMPARED && goneCount === 0 && (
          // From the table's edge, at the measure of a car's review
          <div className={body}>{verdict}</div>
        )}

        <Lane scrolls={wide} className={clsx(lane, 'mt-2')}>
          <dl className={clsx(laneContent, 'm-0')}>
            {specRows(cars).map((row) => (
              <div key={row.key} className="py-3.5 border-b border-line/50">
                {/* Kept in view as the figures scroll under it */}
                <dt
                  className={clsx(
                    eyebrow,
                    'w-fit max-md:sticky max-md:left-(--gutter)',
                  )}
                >
                  {row.label}
                </dt>
                <dd className={clsx(grid, 'm-0 mt-1.5')}>
                  {row.cells.map((cell, index) => {
                    const car = cars[index]
                    const notice = car && deprecatedNotice(car)
                    // Relative, so the sr-only label is held by the strip
                    // that scrolls it rather than widening the page
                    return (
                      <div
                        key={car?.id ?? index}
                        className="relative min-w-0 snap-start"
                      >
                        {notice && car && row.key === 'price' ? (
                          // In place of the price, which links to a seller no
                          // longer selling it, as on the car's own page
                          <div className="text-sm">
                            <div className="font-semibold">{notice}</div>
                            <div className="mt-0.5 text-xs font-medium text-stone">
                              Síðasta verð{' '}
                              {addDecimalSeparators(car.priceWithGrant)} kr.
                              {car.hasGrant && ' með styrk'}
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            {cell.best && (
                              // In the gap before the figure rather than
                              // beside it, so the columns stay aligned. Clear of
                              // the price's pill, which starts before them.
                              // The first column's is pulled in where the
                              // gutter is too narrow for it, as dark's is
                              <span
                                aria-hidden
                                className={clsx(
                                  'absolute top-1/2 -translate-y-1/2 size-1.25 rounded-full bg-sky md:-left-3.75 md:size-1.75',
                                  row.key === 'price'
                                    ? '-left-3.25'
                                    : '-left-2.5',
                                  index === 0 &&
                                    (row.key === 'price'
                                      ? 'max-md:left-[max(-0.8125rem,calc(2px_-_var(--gutter)))]'
                                      : 'max-md:left-[max(-0.625rem,calc(2px_-_var(--gutter)))]'),
                                )}
                              />
                            )}
                            {row.key === 'price' && car ? (
                              <PricePill
                                car={car}
                                compact={crowded}
                                bare
                                className="max-w-full -ml-0.5"
                              />
                            ) : (
                              <div className="text-2xl">{cell.text}</div>
                            )}
                          </div>
                        )}
                        {cell.best && (
                          <span className="sr-only">, fremstur</span>
                        )}
                        {cell.detail && !(notice && row.key === 'price') && (
                          <div className="mt-0.5 text-xs font-medium text-stone">
                            {cell.detail}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </dd>
              </div>
            ))}
          </dl>
        </Lane>

        {cars.some((car) => car.evDatabaseUrl) && (
          <Lane scrolls={wide} className={clsx(lane, 'mt-4')}>
            <div className={clsx(grid, laneContent)}>
              {cars.map((car) => (
                <div key={car.id} className="min-w-0 snap-start">
                  {car.evDatabaseUrl && (
                    <EvDatabaseLink car={car} href={car.evDatabaseUrl} />
                  )}
                </div>
              ))}
            </div>
          </Lane>
        )}
      </ScrollLanes>

      <div
        className={clsx(
          body,
          'mt-14 md:mt-16 flex flex-wrap items-center gap-2 sm:gap-3',
        )}
      >
        <ShareButton
          title={title}
          label="Deila samanburði"
          event="Comparison shared"
          className="-ml-0.5 max-sm:grow max-sm:px-2.5"
        />
        <CompareMoreLink
          cars={cars}
          className={clsx(
            secondaryButton,
            'py-3 px-5 max-sm:grow max-sm:px-2.5',
          )}
        >
          <PlusIcon size={16} /> Bera saman fleiri
        </CompareMoreLink>
      </div>
    </main>
  )
}

export default ComparisonView
