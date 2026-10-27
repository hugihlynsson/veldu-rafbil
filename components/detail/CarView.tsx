import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import type { CarReview } from '@/modules/data/carReviews'
import { carName } from '@/modules/data/getCarId'
import { carPathOf, comparisonPathOf } from '@/modules/detail/paths'
import { specRows, type SpecKey } from '@/modules/detail/specs'
import { carSubtitle, deprecatedNotice } from '@/modules/detail/subtitle'
import { grantChangeNotice } from '@/modules/detail/grantChange'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import PricePill from '@/components/PricePill'
import EvDatabaseLink from '@/components/EvDatabaseLink'
import CompareIcon from '@/components/CompareIcon'
import ShareButton from '@/components/ShareButton'
import { pageColumn } from '@/components/pageColumn'
import PageTop from './PageTop'
import { heroImageProps } from './heroImage'
import SheetHero from './SheetHero'

interface Props {
  car: Car
  similar: ReadonlyArray<Car>
  /** None for a car whose review is yet to be written */
  review?: CarReview
  /** Over the list on a desktop, which is the page and has the logo */
  sheet?: boolean
  /** For everything under the photo, as a sheet steps to the car */
  contentClassName?: string
}

/** The name that labels the sheet the car is shown in */
export const SHEET_TITLE_ID = 'car-sheet-title'

// Eight, which fill the rows two to a row on a phone and four from lg
const figureOrder: SpecKey[] = [
  'range',
  'acceleration',
  'capacity',
  'seats',
  'charging',
  'power',
  'drive',
  'value',
]

const eyebrow =
  'm-0 uppercase text-eyebrow font-semibold tracking-wider text-stone'
// As the list labels its sorting
const sectionLabel = 'm-0 text-sm font-semibold'

/** One car's own page: its photo and figures, a review, and the cars like it */
const CarView: FunctionComponent<Props> = ({
  car,
  similar,
  review,
  sheet,
  contentClassName,
}) => {
  const subTitle = carSubtitle(car)
  const notice = deprecatedNotice(car)
  const grantChange = grantChangeNotice(car)
  // The price is the pill under the name
  const figures = specRows([car])
    .filter(({ key }) => figureOrder.includes(key))
    .toSorted((a, b) => figureOrder.indexOf(a.key) - figureOrder.indexOf(b.key))

  // In a sheet the list is the page behind, with its own landmark and logo
  const Root = sheet ? 'article' : 'main'

  return (
    <Root
      // In a sheet, the end scrolls clear of the chat bar raised over it
      className={clsx('max-w-page mx-auto', sheet ? 'pb-24' : 'pb-14 md:pb-24')}
    >
      {!sheet && (
        // The list's gap from the logo to its intro, which pads its top
        <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6')}>
          <PageTop />
        </header>
      )}

      {/* Edge to edge on a phone, and from md as wide as the column, as the
          list has its photos. A sheet is only ever md up, and its photo runs
          to its edges: the window less 184px, the margins and the step
          buttons, up to the sheet's 960px, which CarSheet sets */}
      <div className={clsx(!sheet && 'md:px-10')}>
        {sheet ? (
          <SheetHero car={car} />
        ) : (
          <Image
            {...heroImageProps(car)}
            preload
            className="w-full h-auto block md:rounded-lg"
          />
        )}
      </div>

      {/* Keyed, so a sheet's step starts its slide over, and what is in it
          starts afresh with each car */}
      <div key={car.id} className={clsx(pageColumn, contentClassName)}>
        {/* The review's measure, which the rest of the page keeps, centred
            under the photo as it is on a phone */}
        <div className="md:max-w-prose md:mx-auto">
          {/* The name and the figures read as one block, narrower than the
              text under them until four figures to a row need its width */}
          <div className="md:max-w-column lg:max-w-none">
            <div className="pt-8 md:pt-14">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1
                    id={sheet ? SHEET_TITLE_ID : undefined}
                    className="m-0 font-semibold text-display leading-tight"
                  >
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
                    path={carPathOf(car)}
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

            <dl className="m-0 mt-10 md:mt-14 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3 lg:grid-cols-4">
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
            <div className="mt-11 md:mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              {!notice && (
                <ShareButton
                  title={car.label}
                  path={carPathOf(car)}
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

          <section aria-labelledby="similar" className="mt-13 md:mt-16">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="similar" className={sectionLabel}>
                Þú gætir líka haft áhuga á:
              </h2>
              <Link
                href={comparisonPathOf([car, ...similar])}
                className="text-sm font-semibold text-tint no-underline hover:underline"
              >
                Bera alla saman <span aria-hidden>→</span>
              </Link>
            </div>
            <ul className="mt-3 -mx-0.5 mb-0 p-0 list-none grid gap-3 md:mx-0 md:grid-cols-3">
              {similar.map((other) => (
                // The whole card opens the car's page; the button over it compares
                <li
                  key={other.id}
                  className="relative flex items-center gap-3 rounded-card overflow-hidden transition-colors duration-200 hover:bg-shade md:flex-col md:items-stretch md:overflow-visible md:hover:bg-transparent md:isolate md:before:absolute md:before:-inset-1 md:before:-bottom-3 md:before:-z-10 md:before:rounded-xl md:before:bg-shade md:before:opacity-0 md:before:transition-opacity md:before:duration-200 md:hover:before:opacity-100"
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
                    className="w-32 h-auto aspect-[3/2] shrink-0 self-stretch object-cover md:w-full md:rounded-lg"
                  />
                  <div className="flex-1 min-w-0 py-2 text-balance md:p-0 md:px-1">
                    <Link
                      href={carPathOf(other)}
                      className="text-base font-semibold leading-tight text-tint no-underline after:absolute after:inset-0 after:rounded-card after:border after:border-line md:after:border-0"
                    >
                      {other.make}{' '}
                      <span className="font-normal">{other.model}</span>
                    </Link>
                    <div className="mt-1 text-sm font-medium text-stone">
                      {/* On the narrowest phones it breaks between the two */}
                      <span className="whitespace-nowrap">
                        {addDecimalSeparators(other.priceWithGrant)} kr. ·
                      </span>{' '}
                      <span className="whitespace-nowrap">
                        {other.range} km
                      </span>
                    </div>
                  </div>
                  {/* An icon beside the name on phones, where the words would
                      squeeze it, and the words under it from md up */}
                  <Link
                    href={comparisonPathOf([car, other])}
                    aria-label={`Bera ${carName(car, [car])} saman við ${carName(other, [other])}`}
                    className="relative z-1 shrink-0 self-center mr-3 inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full border border-line-chip bg-lab text-tint no-underline transition duration-100 hover:bg-cloud active:scale-[0.95] md:self-start md:w-auto md:h-auto md:mx-1 md:py-1 md:px-3"
                  >
                    <span className="flex md:hidden">
                      <CompareIcon size={14} />
                    </span>
                    <span className="hidden md:inline">Bera saman</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Root>
  )
}

export default CarView
