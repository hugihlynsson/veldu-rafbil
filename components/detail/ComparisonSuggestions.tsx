import type { FunctionComponent } from 'react'
import clsx from 'clsx'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { addReason } from '@/modules/detail/addReason'
import { comparisonLinkRel, comparisonPath } from '@/modules/detail/paths'
import PlusIcon from '@/components/PlusIcon'
import CompareMoreLink from './CompareMoreLink'
import SuggestedCarCard from './SuggestedCarCard'

interface Props {
  cars: ReadonlyArray<Car>
  slugs: ReadonlyArray<string>
  /** One a column of the comparison */
  suggested: ReadonlyArray<Car>
  /** The table's strip, so the cards line up under its columns */
  className?: string
  contentClassName?: string
  imageSizes: string
}

const columns: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
}

/**
 * The cars nearest those compared, as a row of candidates under the table:
 * rows of their own on a phone, where three columns scroll sideways, and in
 * the table's columns from md, each photo under the photo of its column
 */
const ComparisonSuggestions: FunctionComponent<Props> = ({
  cars,
  slugs,
  suggested,
  className,
  contentClassName,
  imageSizes,
}) => (
  <section aria-labelledby="add-to-comparison" className={className}>
    <div className={contentClassName}>
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="add-to-comparison"
          className="m-0 text-sm font-semibold text-balance"
        >
          Þú gætir líka haft áhuga á:
        </h2>
        <CompareMoreLink
          cars={cars}
          className="text-sm font-semibold text-tint no-underline hover:underline"
        >
          Finna fleiri á listanum <span aria-hidden>→</span>
        </CompareMoreLink>
      </div>
      {/* The photos' gaps, as their row above has them */}
      <ul
        className={clsx(
          'mt-3 -mx-0.5 mb-0 p-0 list-none grid gap-3 md:mx-0 md:gap-x-8',
          columns[suggested.length],
        )}
      >
        {suggested.map((car, position) => (
          <SuggestedCarCard
            key={car.id}
            car={car}
            sizes={imageSizes}
            // Reaching past its column as the photo above it does
            className="md:-mx-1"
            reason={addReason(car, cars)}
            action={{
              href: comparisonPath([...slugs, carSlug(car)]),
              rel: comparisonLinkRel([...slugs, car]),
              label: `Bæta ${car.label} við samanburðinn`,
              text: 'Bæta við',
              icon: <PlusIcon size={12} />,
              iconWithText: true,
              tracked: {
                event: {
                  name: 'comparison_extended',
                  cars: [...slugs],
                  car: carSlug(car),
                  position,
                },
                fathomEvent: 'Comparison extended',
              },
            }}
          />
        ))}
      </ul>
    </div>
  </section>
)

export default ComparisonSuggestions
