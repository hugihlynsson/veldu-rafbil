'use client'

import React from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import { comparedName, comparisonPathOf } from '@/modules/compare/comparison'
import { rememberListSearch } from '@/utils/listReturn'

interface Props {
  cars: ReadonlyArray<Car>
  animate: boolean
}

const listNames = (names: ReadonlyArray<string>) =>
  names.length < 2
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} og ${names.at(-1)}`

/** A link from an answer to the comparison of the cars it recommends */
const CompareAnswerCars: React.FunctionComponent<Props> = ({
  cars,
  animate,
}) => (
  <div className="px-5 mb-4">
    <Link
      href={comparisonPathOf(cars)}
      onClick={() => {
        rememberListSearch(window.location.search)
        trackEvent('Comparison opened from chat')
      }}
      className={clsx(
        'group flex items-center gap-3 w-full max-w-[500px] py-2.5 pl-2.5 pr-4 rounded-card border border-line no-underline text-inherit transition-colors duration-200 hover:bg-cloud',
        animate && 'animate-follow-up-in',
      )}
    >
      <div aria-hidden className="flex shrink-0 -space-x-4">
        {cars.map((car) => (
          // The size the box renders at, so the pair lands on 128
          <Image
            key={car.id}
            alt=""
            src={`/images/${car.heroImageName}.jpg`}
            width={48}
            height={32}
            className="w-12 h-8 rounded-lg object-cover ring-2 ring-glass"
          />
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">Bera þá saman</div>
        <div className="text-xs font-medium text-stone truncate">
          {listNames(cars.map((car) => comparedName(car, cars)))}
        </div>
      </div>
      <span
        aria-hidden
        className="text-stone transition-transform duration-200 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  </div>
)

export default CompareAnswerCars
