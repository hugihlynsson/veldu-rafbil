'use client'

import { FunctionComponent } from 'react'
import { trackEvent } from 'fathom-client'

import type { Car } from '@/modules/data/cars'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import LinkPill from './LinkPill'

interface Props {
  car: Car
  /** Price per km of range in the badge, when that is what the list ranks by */
  showValue?: boolean
  /** Set in the regular weight, where only the best figure is bold */
  light?: boolean
  compact?: boolean
  /** Without the badge, for a column too narrow to hold it beside the price */
  bare?: boolean
  className?: string
}

/** A car's price after the grant, as a link to the seller */
const PricePill: FunctionComponent<Props> = ({
  car,
  showValue,
  light,
  compact,
  bare,
  className,
}) => (
  <LinkPill
    className={className}
    href={car.sellerUrl}
    external
    light={light}
    compact={compact}
    extra={
      bare
        ? undefined
        : (car.expectedDelivery && car.hasGrant && 'áætlað verð með styrk ↗') ||
          (car.expectedDelivery && 'áætlað verð ↗') ||
          (showValue &&
            `${car.hasGrant ? 'með styrk ' : ''}${addDecimalSeparators(
              Math.round(car.pricePerKm),
            )} kr. á km.`) ||
          (car.hasGrant && 'með styrk') ||
          undefined
    }
    title={
      car.hasGrant
        ? `Fullt verð án styrks: ${addDecimalSeparators(car.price)} kr.`
        : undefined
    }
    onClick={() => trackEvent('Seller clicked')}
  >
    {addDecimalSeparators(car.priceWithGrant)} kr.
    {!car.expectedDelivery && ' ↗'}
  </LinkPill>
)

export default PricePill
