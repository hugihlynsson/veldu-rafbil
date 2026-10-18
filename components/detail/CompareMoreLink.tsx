'use client'

import { FunctionComponent, ReactNode } from 'react'
import Link from 'next/link'
import { trackEvent } from 'fathom-client'

import type { Car } from '@/modules/data/cars'
import { useListHref } from '@/utils/listReturn'
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
    href={useListHref()}
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
