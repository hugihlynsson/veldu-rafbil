import { FunctionComponent } from 'react'
import { trackEvent } from 'fathom-client'
import Image from 'next/image'

import { NewCar as NewCarType, Drive } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import getKmPerMinutesCharged from '../modules/getKmPerMinutesCharged'
import { colors } from '../modules/globals'
import LinkPill from './LinkPill'

interface Props {
  car: NewCarType
  showValue?: boolean
  priority?: boolean
}

let getDriveLabel = (drive: Drive) => {
  switch (drive) {
    case 'AWD':
      return 'Fjórhjóladrif'
    case 'RWD':
      return 'Afturhjóladrif'
    case 'FWD':
      return 'Framhjóladrif'
  }
}

const NewCar: FunctionComponent<Props> = ({ car, showValue, priority }) => (
  <article>
    <div className="imageBox">
      <Image
        priority={priority}
        alt=""
        sizes="(max-width: 767px) 100wv, (max-width: 1023px) 40wv, 540px"
        src={`/images/${car.heroImageName}.jpg`}
        width={1920}
        height={1280}
        className="image"
      />
    </div>

    <div className="content">
      {car.expectedDelivery && (
        <div className="expectedDelivery">
          Væntanlegur {car.expectedDelivery.toLowerCase()}
        </div>
      )}

      <h1>
        <span className="make">{car.make}</span>{' '}
        <span className="model">{car.model}</span>
        <span className="subModel">{car.subModel}</span>
      </h1>

      <LinkPill
        href={car.sellerURL}
        external
        extra={
          (car.expectedDelivery && 'áætlað verð ↗') ||
          (showValue &&
            `${addDecimalSeprators(
              Math.round(car.price / car.range),
            )} kr. á km.`) ||
          undefined
        }
        onClick={() => trackEvent('Seller clicked')}
      >
        {addDecimalSeprators(car.price)} kr.
        {!car.expectedDelivery && ' ↗'}
      </LinkPill>

      <div className="info">
        <div className="info-item">
          <div className="info-item-label">0-100 km/klst</div>
          <div className="info-item-value">{car.acceleration.toFixed(1)}s</div>
          <div
            className="info-item-extra"
            title={`Afl (${Math.round(car.power * 1.34102) + ' hö'})`}
          >
            {car.power} kW
          </div>
        </div>

        <div className="info-item" style={{ flexShrink: 0 }}>
          <div className="info-item-label">Rafhlaða</div>
          <div className="info-item-value">{car.capacity} kWh</div>
          <div
            className="info-item-extra"
            title={`Meðaldrægniaukning á milli 10%-80% á hröðustu hleðslu (${car.timeToCharge10T080} min)`}
          >
            {getKmPerMinutesCharged(car.timeToCharge10T080, car.range)} km/min
          </div>
        </div>

        <div className="info-item" title="Samkvæmt WLTP prófunum">
          <div className="info-item-label">Drægni</div>
          <div className="info-item-value">{car.range} km</div>
          <div className="info-item-extra" title={getDriveLabel(car.drive)}>
            {car.drive}
          </div>
        </div>
      </div>
      {car.evDatabaseURL && (
        <a
          className="more-info"
          target="_blank"
          href={car.evDatabaseURL}
          rel="noopener"
          onClick={() => trackEvent('Ev Database Link Clicked')}
        >
          Nánar á ev-database.org ↗
        </a>
      )}
    </div>

    <style jsx>
      {`
        article {
          margin-bottom: 32px;
        }

        .content {
          padding: 10px 16px 16px;
          margin: 0 auto;
          max-width: 480px;
        }

        h1 {
          margin: 0;
          font-weight: 600;
          font-size: 32px;
        }
        .model {
          font-weight: 400;
        }
        .subModel {
          display: block;
          font-weight: 500;
          font-size: 16px;
          color: ${colors.stone};
          margin-top: -1px;
          margin-bottom: 8px;
        }

        .expectedDelivery {
          margin-bottom: 2px;
          font-size: 16px;
          font-weight: 500;
          color: ${colors.stone};
        }

        .info {
          display: flex;
          margin-bottom: 16px;
          margin-top: 24px;
          max-width: 320px;
          justify-content: space-between;
        }
        .info-item {
          margin-right: 8px;
          flex-basis: 33.33%;
        }
        .info-item:last-child {
          margin-right: 0;
        }
        .info-item-label {
          text-transform: uppercase;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 3px;
          color: ${colors.stone};
        }
        .info-item-value {
          font-size: 24px;
          font-weight: 400;
        }
        .info-item-extra {
          margin-top: 2px;
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .more-info {
          display: inline-block;
          font-size: 14px;
          color: ${colors.stone};
          text-decoration: none;
          font-weight: 500;
          transition: color 0.1s;
        }
        .more-info:hover {
          text-decoration: underline;
          color: ${colors.stone};
        }

        .imageBox :global(.image) {
          width: 100%;
          height: auto;
        }

        @media screen and (min-width: 375px) {
          .content {
            padding: 18px 24px 24px;
          }

          .info-item {
            margin-right: 16px;
          }
        }

        @media screen and (min-width: 768px) {
          article {
            display: flex;
            margin: 0 32px 40px 40px;
            align-items: center;
          }

          .imageBox {
            display: block;
            position: relative;
            width: 40%;
            flex-grow: 1;
            align-self: center;
          }

          .imageBox :global(.image) {
            border-radius: 2px;
          }

          .content {
            margin: 0 0 0 32px;
            padding: 0;
            width: 330px;
            max-width: 380px;
            flex-shrink: 0;
            flex-grow: 1;
          }
        }
      `}
    </style>
  </article>
)

export default NewCar
