'use client'

import React from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import { carName, carSlug } from '@/modules/data/getCarId'
import { comparisonPathOf } from '@/modules/detail/paths'
import { listNames } from '@/modules/copy/listNames'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { getConversationId } from '@/utils/chatStorage'
import { rememberListSearch } from '@/utils/listReturn'
import { track } from '@/utils/track'

interface Props {
  cars: ReadonlyArray<Car>
  animate: boolean
  /** The comparison the answer named and led into, given the room of one */
  featured?: boolean
}

const openFrom = (cars: ReadonlyArray<Car>) => () => {
  // The chat is on a car's page and a comparison too, whose own query is not
  // the list's to go back to
  if (window.location.pathname === '/') {
    rememberListSearch(window.location.search)
  }
  trackEvent('Comparison opened from chat')
  track({
    name: 'comparison_opened',
    cars: cars.map(carSlug),
    source: 'chat',
    conversationId: getConversationId(),
  })
}

// Two and four sit in pairs; three side by side
const columns = (count: number) => (count === 3 ? 'grid-cols-3' : 'grid-cols-2')

const FeaturedComparison: React.FunctionComponent<Props> = ({
  cars,
  animate,
}) => (
  <div className="px-5 mb-4">
    <Link
      href={comparisonPathOf(cars)}
      onClick={openFrom(cars)}
      className={clsx(
        'group block w-full max-w-[500px] rounded-card border border-line bg-tile no-underline text-inherit overflow-hidden transition duration-200 hover:bg-tile-hover hover:-translate-y-0.5 hover:shadow-(--shadow-chip-hover) active:translate-y-0 active:shadow-(--shadow-chip-press)',
        animate && 'animate-follow-up-in',
      )}
    >
      <div className={clsx('grid gap-3 p-3', columns(cars.length))}>
        {cars.map((car) => (
          <div key={car.id} className="min-w-0">
            <div className="aspect-3/2 rounded-lg overflow-hidden bg-cloud">
              {/* About the widest a tile renders at, in a 500px card */}
              <Image
                alt=""
                src={`/images/${car.heroImageName}.jpg`}
                width={240}
                height={160}
                className="w-full h-full object-cover block"
              />
            </div>
            <div className="mt-2 text-sm font-semibold leading-[1.3]">
              {carName(car, cars)}
            </div>
            <div className="mt-0.5 text-fine font-medium text-stone">
              {addDecimalSeparators(car.priceWithGrant)} kr.
              {car.hasGrant && <span className="text-clay"> með styrk</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 border-t border-line py-3 text-sm font-semibold">
        Bera þá saman
        <span
          aria-hidden
          className="text-stone transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </div>
    </Link>
  </div>
)

/** A link from an answer to the comparison of the cars it recommends */
const CompareAnswerCars: React.FunctionComponent<Props> = ({
  cars,
  animate,
  featured,
}) =>
  featured ? (
    <FeaturedComparison cars={cars} animate={animate} />
  ) : (
    <div className="px-5 mb-4">
      <Link
        href={comparisonPathOf(cars)}
        onClick={openFrom(cars)}
        className={clsx(
          'group flex items-center gap-3 w-full max-w-[500px] py-2.5 pl-2.5 pr-4 rounded-card border border-line bg-tile no-underline text-inherit transition duration-200 hover:bg-tile-hover hover:-translate-y-0.5 hover:shadow-(--shadow-chip-hover) active:translate-y-0 active:shadow-(--shadow-chip-press)',
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
              className="w-12 h-8 rounded-lg object-cover ring-2 ring-tile transition-shadow duration-200 group-hover:ring-tile-hover"
            />
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Bera þá saman</div>
          <div className="text-xs font-medium text-stone truncate">
            {listNames(cars.map((car) => carName(car, cars)))}
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
