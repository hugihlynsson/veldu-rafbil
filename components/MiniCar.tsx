import { FunctionComponent } from 'react'
import Image from 'next/image'

import { NewCar as NewCarType } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import getPriceWithGrant from '../modules/getPriceWithGrant'
import getCarId from '../modules/getCarId'
import prefersReducedMotion from '../utils/prefersReducedMotion'

interface Props {
  car: NewCarType
  onClose?: () => void
}

const MiniCar: FunctionComponent<Props> = ({ car, onClose }) => {
  const priceWithGrant = getPriceWithGrant(car.price)
  const hasGrant = priceWithGrant !== car.price

  const carId = getCarId(car)

  const handleClick = () => {
    if (onClose) {
      onClose()
    }

    // Wait for modal to start closing, then scroll
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
      className="flex flex-row w-full p-0 border-0 bg-transparent cursor-pointer text-left rounded-[14px] overflow-hidden no-underline text-inherit transition-all duration-200 max-w-full hover:border-smoke hover:bg-white"
    >
      <div className="relative w-[120px] min-w-[120px] h-full bg-cloud shrink-0">
        <Image
          alt={`${car.make} ${car.model}`}
          src={`/images/${car.heroImageName}.jpg`}
          width={400}
          height={267}
          className="w-full h-full object-cover block"
        />
      </div>
      <div className="py-[10px] px-3 flex-1 flex flex-col justify-center border border-cloud border-l-0 rounded-tr-[14px] rounded-br-[14px]">
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
