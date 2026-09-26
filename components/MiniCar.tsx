import { FunctionComponent } from 'react'
import Image from 'next/image'

import { Car } from '@/modules/cars'
import addDecimalSeprators from '@/modules/addDecimalSeparators'
import prefersReducedMotion from '@/utils/prefersReducedMotion'

interface Props {
  car: Car
  /** Before the scroll: whatever closes the chat and puts the car on the list */
  onSelect?: () => void
}

const MiniCar: FunctionComponent<Props> = ({ car, onSelect }) => {
  const { id: carId, priceWithGrant } = car
  const hasGrant = priceWithGrant !== car.price

  const handleClick = () => {
    onSelect?.()

    setTimeout(() => {
      const carElement = document.getElementById(carId)
      if (carElement) {
        setTimeout(() => {
          carElement.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'center',
          })
          // Without this the reader is scrolled somewhere their focus is not
          carElement.focus({ preventScroll: true })
        }, 150)
      }
    }, 100)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex flex-row w-full p-0 border-0 bg-transparent cursor-pointer text-left rounded-[14px] overflow-hidden no-underline text-inherit transition-all duration-200 max-w-full hover:border-line-strong hover:bg-raised"
    >
      <div className="relative w-[120px] min-w-[120px] h-full bg-cloud shrink-0">
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
      <div className="py-[10px] px-3 flex-1 flex flex-col justify-center border border-line border-l-0 rounded-tr-[14px] rounded-br-[14px]">
        <div className="text-sm font-semibold mb-[3px] leading-[1.3]">
          <span>{car.make}</span>{' '}
          <span className="font-normal">{car.model}</span>
          {car.subModel && (
            <span className="font-medium text-xs text-stone">
              {' '}
              {car.subModel}
            </span>
          )}
        </div>
        <div className="text-[13px] font-semibold text-tint mb-[3px]">
          {addDecimalSeprators(priceWithGrant)} kr.
          {hasGrant && (
            <span className="text-[11px] font-medium text-clay">
              {' '}
              með styrk
            </span>
          )}
        </div>
        <div className="text-[11px] text-stone font-medium">
          {car.range} km • {car.acceleration.toFixed(1)}s • {car.drive}
        </div>
      </div>
    </button>
  )
}

export default MiniCar
