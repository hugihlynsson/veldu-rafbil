import type { FunctionComponent } from 'react'
import { trackEvent } from 'fathom-client'

import type { Car } from '@/modules/data/cars'
import { MAX_COMPARED } from '@/modules/detail/comparison'
import { closestToSelection, similarTo } from '@/modules/detail/similar'
import PlusIcon from '@/components/PlusIcon'
import SuggestionPills from '@/components/SuggestionPills'

interface Props {
  cars: ReadonlyArray<Car>
  onAdd: (car: Car) => void
}

// Fewer than the car's page offers: on a phone each pill hides a row of the
// list someone may be picking their own next car from
const SUGGESTED_COUNT = 2

const suggestionsFor = (cars: ReadonlyArray<Car>): Car[] => {
  if (cars.length === 0 || cars.length >= MAX_COMPARED) return []
  const [only] = cars
  return cars.length === 1 && only
    ? similarTo(only).slice(0, SUGGESTED_COUNT)
    : closestToSelection(cars, SUGGESTED_COUNT)
}

/**
 * The cars closest to those in the tray, above it, so the next one is a tap
 * away while there is room for it
 */
const CompareSuggestions: FunctionComponent<Props> = ({ cars, onAdd }) => {
  const suggested = suggestionsFor(cars)

  return (
    <SuggestionPills
      label="Bílar til að bera saman við"
      pills={suggested.map((other, index) => ({
        key: other.id,
        content: (
          <>
            <span className="inline-block align-[1px] mr-2 text-stone">
              <PlusIcon size={10} />
            </span>
            {other.make} <span className="font-normal">{other.model}</span>
          </>
        ),
        ariaLabel: `Bæta ${other.label} við samanburð`,
        onClick: () => {
          trackEvent('Compare suggestion added')
          onAdd(other)
        },
        // Top last, rising from the tray
        enterDelay: 0.3 + (suggested.length - 1 - index) * 0.06,
      }))}
    />
  )
}

export default CompareSuggestions
