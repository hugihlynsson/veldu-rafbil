import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { dayText, monthText } from '@/modules/copy/dayText'
import { headlineOf } from '@/modules/news/feed'
import type { NewsDay } from '@/modules/news/news'
import { newsDayPath } from '@/modules/news/paths'
import { railed } from './DayArticle'

interface Props {
  days: ReadonlyArray<NewsDay>
  /** The level the months take under whatever heads the list */
  heading: 'h2' | 'h3'
}

/** Days of news a line each, linking to their pages, by month on the rail */
const DayLines: FunctionComponent<Props> = ({ days, heading: Heading }) => {
  const months = new Map<string, NewsDay[]>()
  for (const day of days) {
    const month = monthText(day.date)
    months.set(month, [...(months.get(month) ?? []), day])
  }

  return [...months].map(([month, ofMonth]) => (
    <div
      key={month}
      className={clsx(
        railed,
        'mt-4 lg:items-baseline lg:mt-0 lg:py-3 lg:border-t lg:border-line lg:first-of-type:mt-4',
      )}
    >
      <Heading className="m-0 text-eyebrow uppercase font-semibold tracking-wider text-stone lg:text-xs">
        {month}
      </Heading>
      <ul className="mt-1 mb-0 p-0 list-none lg:mt-0">
        {ofMonth.map((day) => (
          <li
            key={day.date}
            className="py-1 text-base lg:flex lg:items-baseline lg:justify-between lg:gap-6"
          >
            <Link
              href={newsDayPath(day.date)}
              className="text-tint no-underline hover:underline"
            >
              {headlineOf(day)}
            </Link>{' '}
            <span className="text-sm text-stone lg:shrink-0">
              {dayText(day.date)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ))
}

export default DayLines
