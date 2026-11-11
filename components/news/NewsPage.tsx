import { FunctionComponent, ReactNode } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import type { NewsDay } from '@/modules/news/news'
import { daysRangeText } from '@/modules/news/newsCopy'
import { NEWS_PATH } from '@/modules/news/paths'
import PageTop from '@/components/detail/PageTop'
import { pageColumn } from '@/components/pageColumn'
import DayArticle from './DayArticle'

/** A neighbouring page of days, named by the days it holds */
interface NeighbourPage {
  path: string
  days: ReadonlyArray<NewsDay>
}

interface Props {
  title: string
  /** The updates page's own, under its title */
  intro?: ReactNode
  days: ReadonlyArray<NewsDay>
  older?: NeighbourPage
  newer?: NeighbourPage
  /**
   * A page further back, which a reader steps through rather than lands on:
   * its title is a line under the way back, so the days start near the top
   */
  stepped?: boolean
}

const stepLink =
  'block py-2 text-sm font-semibold text-tint no-underline hover:underline'

/** Days of news in full, newest first, between the pages either side */
const NewsPage: FunctionComponent<Props> = ({
  title,
  intro,
  days,
  older,
  newer,
  stepped,
}) => (
  <main className="max-w-page mx-auto pb-14 md:pb-24">
    <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6')}>
      <PageTop />
    </header>
    <div className={pageColumn}>
      <div>
        {stepped ? (
          <>
            <Link
              href={NEWS_PATH}
              className="text-sm font-semibold text-stone no-underline hover:underline"
            >
              <span aria-hidden>←</span> Uppfærslur
            </Link>
            <h1 className="m-0 mt-1 text-2xl font-semibold leading-tight text-balance">
              {title}
            </h1>
          </>
        ) : (
          <>
            <h1 className="m-0 mt-4 font-semibold text-display leading-tight text-balance">
              {title}
            </h1>
            {intro && (
              <p className="mt-2 mb-0 max-w-prose text-base leading-normal text-pretty text-stone">
                {intro}
              </p>
            )}
          </>
        )}

        {days.map((day, index) => (
          <DayArticle
            key={day.date}
            day={day}
            className={
              stepped && index === 0
                ? 'mt-10 md:mt-14'
                : 'mt-16 md:mt-24 lg:mt-20'
            }
          />
        ))}

        {(older || newer) && (
          <nav
            aria-label="Fleiri uppfærslur"
            className="mt-16 pt-4 border-t border-line grid gap-1 sm:grid-cols-2 md:mt-24"
          >
            {newer && (
              <Link href={newer.path} className={stepLink}>
                <span aria-hidden>←</span> Nýrri: {daysRangeText(newer.days)}
              </Link>
            )}
            {older && (
              <Link
                href={older.path}
                className={clsx(stepLink, 'text-right sm:col-start-2')}
              >
                Eldri: {daysRangeText(older.days)} <span aria-hidden>→</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  </main>
)

export default NewsPage
