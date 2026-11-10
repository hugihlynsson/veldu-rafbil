import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { dayText } from '@/modules/copy/dayText'
import { headlineOf } from '@/modules/news/feed'
import { dayKinds, type NewsDay } from '@/modules/news/news'
import {
  daySummary,
  kindLabels,
  notesPrice,
  priceNote,
} from '@/modules/news/newsCopy'
import { newsDayPath } from '@/modules/news/paths'
import NewsDaySections from './NewsDaySections'

// From lg a day's date is a rail beside what the day brought. The rail takes
// a column of the page until xl, where it fits in the margin and the day has
// the page's whole width again, under the wordmark
const columns =
  'lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[10rem_minmax(0,1fr)] xl:gap-x-10'

/** A row on the rail's columns: a label in the rail and what it labels */
export const railed = clsx('lg:grid xl:-ml-50', columns)

const headlines = {
  list: 'max-w-prose text-xl font-semibold leading-tight text-balance md:text-2xl',
  page: 'max-w-prose text-display font-semibold leading-tight text-balance',
}

interface Props {
  day: NewsDay
  /** On the day's own page the headline is the page's, and links nowhere */
  page?: boolean
  className?: string
}

/**
 * A day of news: its date, its headline and what it brought. Days are set
 * apart by space and a date in the page's ink, a step larger than the labels
 * under it, rather than by a line
 */
const DayArticle: FunctionComponent<Props> = ({ day, page, className }) => {
  const headline = headlines[page ? 'page' : 'list']
  const Heading = page ? 'h1' : 'h2'
  const text = headlineOf(day)

  return (
    <article className={clsx(railed, className)}>
      {/* The rail stays in view down a long day, and has to know how tall the
          headline is: its date sits on the baseline of the headline's last
          line, and its counts start level with the day's first photo. So what
          sticks is laid over the whole day, on the day's own columns, with
          the headline set again unseen in its column to give the first row
          its height. It is generated text, so it is not in the page twice,
          and the pointer passes through all but the rail itself */}
      <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:pointer-events-none">
        <div
          className={clsx(
            'lg:sticky lg:top-3 lg:grid lg:items-baseline-last',
            columns,
          )}
        >
          <div className="lg:pointer-events-auto">
            <time
              dateTime={day.date}
              className="uppercase text-xs font-semibold tracking-wider text-tint"
            >
              {dayText(day.date)}
            </time>
          </div>
          <div
            aria-hidden
            data-headline={text}
            className={clsx(
              headline,
              'hidden invisible after:content-[attr(data-headline)] lg:block',
            )}
          />
          {/* The headings the day is told under, counted, so a day's size
              shows before its length does. From lg they stand in for the
              headings over each kind. The last line gives up the space under
              its letters, so at the foot of a day they stand on the line the
              last photo ends on */}
          <dl className="hidden m-0 mt-5 -mb-1 text-sm font-medium text-stone lg:block lg:col-start-1 lg:pointer-events-auto">
            {dayKinds.map(
              (kind) =>
                day.items[kind].length > 0 && (
                  <div
                    key={kind}
                    className="flex justify-between gap-3 py-1.5 border-t border-line last:pb-0"
                  >
                    <dt>
                      {kindLabels[kind]}
                      {notesPrice(kind) && (
                        <span className="block text-xs text-clay">
                          {priceNote}
                        </span>
                      )}
                    </dt>
                    <dd className="m-0 text-tint">{day.items[kind].length}</dd>
                  </div>
                ),
            )}
          </dl>
        </div>
      </div>
      <div className="lg:col-start-2 lg:row-start-1">
        <Heading className={clsx(headline, 'm-0 mt-1 lg:mt-0')}>
          {page ? (
            text
          ) : (
            <Link
              href={newsDayPath(day.date)}
              className="text-tint no-underline hover:underline"
            >
              {text}
            </Link>
          )}
        </Heading>
        {/* The rail counts the same things from lg */}
        {page && (
          <p className="mt-2 mb-0 text-base text-stone lg:hidden">
            {daySummary(day)}
          </p>
        )}
        <NewsDaySections day={day} />
      </div>
    </article>
  )
}

export default DayArticle
