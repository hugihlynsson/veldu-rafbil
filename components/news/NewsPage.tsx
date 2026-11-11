import { FunctionComponent, ReactNode } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { dayRangeText } from '@/modules/copy/dayText'
import type { NewsDay } from '@/modules/news/news'
import PageTop from '@/components/detail/PageTop'
import { pageColumn } from '@/components/pageColumn'
import DayArticle from './DayArticle'
import YearLinks from './YearLinks'

/** A neighbouring page of days, named by the days it holds */
export interface NeighbourPage {
  path: string
  days: ReadonlyArray<NewsDay>
}

interface Props {
  title: string
  intro: ReactNode
  days: ReadonlyArray<NewsDay>
  older?: NeighbourPage
  newer?: NeighbourPage
  /** Over the title, as a day's page has its way back */
  back?: ReactNode
}

const stepLink =
  'block py-2 text-sm font-semibold text-tint no-underline hover:underline'

const rangeOf = ({ days }: NeighbourPage) =>
  dayRangeText(days.at(-1)?.date ?? '', days[0]?.date ?? '')

/** Days of news in full, newest first, between the pages either side */
const NewsPage: FunctionComponent<Props> = ({
  title,
  intro,
  days,
  older,
  newer,
  back,
}) => (
  <main className="max-w-page mx-auto pb-14 md:pb-24">
    <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6')}>
      <PageTop />
    </header>
    <div className={pageColumn}>
      <div>
        {back}
        <h1
          className={clsx(
            'm-0 font-semibold text-display leading-tight text-balance',
            back ? 'mt-6 lg:mt-10' : 'mt-4',
          )}
        >
          {title}
        </h1>
        <p className="mt-2 mb-0 max-w-prose text-base leading-normal text-pretty text-stone">
          {intro}
        </p>

        {days.map((day) => (
          <DayArticle
            key={day.date}
            day={day}
            className="mt-16 md:mt-24 lg:mt-20"
          />
        ))}

        {(older || newer) && (
          <nav
            aria-label="Fleiri uppfærslur"
            className="mt-16 pt-4 border-t border-line grid gap-1 sm:grid-cols-2 md:mt-24"
          >
            {older && (
              <Link href={older.path} className={stepLink}>
                <span aria-hidden>←</span> Eldri: {rangeOf(older)}
              </Link>
            )}
            {newer && (
              <Link
                href={newer.path}
                className={clsx(stepLink, 'sm:col-start-2 sm:text-right')}
              >
                Nýrri: {rangeOf(newer)} <span aria-hidden>→</span>
              </Link>
            )}
          </nav>
        )}

        <YearLinks className="mt-12 md:mt-16" />
      </div>
    </div>
  </main>
)

export default NewsPage
