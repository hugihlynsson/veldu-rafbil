import { FunctionComponent } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { dayText } from '@/modules/copy/dayText'
import type { LatestNews as Latest } from '@/modules/news/news'

/**
 * The newest day of updates under the intro, as a story is set beside its
 * photo: a label, the headline and the day. Its photo zooms on hover, as a new
 * car's does on the updates page
 */
const LatestNews: FunctionComponent<{ latest: Latest }> = ({ latest }) => (
  <Link
    href={latest.path}
    className="group self-start mt-1 mb-10 max-w-[33em] flex items-center gap-4 text-tint no-underline md:gap-5"
  >
    {latest.image && (
      <div className="w-32 aspect-[3/2] shrink-0 overflow-hidden rounded-lg bg-cloud md:w-40">
        {/* 128px on a phone and 160px from md, where its width is taken. The
            zoom eases in over 500ms and back in 300ms, as a slow return
            lingers after the pointer has gone */}
        <Image
          alt=""
          src={latest.image}
          width={160}
          height={107}
          className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:scale-105 motion-safe:group-hover:duration-500"
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
