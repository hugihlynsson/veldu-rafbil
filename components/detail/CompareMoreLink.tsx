'use client'

import { FunctionComponent, ReactNode } from 'react'
import { trackEvent } from 'fathom-client'

import type { Car } from '@/modules/data/cars'
import { setComparedCars } from '@/utils/useComparison'
import ListLink from './ListLink'

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
  <ListLink
    className={className}
    onClick={() => {
      setComparedCars(cars)
      trackEvent('Compare more')
    }}
  >
    {children}
  </ListLink>
)

export default CompareMoreLink
