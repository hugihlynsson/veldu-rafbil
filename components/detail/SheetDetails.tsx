'use client'

import type { FunctionComponent } from 'react'
import { useState } from 'react'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { similarTo } from '@/modules/detail/similar'
import type { SheetStep } from '@/modules/detail/sheetStep'
import { useCarHistory, useCarReview } from '@/utils/carFiles'
import CarDetails, { type CarDetailsProps } from './CarDetails'

interface Props extends CarDetailsProps {
  step?: SheetStep | null
}

/** The name that labels the sheet the car is shown in */
export const SHEET_TITLE_ID = 'car-sheet-title'

const arrivals = {
  previous: 'animate-step-previous',
  next: 'animate-step-next',
} as const

const departures = {
  previous: 'animate-step-previous-out',
  next: 'animate-step-next-out',
} as const

interface Departing {
  car: Car
  step: SheetStep
}

/**
 * What is under the sheet's photo, which slides out the way it was stepped
 * past as the next car's slides in. The last car's goes over the new one for
 * as long as it leaves, out of the way of a click, a key and a screen reader.
 */
const SheetDetails: FunctionComponent<Props> = ({ step, ...current }) => {
  const { car } = current
  const [shown, setShown] = useState(car)
  // Taken as the car changes rather than read from the step, which the sheet
  // sets a render or more before the address moves, and on the last car would
  // hide it through the arrival's delay
  const [arrival, setArrival] = useState<SheetStep | null>(null)
  const [departing, setDeparting] = useState<ReadonlyArray<Departing>>([])

  if (shown.id !== car.id) {
    setShown(car)
    setArrival(step ?? null)
    // Back to one still on its way out, which comes in again as itself
    const others = departing.filter((layer) => layer.car.id !== car.id)
    setDeparting(step ? [...others, { car: shown, step }] : others)
  }

  return (
    <div className="relative">
      {/* Keyed, so a step starts its slide over, and what is in it starts
          afresh with each car */}
      <CarDetails
        key={car.id}
        {...current}
        titleId={SHEET_TITLE_ID}
        className={arrival ? arrivals[arrival] : undefined}
      />
      {/* After the car shown, so its section ids, which they share for the
          moment one leaves, label the car shown's. Clipped, so a longer page
          leaving does not lengthen the sheet's scroll. */}
      {departing.length > 0 && (
        <div
          aria-hidden
          inert
          className="absolute inset-0 overflow-clip pointer-events-none"
        >
          {departing.map((layer) => (
            <DepartingDetails
              key={layer.car.id}
              {...layer}
              onDone={() =>
                setDeparting((all) => all.filter((other) => other !== layer))
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface DepartingProps extends Departing {
  onDone: () => void
}

// Its review and history as it showed them, which were fetched for it already
const DepartingDetails: FunctionComponent<DepartingProps> = ({
  car,
  step,
  onDone,
}) => {
  const review = useCarReview(carSlug(car))
  const history = useCarHistory(carSlug(car))
  return (
    <div
      className={`absolute inset-x-0 top-0 ${departures[step]}`}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onDone()
      }}
    >
      <CarDetails
        car={car}
        similar={similarTo(car)}
        review={review ?? undefined}
        history={history}
      />
    </div>
  )
}

export default SheetDetails
