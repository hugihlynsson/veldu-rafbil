import type { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import type { CarReview } from '@/modules/data/carReviews'
import { carName } from '@/modules/data/getCarId'
import {
  carPathOf,
  comparisonLinkRel,
  comparisonPathOf,
} from '@/modules/detail/paths'
import { carFigures, type SpecKey } from '@/modules/detail/specs'
import { carSubtitle, deprecatedNotice } from '@/modules/detail/subtitle'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { dayText } from '@/modules/copy/dayText'
import type { NewsItem } from '@/modules/news/news'
import { itemText } from '@/modules/news/newsCopy'
import { NEWS_PATH } from '@/modules/news/paths'
import PricePill from '@/components/PricePill'
import EvDatabaseLink from '@/components/EvDatabaseLink'
import CompareIcon from '@/components/CompareIcon'
import ShareButton from '@/components/ShareButton'
import { pageColumn } from '@/components/pageColumn'
import PageTop from './PageTop'
import { heroImageProps } from './heroImage'
import SheetHero from './SheetHero'
import SuggestedCarCard, { suggestedCarList } from './SuggestedCarCard'

interface Props {
  car: Car
  similar: ReadonlyArray<Car>
  /** None for a car whose review is yet to be written */
  review?: Pick<CarReview, 'paragraphs'>
  /** What the change log tells of it, newest first */
  history?: ReadonlyArray<NewsItem>
  /** Over the list on a desktop, which is the page and has the logo */
  sheet?: boolean
  /** For everything under the photo, as a sheet steps to the car */
  contentClassName?: string
}

/** The name that labels the sheet the car is shown in */
export const SHEET_TITLE_ID = 'car-sheet-title'

// Eight, which fill the rows two to a row on a phone and four from lg. A
// ground clearance goes under the drive rather than making a ninth
const figureOrder: SpecKey[] = [
  'range',
  'acceleration',
  'capacity',
  'seats',
  'charging',
  'power',
  'drive',
  'towing',
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
  history = [],
  sheet,
  contentClassName,
}) => {
  const subTitle = carSubtitle(car)
  const notice = deprecatedNotice(car)
  // The price is the pill under the name
  const figures = carFigures(car)
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
          <div>
            {/* As wide as the text under it, so the share button keeps the
                same inset from the photo's right edge as the name from its
                left */}
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
                  <>
                    {/* Until lg, too narrow for a long name beside the
                        labelled pill */}
                    <ShareButton
                      title={car.label}
                      path={carPathOf(car)}
                      label={`Deila ${car.label}`}
                      event="Car shared"
                      variant="icon"
                      className="mt-1 lg:hidden"
                    />
                    <ShareButton
                      title={car.label}
                      path={carPathOf(car)}
                      label="Deila"
                      event="Car shared"
                      variant="quiet"
                      className="shrink-0 mt-1 max-lg:hidden"
                    />
                  </>
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
            </div>

            {/* Narrower than the text until four to a row need its width */}
            <dl className="m-0 mt-10 md:mt-14 grid grid-cols-2 gap-x-6 gap-y-5 md:max-w-column md:grid-cols-3 lg:max-w-none lg:grid-cols-4">
              {figures.map((row) => (
                <div key={row.key}>
                  <dt className={eyebrow}>{row.label}</dt>
                  <dd className="m-0 mt-1">
                    <div
                      className="text-2xl font-normal"
                      title={row.cells[0]?.title}
                    >
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
                rel={comparisonLinkRel([car, ...similar])}
                className="text-sm font-semibold text-tint no-underline hover:underline"
              >
                Bera alla saman <span aria-hidden>→</span>
              </Link>
            </div>
            <ul className={suggestedCarList}>
              {similar.map((other) => (
                <SuggestedCarCard
                  key={other.id}
                  car={other}
                  action={{
                    href: comparisonPathOf([car, other]),
                    label: `Bera ${carName(car, [car])} saman við ${carName(other, [other])}`,
                    text: 'Bera saman',
                    icon: <CompareIcon size={14} />,
                  }}
                />
              ))}
            </ul>
          </section>

          {history.length > 0 && (
            <section aria-labelledby="history" className="mt-13 md:mt-16">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="history" className={sectionLabel}>
                  Saga:
                </h2>
                <Link
                  href={NEWS_PATH}
                  className="text-sm font-semibold text-tint no-underline hover:underline"
                >
                  Allar uppfærslur <span aria-hidden>→</span>
                </Link>
              </div>
              <ol className="mt-2 mb-0 p-0 list-none">
                {history.map((item, index) => (
                  <li
                    key={`${item.date}-${item.kind}-${index}`}
                    className="flex flex-col gap-0.5 py-2.5 border-b border-line last:border-b-0 text-sm sm:flex-row sm:gap-4"
                  >
                    <time
                      dateTime={item.date}
                      className="shrink-0 font-medium text-stone sm:w-36"
                    >
                      {dayText(item.date)}
                    </time>
                    <span>{itemText(item, 'history')}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </Root>
  )
}

export default CarView
