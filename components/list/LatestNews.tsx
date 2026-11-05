import { FunctionComponent } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { dayMonthText } from '@/modules/copy/dayText'
import type { LatestNews as Latest } from '@/modules/news/news'

/**
 * The newest day of updates, under the intro, beside the photo of the car it
 * leads with. Set apart by the photo and an outline rather than size, so it
 * stands out without outweighing the intro it follows
 */
const LatestNews: FunctionComponent<{ latest: Latest }> = ({ latest }) => {
  const words = latest.headline.split(' ')
  const last = words.pop()
  const rest = words.join(' ')

  return (
    <Link
      href={latest.path}
      className="self-start -mt-3 mb-8 max-w-[33em] flex items-center gap-3 rounded-card border border-line-chip p-2 pr-3.5 text-sm leading-snug text-pretty text-tint no-underline transition-colors duration-100 hover:bg-haze"
    >
      {latest.image && (
        // The size the box renders at, so the 1x/2x pair is 128 and 256, as
        // the rows on the updates page have
        <Image
          alt=""
          src={latest.image}
          width={72}
          height={48}
          className="w-18 h-12 shrink-0 self-start rounded-sm object-cover bg-cloud"
        />
      )}
      <span className={latest.image ? undefined : 'pl-1.5'}>
        <span className="font-semibold">Nýtt {dayMonthText(latest.date)}:</span>{' '}
        {rest} {/* The arrow never goes to a line of its own */}
        <span className="whitespace-nowrap">
          {last} <span aria-hidden>→</span>
        </span>
      </span>
    </Link>
  )
}

export default LatestNews
