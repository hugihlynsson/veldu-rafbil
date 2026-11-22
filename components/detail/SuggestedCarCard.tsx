import type { FunctionComponent, ReactNode } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import type { TrackedEvent } from '@/modules/analytics/events'
import { carPathOf } from '@/modules/detail/paths'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { photoZoomFromMd } from '@/components/photoZoom'
import TrackedLink from './TrackedLink'

/** The list the cards go in: rows on a phone, three across from md */
export const suggestedCarList =
  'mt-3 -mx-0.5 mb-0 p-0 list-none grid gap-3 md:mx-0 md:grid-cols-3'

interface Props {
  car: Car
  /** Why it is offered, in place of its price and range */
  reason?: string
  action: {
    href: string
    label: string
    /** Its words from md up, where they fit beside nothing */
    text: string
    /** In the words' place on a phone, where they would squeeze the name */
    icon: ReactNode
    /** Before the words too from md, as the comparison's pluses are */
    iconWithText?: boolean
    tracked?: { event: TrackedEvent; fathomEvent: string }
  }
}

const actionClassName =
  'relative z-1 shrink-0 self-center mr-3 inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full border border-line-chip bg-lab text-tint no-underline transition duration-100 hover:bg-cloud active:scale-93 active:duration-75 md:self-start md:w-auto md:h-auto md:mx-1 md:py-1'

/**
 * A car offered beside the ones on the page, sized for the review's measure.
 * The whole card opens the car's page; the button over it does the action.
 */
const SuggestedCarCard: FunctionComponent<Props> = ({
  car,
  reason,
  action,
}) => {
  const actionClasses = clsx(
    actionClassName,
    // The icon's side a touch tighter, as its box is emptier than a letter's
    action.iconWithText ? 'md:gap-1.5 md:pl-2.5 md:pr-3' : 'md:px-3',
  )
  const actionContent = (
    <>
      <span className={clsx('flex', !action.iconWithText && 'md:hidden')}>
        {action.icon}
      </span>
      <span className="hidden md:inline">{action.text}</span>
    </>
  )

  return (
    <li className="group relative flex items-center gap-3 rounded-card overflow-hidden transition-colors duration-200 hover:bg-shade md:flex-col md:items-stretch md:overflow-visible md:hover:bg-transparent">
      {/* Beside the name, flush to the card with its border drawn over it.
          Above the name it needs no border, and the card's larger corner
          would clip the photo's own */}
      <div className="w-32 aspect-[3/2] shrink-0 self-stretch overflow-hidden md:w-full md:rounded-lg">
        <Image
          alt=""
          sizes="(max-width: 767px) 128px, 210px"
          src={`/images/${car.heroImageName}.jpg`}
          width={128}
          height={85}
          // Still while the action, the li's only direct link, is hovered,
          // as that does not open the car
          className={clsx(
            'w-full h-full object-cover md:group-has-[>a:hover]:scale-100',
            photoZoomFromMd,
          )}
        />
      </div>
      <div className="flex-1 min-w-0 py-2 text-balance md:p-0 md:px-1">
        <Link
          href={carPathOf(car)}
          className="text-base font-semibold leading-tight text-tint no-underline after:absolute after:inset-0 after:rounded-card after:border after:border-line md:after:border-0"
        >
          {car.make} <span className="font-normal">{car.model}</span>
        </Link>
        {reason ? (
          <div className="mt-1 text-sm font-medium text-stone text-pretty">
            {reason}
          </div>
        ) : (
          <div className="mt-1 text-sm font-medium text-stone">
            {/* On the narrowest phones it breaks between the two */}
            <span className="whitespace-nowrap">
              {addDecimalSeparators(car.priceWithGrant)} kr. ·
            </span>{' '}
            <span className="whitespace-nowrap">{car.range} km</span>
          </div>
        )}
      </div>
      {action.tracked ? (
        <TrackedLink
          href={action.href}
          aria-label={action.label}
          className={actionClasses}
          {...action.tracked}
        >
          {actionContent}
        </TrackedLink>
      ) : (
        <Link
          href={action.href}
          aria-label={action.label}
          className={actionClasses}
        >
          {actionContent}
        </Link>
      )}
    </li>
  )
}

export default SuggestedCarCard
