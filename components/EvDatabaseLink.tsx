'use client'

import { FunctionComponent } from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'

interface Props {
  href: string
  className?: string
}

const EvDatabaseLink: FunctionComponent<Props> = ({ href, className }) => (
  <a
    className={clsx(
      'inline-block text-sm text-stone no-underline font-medium transition-colors duration-100 hover:underline hover:text-tint',
      className,
    )}
    target="_blank"
    href={href}
    rel="noopener"
    onClick={() => trackEvent('Ev Database Link Clicked')}
  >
    Nánar á ev-database.org ↗
  </a>
)

export default EvDatabaseLink
