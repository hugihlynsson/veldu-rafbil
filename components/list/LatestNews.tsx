import { FunctionComponent } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { dayText } from '@/modules/copy/dayText'
import type { LatestNews as Latest } from '@/modules/news/news'

/**
 * The newest day of updates under the intro, as a story is set beside its
 * photo: a label, the headline and the day. The photo beside the text takes a
 * fill on hover, as the rows on the updates page do, reaching 10px past the
 * photo and rounding by its radius and those 10px so the corners run parallel
 */
const LatestNews: FunctionComponent<{ latest: Latest }> = ({ latest }) => (
  <Link
    href={latest.path}
    className="relative isolate self-start mt-1 mb-10 max-w-[33em] flex items-center gap-4 text-tint no-underline before:absolute before:-inset-2.5 before:-z-10 before:rounded-[calc(var(--radius-lg)+10px)] before:bg-shade before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100"
  >
    {latest.image && (
      <div className="w-32 aspect-[3/2] shrink-0 overflow-hidden rounded-lg bg-cloud">
        {/* The size the box renders at, so the 1x/2x pair is 128 and 256 */}
        <Image
          alt=""
          src={latest.image}
          width={128}
          height={85}
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div className="min-w-0">
      <div className="uppercase text-eyebrow font-semibold tracking-wider text-stone">
        Nýtt
      </div>
      <div className="mt-1 text-base font-semibold leading-snug text-balance">
        {latest.headline}
      </div>
      <div className="mt-1 text-sm font-medium text-stone">
        {dayText(latest.date)}
      </div>
    </div>
  </Link>
)

export default LatestNews
