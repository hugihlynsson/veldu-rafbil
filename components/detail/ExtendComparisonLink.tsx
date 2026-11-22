'use client'

import type { FunctionComponent, ReactNode } from 'react'
import Link from 'next/link'
import { trackEvent } from 'fathom-client'

import { comparisonPath } from '@/modules/detail/paths'
import { track } from '@/utils/track'

interface Props {
  /** The comparison's slugs, before this car */
  slugs: ReadonlyArray<string>
  car: string
  /** Its place among the cars suggested */
  position: number
  className?: string
  children: ReactNode
}

/** The comparison with one more car in it, the way back undoing it */
const ExtendComparisonLink: FunctionComponent<Props> = ({
  slugs,
  car,
  position,
  className,
  children,
}) => (
  <Link
    href={comparisonPath([...slugs, car])}
    className={className}
    onClick={() => {
      trackEvent('Comparison extended')
      track({ name: 'comparison_extended', cars: [...slugs], car, position })
    }}
  >
    {children}
  </Link>
)

export default ExtendComparisonLink
