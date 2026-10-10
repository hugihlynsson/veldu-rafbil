'use client'

import { FunctionComponent, ReactNode } from 'react'
import { trackEvent } from 'fathom-client'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import { setComparedCars } from '@/utils/useComparison'

interface Props {
  cars: ReadonlyArray<Car>
  className?: string
  children: ReactNode
}

/** Back to the list with these cars in the tray, for someone sent the link too */
const CompareMoreLink: FunctionComponent<Props> = ({
  cars,
  className,
  children,
}) => (
  <Link
    href="/"
    className={className}
    onClick={() => {
      setComparedCars(cars)
      trackEvent('Compare more')
    }}
  >
    {children}
  </Link>
)

export default CompareMoreLink
