import { FunctionComponent } from 'react'
import Link from 'next/link'

import { dayMonthText } from '@/modules/copy/dayText'
import type { LatestNews as Latest } from '@/modules/news/news'

/**
 * The newest day of updates, under the intro. Set apart by a fill rather than
 * size, so it stands out without outweighing the intro it follows
 */
const LatestNews: FunctionComponent<{ latest: Latest }> = ({ latest }) => {
  const words = latest.headline.split(' ')
  const last = words.pop()
  const rest = words.join(' ')

  return (
    <Link
      href={latest.path}
      className="group self-start -mt-3 mb-8 max-w-[33em] rounded-card bg-cloud px-3.5 py-2.5 text-sm leading-6 text-pretty text-tint no-underline transition-colors duration-100 hover:bg-smoke md:text-base"
    >
      <span>
        <span className="font-semibold">Nýtt {dayMonthText(latest.date)}:</span>{' '}
        <span className="group-hover:underline">{rest}</span>{' '}
        {/* The arrow never goes to a line of its own */}
        <span className="whitespace-nowrap">
          <span className="group-hover:underline">{last}</span>{' '}
          <span aria-hidden>→</span>
        </span>
      </span>
    </Link>
  )
}

export default LatestNews
