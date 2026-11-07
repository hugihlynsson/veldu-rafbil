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
      className="flex flex-row w-full p-0 border border-line bg-tile cursor-pointer text-left rounded-card overflow-hidden no-underline text-inherit transition duration-200 max-w-full hover:bg-tile-hover hover:-translate-y-0.5 hover:shadow-(--shadow-chip-hover) active:translate-y-0 active:shadow-(--shadow-chip-press)"
    >
      <div className="relative w-30 h-20 bg-cloud shrink-0">
        {/* The size the box really renders at, so the 1x/2x pair lands on
            128 and 256 rather than the hero's 540 and 1080. The height is
            pinned with the text's rather than stretched to it, as a photo
            drawn taller than its prop is one Next warns about */}
        <Image
          alt={`${car.make} ${car.model}`}
          src={`/images/${car.heroImageName}.jpg`}
          width={120}
          height={80}
          className="w-full h-full object-cover block"
        />
      </div>
      <div className="h-20 py-2.5 pl-3 pr-4 flex-1 flex flex-col justify-center">
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
