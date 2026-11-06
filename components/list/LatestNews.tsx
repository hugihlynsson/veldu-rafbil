import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { dayText } from '@/modules/copy/dayText'
import type { LatestNews as Latest } from '@/modules/news/news'

interface Props {
  latest: Latest
  /** Where it sits, which differs by the page around it: its margins alone */
  className?: string
}

/**
 * The newest day of updates, as a story is set beside its photo: a label, the
 * headline and the day. One size wherever it is, under the list's intro and in
 * the footer: beside other content from lg, at a width that keeps the intro
 * to three lines and the headline to two. Its photo zooms on hover, as a new
 * car's does on the updates page
 */
const LatestNews: FunctionComponent<Props> = ({ latest, className }) => (
  <Link
    href={latest.path}
    className={clsx(
      'group max-w-[33em] flex items-center gap-4 text-tint no-underline md:gap-5 lg:w-[25.5rem] lg:shrink-0',
      className,
    )}
  >
    {latest.image && (
      <div className="w-32 h-[89px] shrink-0 overflow-hidden rounded-lg bg-cloud">
        {/* The size the box renders at, so the 1x/2x pair is 128 and 256. The
            zoom eases in over 500ms and back in 300ms, as a slow return
            lingers after the pointer has gone */}
        <Image
          alt=""
          src={latest.image}
          width={128}
          height={89}
          className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:scale-105 motion-safe:group-hover:duration-500"
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
