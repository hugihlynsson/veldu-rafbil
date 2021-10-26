import { FunctionComponent } from 'react'

import { ProcessedUsedCar } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import estimateWLTP from '../modules/estimateWLTP'

interface Props {
  car: ProcessedUsedCar
}

const UsedCar: FunctionComponent<Props> = ({ car }) => (
  <article>
    <div className="imageBox">
      <div className="imageSizer" />
      <img alt="" src={car.image} />
    </div>

    <div className="content">
      {car.metadata?.make ? (
        <h1>
          <span className="make">{car.metadata.make}</span>{' '}
          <span className="model">{car.metadata.model}</span>
        </h1>
      ) : (
        <h1>
          <span className="make title--capitalize">
            {car.make.toLowerCase()}
          </span>{' '}
          <span className="model title--capitalize">
            {car.model.toLowerCase()}
          </span>
        </h1>
      )}

      <a className="price" target="_blank" rel="noopener" href={car.link}>
        {car.price
          ? `${addDecimalSeprators(car.price)} kr.`
          : 'Ekkert skráð verð'}
      </a>

      <div className="info">
        <div className="info-item">
          <div className="info-item-label">0-100 km/klst</div>
          <div className="info-item-value">
            {car.metadata?.acceleration?.toFixed(1) ?? '—'}s
          </div>
        </div>

        <div className="info-item" style={{ flexShrink: 0 }}>
          <div className="info-item-label">Rafhlaða</div>
          <div className="info-item-value">
            {car.metadata?.capacity ?? '—'} kWh
          </div>
        </div>

        <div className="info-item" title="Samkvæmt WLTP prófunum">
          <div className="info-item-label">
            Drægni{car.metadata?.rangeNEDC && <strong>*</strong>}
          </div>
          <div className="info-item-value">
            {car.metadata
              ? car.metadata.range ??
                (car.metadata.rangeNEDC &&
                  estimateWLTP(car.metadata.rangeNEDC).toFixed(0)) ??
                '—'
              : '—'}{' '}
            km
          </div>
        </div>
      </div>

      <p className="extra">
        {[car.date.split('/')[1], car.milage, car.modelExtra?.toLowerCase()]
          .filter(Boolean)
          .join(' • ')}
      </p>

      {car.metadata?.evDatabaseURL && (
        <a
          className="more-info"
          target="_blank"
          href={car.metadata?.evDatabaseURL}
          rel="noopener"
        >
          Nánar á ev-database.org
        </a>
      )}
    </div>

    <style jsx>
      {`
        article {
        }

        .imageBox {
          display: block;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
          max-width: 480px;
          margin: 0 auto;
        }
        .imageSizer {
          width: 100%;
          padding-bottom: 66.667%;
        }
        img {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .content {
          padding: 12px 16px 8px;
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
        .title--capitalize {
          text-transform: capitalize;
        }

        .price {
          display: inline-block;
          color: inherit;
          margin-top: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 600;
          background-color: #EEE;
          border-radius: 100px;
          padding: 4px 12px;
          text-decoration: none;
          margin-left: -2px;
          transition: background-color 0.1s;
        }
        .price:hover {
          background-color: #8CF;
        }

        .info {
          display: flex;
          margin-bottom: 16px;
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
          margin-bottom: 2px;
          color: #555;
        }
        .info-item-label strong {
          color: #000;
        }
        .info-item-value {
          font-size: 24px;
          font-weight: 400;
        }

        .extra {
          color: #aaa;
          font-weight: 300;
          font-size: 14px;
          margin-bottom: 0;
        }

        .more-info {
          display: inline-block;
          color: inherit;
          font-size: 14px;
          color: #aaa;
        }

        @media screen and (min-width: 480px) {
          img {
            border-radius: 2px;
          }
          .content {
            padding-top: 20px;
            padding-bottom: 24px;
          }
        }

        @media screen and (min-width: 820px) {
          .info-item {
            margin-right: 16px;
          }
        }
      `}
    </style>
  </article>
)

export default UsedCar
