'use client'

import { FunctionComponent } from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { track } from '@/utils/track'

interface Props {
  car: Car
  href: string
  className?: string
}

const EvDatabaseLink: FunctionComponent<Props> = ({ car, href, className }) => (
  <a
    className={clsx(
      'inline-block text-sm text-stone no-underline font-medium transition-colors duration-100 hover:underline hover:text-tint',
      className,
    )}
    target="_blank"
    href={href}
    rel="noopener"
    onClick={() => {
      trackEvent('Ev Database Link Clicked')
      track({ name: 'ev_database_clicked', car: carSlug(car) })
    }}
  >
    Nánar á ev-database.org ↗
  </a>
)

export default EvDatabaseLink
