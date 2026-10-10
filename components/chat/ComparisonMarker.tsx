'use client'

import React from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import {
  comparedName,
  comparisonPath,
  resolveComparison,
} from '@/modules/compare/comparison'

interface Props {
  slugs: ReadonlyArray<string>
  animate: boolean
}

/**
 * Where a comparison came into the conversation, under the question that
 * brought it, so one that reads as being about "them" names the cars it means
 */
const ComparisonMarker: React.FunctionComponent<Props> = ({
  slugs,
  animate,
}) => {
  // A stored conversation can name a car that has since left the list
  const comparison = resolveComparison(slugs)
  const { cars } = comparison
  if (cars.length === 0) return null

  return (
    <div
      className={clsx(
        'flex justify-end px-5 -mt-2 mb-4',
        animate && 'animate-message-in',
      )}
    >
      <Link
        href={comparisonPath(comparison.slugs)}
        className="max-w-full py-1 px-3 rounded-full bg-cloud text-xs font-medium text-stone no-underline truncate transition-colors duration-100 hover:text-tint hover:bg-smoke"
      >
        <span className="font-semibold">Samanburður:</span>{' '}
        {cars.map((car) => comparedName(car, cars)).join(', ')}
      </Link>
    </div>
  )
}

export default ComparisonMarker
