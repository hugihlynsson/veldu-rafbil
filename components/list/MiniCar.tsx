import { FunctionComponent } from 'react'
import Image from 'next/image'

import { Car } from '@/modules/data/cars'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'

interface Props {
  car: Car
  onSelect: () => void
}

const MiniCar: FunctionComponent<Props> = ({ car, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-row w-full p-0 border-0 bg-transparent cursor-pointer text-left rounded-card overflow-hidden no-underline text-inherit transition-colors duration-200 max-w-full hover:bg-cloud"
    >
      <div className="relative w-30 min-w-30 bg-cloud shrink-0">
        {/* The size the box really renders at, so the 1x/2x pair lands on
            128 and 256 rather than the hero's 540 and 1080 */}
        <Image
          alt={`${car.make} ${car.model}`}
          src={`/images/${car.heroImageName}.jpg`}
          width={120}
          height={80}
          className="w-full h-full object-cover block"
        />
      </div>
      <div className="py-2.5 px-3 flex-1 flex flex-col justify-center border border-line border-l-0 rounded-r-card">
        <div className="text-sm font-semibold mb-0.75 leading-[1.3]">
          <span>{car.make}</span>{' '}
          <span className="font-normal">{car.model}</span>
          {car.subModel && (
            <span className="font-medium text-xs text-stone">
              {' '}
              {car.subModel}
            </span>
          )}
        </div>
        <div className="text-control font-semibold text-tint mb-0.75">
          {addDecimalSeparators(car.priceWithGrant)} kr.
          {car.hasGrant && (
            <span className="text-fine font-medium text-clay"> með styrk</span>
          )}
        </div>
        <div className="text-fine text-stone font-medium">
          {car.range} km • {car.acceleration.toFixed(1)}s • {car.drive}
        </div>
      </div>
    </button>
  )
}

export default MiniCar
