import { FunctionComponent } from 'react'
import LazyLoad from 'react-lazy-load'

declare let gtag: Function

import { NewCar as NewCarType } from '../types'

// number.toLocaleString() can be inconsistent between node and client, breaking SSR
const addDecimalSeprators = (value: number): string =>
  value
    .toString()
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)!
    .join('.')
    .split('')
    .reverse()
    .join('')

const getSrcSet = (name: string) =>
  `/images/${name}-540w.jpg 540w, /images/${name}-1080w.jpg 1080w, /images/${name}-1920w.jpg 1920w`

interface Props {
  car: NewCarType
  lazyLoad: boolean
}

const NewCar: FunctionComponent<Props> = ({ car, lazyLoad }) => (
  <article>
    <div className="imageBox">
      <div className="imageSizer" />
      {lazyLoad ? (
        <LazyLoad offset={1000} debounce={false}>
          <img
            alt=""
            sizes="(max-width: 767px) 100wv, (max-width: 1023px) 40wv, 540px"
            srcSet={getSrcSet(car.heroImageName)}
            src={`/images/${car.heroImageName}-1080w.jpg`}
          />
        </LazyLoad>
      ) : (
        <img
          alt=""
          sizes="(max-width: 767px) 100wv, (max-width: 1023px) 40wv, 540px"
          srcSet={getSrcSet(car.heroImageName)}
          src={`/images/${car.heroImageName}-1080w.jpg`}
        />
      )}
    </div>

    <div className="content">
      <h1>
        <span className="make">{car.make}</span>{' '}
        <span className="model">{car.model}</span>
      </h1>
      <a
        className="price"
        target="_blank"
        rel="noopener"
        href={car.sellerURL}
        onClick={() =>
          gtag('event', 'click', {
            event_category: 'seller',
            event_label: `${car.make} ${car.model}`,
          })
        }
      >
        {addDecimalSeprators(car.price)} kr.
      </a>
      <div className="info">
        <div className="info-item">
          <div className="info-item-label">0-100 km/klst</div>
          <div className="info-item-value">{car.acceleration.toFixed(1)}s</div>
        </div>

        <div className="info-item" style={{ flexShrink: 0 }}>
          <div className="info-item-label">Rafhlaða</div>
          <div className="info-item-value">{car.capacity} kWh</div>
        </div>

        <div className="info-item" title="Samkvæmt WLTP prófunum">
          <div className="info-item-label">Drægni</div>
          <div className="info-item-value">{car.range} km</div>
        </div>
      </div>
      <a
        className="more-info"
        target="_blank"
        href={car.evDatabaseURL}
        rel="noopener"
        onClick={() =>
          gtag('event', 'click', {
            event_category: 'EV Database',
            event_label: `${car.make} ${car.model}`,
          })
        }
      >
        Nánar á ev-database.org
      </a>
    </div>

    <style jsx>
      {`
        article {
          margin-bottom: 32px;
        }

        .imageBox {
          display: block;
          position: relative;
        }
        .imageSizer {
          width: 100%;
          padding-bottom: 66.667%;
        }
        img {
          position: absolute;
          top: 0;
          width: 100%;
          height: auto;
        }

        .content {
          padding: 10px 16px 16px;
          margin 0 auto;
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
        .info-item-value {
          font-size: 24px;
          font-weight: 400;
        }

        .more-info {
          display: inline-block;
          color: inherit;
          font-size: 14px;
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
            width: 40%;
            flex-grow: 1;
            align-self: center;
          }

          img {
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
