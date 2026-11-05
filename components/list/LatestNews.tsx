import { FunctionComponent } from 'react'
import Link from 'next/link'

import { dayMonthText } from '@/modules/copy/dayText'
import type { LatestNews as Latest } from '@/modules/news/news'

/** A line under the intro to the newest day of what is new on the list */
const LatestNews: FunctionComponent<{ latest: Latest }> = ({ latest }) => (
  <Link
    href={latest.path}
    className="group self-start -mt-4 mb-8 max-w-[33em] text-sm leading-6 text-pretty text-tint no-underline md:text-base"
  >
    <span className="font-semibold">Nýtt {dayMonthText(latest.date)}:</span>{' '}
    <span className="group-hover:underline">{latest.headline}</span>{' '}
    <span aria-hidden>→</span>
  </Link>
)

export default LatestNews
