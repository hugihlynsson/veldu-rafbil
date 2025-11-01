import { FunctionComponent } from 'react'
import Image from 'next/image'

import { NewCar as NewCarType } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import { colors } from '../modules/globals'
import getPriceWithGrant from '../modules/getPriceWithGrant'

interface Props {
  car: NewCarType
  onClose?: () => void
}

const MiniCar: FunctionComponent<Props> = ({ car, onClose }) => {
  const priceWithGrant = getPriceWithGrant(car.price)
  let hasGrant = priceWithGrant != car.price

  // Create the same ID as used in NewCar component
  const carId = `car-${car.make}-${car.model}-${car.subModel || 'base'}`
    .toLowerCase()
    .replace(/\s+/g, '-')

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Close the chat modal
    if (onClose) {
      onClose()
    }

    // Wait for modal to start closing, then scroll
    setTimeout(() => {
      const carElement = document.getElementById(carId)
      if (carElement) {
        setTimeout(() => {  
        carElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 150)
      }
    }, 100)
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      className="mini-car"
    >
      <div className="image-container">
        <Image
          alt={`${car.make} ${car.model}`}
          src={`/images/${car.heroImageName}.jpg`}
          width={400}
          height={267}
          className="image"
        />
      </div>
      <div className="info">
        <div className="name">
          <span className="make">{car.make}</span>{' '}
          <span className="model">{car.model}</span>
          {car.subModel && <span className="subModel"> {car.subModel}</span>}
        </div>
        <div className="price">
          {addDecimalSeprators(priceWithGrant)} kr.
          {hasGrant && <span className="grant"> með styrk</span>}
        </div>
        <div className="specs">
          {car.range} km • {car.acceleration.toFixed(1)}s • {car.drive}
        </div>
      </div>

      <style jsx>{`
        .mini-car {
          display: flex;
          flex-direction: row;
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          max-width: 100%;
        }
        .mini-car:hover {
          border-color: ${colors.smoke};
          background: white;
        }

        .image-container {
          position: relative;
          width: 120px;
          min-width: 120px;
          height: 100%;
          background: ${colors.cloud};
          flex-shrink: 0;
        }

        .image-container :global(.image) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .info {
          padding: 10px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 1px solid ${colors.cloud};
          border-left: none;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .name {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 3px;
          line-height: 1.3;
        }
        .model {
          font-weight: 400;
        }
        .subModel {
          font-weight: 500;
          font-size: 12px;
          color: ${colors.stone};
        }

        .price {
          font-size: 13px;
          font-weight: 600;
          color: ${colors.tint};
          margin-bottom: 3px;
        }
        .grant {
          font-size: 11px;
          font-weight: 500;
          color: ${colors.clay};
        }

        .specs {
          font-size: 11px;
          color: ${colors.stone};
          font-weight: 500;
        }
      `}</style>
    </a>
  )
}

export default MiniCar
