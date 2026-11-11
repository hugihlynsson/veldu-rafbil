import { FunctionComponent, ReactNode } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import type { NewsDay } from '@/modules/news/news'
import { daysRangeText } from '@/modules/news/newsCopy'
import { NEWS_PATH } from '@/modules/news/paths'
import PageTop from '@/components/detail/PageTop'
import { pageColumn } from '@/components/pageColumn'
import DayArticle from './DayArticle'
import Pager from './Pager'

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

        <Pager
          label="Fleiri uppfærslur"
          newer={
            newer && {
              href: newer.path,
              text: `Nýrri: ${daysRangeText(newer.days)}`,
            }
          }
          older={
            older && {
              href: older.path,
              text: `Eldri: ${daysRangeText(older.days)}`,
            }
          }
          className="mt-16 md:mt-24"
        />
      </div>
    </div>
  </main>
)

export default NewsPage
