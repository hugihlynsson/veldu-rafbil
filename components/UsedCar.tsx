import { FunctionComponent } from 'react'

import { ProcessedUsedCar } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import estimateWLTP from '../modules/estimateWLTP'

interface Props {
  car: ProcessedUsedCar
}

const UsedCar: FunctionComponent<Props> = ({ car }) => (
  <article>
    <img src={car.image} />

    <div className="data">
      <h1 className="title">
        {car.metadata?.make ? (
          <>
            <span className="title-make">{car.metadata.make}</span>{' '}
            {car.metadata.model}
          </>
        ) : (
          <span className="title--capitalize">
            <span className="title-make">{car.make.toLowerCase()}</span>{' '}
            {car.model.toLowerCase()}
          </span>
        )}
      </h1>

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
            Drægni{car.metadata?.rangeNEDC && '*'}
          </div>
          <div className="info-item-value">
            {car.metadata
              ? car.metadata.range ??
                (car.metadata.rangeNEDC &&
                  estimateWLTP(car.metadata.rangeNEDC)) ??
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
          href={car.metadata.evDatabaseURL}
          rel="noopener"
        >
          Nánar um gerð á ev-database.org
        </a>
      )}
    </div>

    <style jsx>{`
      article {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text-decoration: none;
        color: inherit;
      }

      img {
        width: 200px;
        border-radius: 2px;
        object-fit: cover;
        margin-right: 24px;
        background-color: #f8f8f8;
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }

      .data {
        flex-grow: 1;
      }

      .title {
        font-size: 24px;
        color: #111;
        margin: 0;
        margin-bottom: 4px;
        font-weight: 400;
      }
      .title--capitalize {
        text-transform: capitalize;
      }
      .title-make {
        font-weight: 600;
      }

      .price {
        display: inline-block;
        color: inherit;
        margin-top: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: 600;
        background-color: #eee;
        border-radius: 100px;
        padding: 4px 12px;
        text-decoration: none;
        margin-left: -2px;
        transition: background-color 0.1s;
      }
      .price:hover {
        background-color: #8cf;
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
        color: #888;
      }
      .info-item-value {
        font-size: 20px;
        font-weight: 400;
      }

      .extra {
        color: #aaa;
        font-weight: 300;
        font-size: 14px;
        margin-bottom: 0;
      }
      .extra--model {
        text-transform: capitalize;
      }

      .more-info {
        display: inline-block;
        color: inherit;
        font-size: 14px;
        font-weight: 300;
        color: #aaa;
      }
    `}</style>
  </article>
)

export default UsedCar
