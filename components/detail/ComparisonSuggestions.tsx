import type { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { addReason } from '@/modules/detail/addReason'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import PlusIcon from '@/components/PlusIcon'
import ExtendComparisonLink from './ExtendComparisonLink'

interface Props {
  cars: ReadonlyArray<Car>
  slugs: ReadonlyArray<string>
  suggested: ReadonlyArray<Car>
  className?: string
}

/**
 * The cars nearest those compared, under the figures, where someone not yet
 * convinced by them looks for another: each one tap from a column of its own
 */
const ComparisonSuggestions: FunctionComponent<Props> = ({
  cars,
  slugs,
  suggested,
  className,
}) => (
  <section aria-labelledby="add-to-comparison" className={className}>
    <h2
      id="add-to-comparison"
      className="m-0 text-xl font-semibold leading-tight md:text-2xl"
    >
      Bæta bíl við samanburðinn
    </h2>
    <p className="mt-1 mb-0 text-sm text-stone">
      Þeir sem standa næst þessum í verði, drægni og sætum
    </p>

    <ul className="mt-4 mb-0 p-0 list-none grid gap-2 md:grid-cols-3 md:gap-3">
      {suggested.map((car, position) => {
        const reason = addReason(car, cars)
        return (
          <li key={car.id} className="min-w-0">
            <ExtendComparisonLink
              slugs={slugs}
              car={carSlug(car)}
              position={position}
              className={clsx(
                'group flex items-center gap-3 h-full p-2 pr-3 rounded-card no-underline text-tint bg-cloud',
                'transition duration-100 hover:bg-smoke active:scale-98 active:duration-75',
              )}
            >
              {/* The size the box renders at, so the pair lands on 192 */}
              <Image
                alt=""
                src={`/images/${car.heroImageName}.jpg`}
                width={96}
                height={64}
                className="w-24 h-16 shrink-0 object-cover rounded-xl block"
              />
              <div className="min-w-0 grow">
                <div className="text-sm font-semibold leading-snug truncate">
                  {car.make} <span className="font-normal">{car.model}</span>
                </div>
                {car.subModel && (
                  <div className="text-xs font-medium text-stone truncate">
                    {car.subModel}
                  </div>
                )}
                <div className="mt-1 text-sm">
                  {addDecimalSeparators(car.priceWithGrant)} kr.
                </div>
                {reason && (
                  <div className="text-xs font-medium text-stone">{reason}</div>
                )}
              </div>
              <span
                aria-hidden
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-tint text-lab"
              >
                <PlusIcon size={10} />
              </span>
              <span className="sr-only">, bæta við samanburðinn</span>
            </ExtendComparisonLink>
          </li>
        )
      })}
    </ul>
  </section>
)

export default ComparisonSuggestions
