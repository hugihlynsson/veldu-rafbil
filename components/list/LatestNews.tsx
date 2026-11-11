import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { photoZoom } from '@/components/photoZoom'
import { dayText } from '@/modules/copy/dayText'
import type { LatestNews as Latest } from '@/modules/news/news'

interface Props {
  latest: Latest
  /** Where it sits, which differs by the page around it: its margins alone */
  className?: string
  /** Under the list's intro it is above the fold; in the footer it is not */
  preload?: boolean
}

/**
 * The newest day of updates, as a story is set beside its photo: a label, the
 * headline and the day. One size wherever it is, under the list's intro and in
 * the footer: beside other content from lg, at a width that keeps the intro
 * to three lines and the headline to two
 */
const LatestNews: FunctionComponent<Props> = ({
  latest,
  className,
  preload,
}) => (
  <Link
    href={latest.path}
    className={clsx(
      'group max-w-[33em] flex items-center gap-4 text-tint no-underline md:gap-5 lg:w-[25.5rem] lg:shrink-0',
      className,
    )}
  >
    {latest.image && (
      <div className="w-32 h-[89px] shrink-0 overflow-hidden rounded-lg bg-cloud">
        {/* The size the box renders at, so the 1x/2x pair is 128 and 256 */}
        <Image
          preload={preload}
          alt=""
          src={latest.image}
          width={128}
          height={89}
          className={clsx('w-full h-full object-cover', photoZoom)}
        />
      </div>
    )}
    <div className="min-w-0">
      <div className="uppercase text-eyebrow font-bold tracking-wider text-stone">
        Nýtt
      </div>
      <div className="mt-1 text-sm font-semibold leading-tight text-balance md:text-base">
        {latest.headline}
      </div>
      <div className="mt-1 text-sm font-medium text-stone">
        {dayText(latest.date)}
      </div>
    </div>
  </Link>
)

export default LatestNews
