'use client'

import type { FunctionComponent, ReactNode } from 'react'
import Link from 'next/link'
import { trackEvent } from 'fathom-client'

import type { TrackedEvent } from '@/modules/analytics/events'
import { track } from '@/utils/track'

interface Props {
  href: string
  event: TrackedEvent
  /** Fathom's name for it, which only counts */
  fathomEvent: string
  className?: string
  'aria-label'?: string
  children: ReactNode
}

/** A link that says it was followed, for a page that otherwise needs no script */
const TrackedLink: FunctionComponent<Props> = ({
  event,
  fathomEvent,
  children,
  ...link
}) => (
  <Link
    {...link}
    onClick={() => {
      trackEvent(fathomEvent)
      track(event)
    }}
  >
    {children}
  </Link>
)

export default TrackedLink
