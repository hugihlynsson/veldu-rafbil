import type { FunctionComponent } from 'react'
import { trackEvent } from 'fathom-client'

import type { Car } from '@/modules/data/cars'
import { similarTo } from '@/modules/detail/similar'
import PlusIcon from '@/components/PlusIcon'
import SuggestionPills from '@/components/SuggestionPills'

interface Props {
  car: Car | undefined
  onAdd: (car: Car) => void
}

// Fewer than the car's page offers: on a phone each pill hides a row of the
// list someone may be picking their own second car from
const SUGGESTED_COUNT = 2

/**
 * The cars the one in the tray is most often weighed against, above it, so the
 * second car is a tap away
 */
const CompareSuggestions: FunctionComponent<Props> = ({ car, onAdd }) => {
  const suggested = car ? similarTo(car).slice(0, SUGGESTED_COUNT) : []

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
