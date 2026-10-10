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
  /** The comparison the page is showing, which a link would only reload */
  current: boolean
  /** Shown before any question is asked on it, at the foot of the chat */
  pending?: boolean
}

/**
 * Where a comparison came into the conversation, under the question that
 * brought it, so one that reads as being about "them" names the cars it means.
 * On a comparison page not yet asked about, it waits at the foot of the chat
 * for the question that will bring it.
 */
const ComparisonMarker: React.FunctionComponent<Props> = ({
  slugs,
  animate,
  current,
  pending,
}) => {
  // A stored conversation can name a car that has since left the list
  const comparison = resolveComparison(slugs)
  const { cars } = comparison
  if (cars.length === 0) return null

  const chip =
    'max-w-full py-1 px-3 rounded-2xl bg-cloud text-xs leading-snug font-medium text-stone no-underline text-balance'
  const label = (
    <>
      <span className="font-semibold">Samanburður:</span>{' '}
      {cars.map((car) => comparedName(car, cars)).join(', ')}
    </>
  )

  return (
    <div
      className={clsx(
        // On the assistant's side, as what it answers with in view, and
        // close over the answer it leads into
        'flex justify-start px-5',
        pending ? 'mb-4' : 'mb-2',
        animate && 'animate-message-in',
      )}
    >
      {current ? (
        <span className={chip}>{label}</span>
      ) : (
        <Link
          href={comparisonPath(comparison.slugs)}
          className={clsx(
            chip,
            'transition-colors duration-100 hover:text-tint hover:bg-smoke',
          )}
        >
          {label}
        </Link>
      )}
    </div>
  )
}

export default ComparisonMarker
