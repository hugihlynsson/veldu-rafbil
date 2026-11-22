import type { FunctionComponent } from 'react'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { addReason } from '@/modules/detail/addReason'
import { comparisonPath } from '@/modules/detail/paths'
import PlusIcon from '@/components/PlusIcon'
import SuggestedCarCard, { suggestedCarList } from './SuggestedCarCard'

interface Props {
  cars: ReadonlyArray<Car>
  slugs: ReadonlyArray<string>
  suggested: ReadonlyArray<Car>
  className?: string
}

/**
 * The cars nearest those compared, under the figures, where someone not yet
 * convinced by them looks for another. At the review's measure, as the
 * verdict is, so the cards are the car page's own.
 */
const ComparisonSuggestions: FunctionComponent<Props> = ({
  cars,
  slugs,
  suggested,
  className,
}) => (
  <section aria-labelledby="add-to-comparison" className={className}>
    <div className="max-w-prose">
      <h2 id="add-to-comparison" className="m-0 text-sm font-semibold">
        Bæta við samanburðinn:
      </h2>
      <ul className={suggestedCarList}>
        {suggested.map((car, position) => (
          <SuggestedCarCard
            key={car.id}
            car={car}
            reason={addReason(car, cars)}
            action={{
              href: comparisonPath([...slugs, carSlug(car)]),
              label: `Bæta ${car.label} við samanburðinn`,
              text: 'Bæta við',
              icon: <PlusIcon size={12} />,
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
