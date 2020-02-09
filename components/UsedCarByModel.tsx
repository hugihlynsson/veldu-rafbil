import { FunctionComponent } from 'react'

import LinkPill from './LinkPill'
import { ProcessedUsedCar } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import selectCarImageSize from '../modules/selectCarImageSize'

interface Props {
  car: ProcessedUsedCar
}

const UsedCar: FunctionComponent<Props> = ({ car }) => (
  <article>
    <div className="imageBox">
      <div className="imageSizer" />
      {car.image && (
        <img alt="" src={selectCarImageSize(car.image, 'medium')} />
      )}
    </div>

    <div className="content">
      <LinkPill href={car.link} external>
        {car.price
          ? `${addDecimalSeprators(car.price)} kr.`
          : 'Ekkert skráð verð'}{' '}
        ↗
      </LinkPill>

      <div className="info">
        <div className="info-item">
          <div className="info-item-label">Árgerð</div>
          <div className="info-item-value">{car.date.split('/')[1] ?? '—'}</div>
        </div>

        <div className="info-item">
          <div className="info-item-label">Keyrsla</div>
          <div className="info-item-value">{car.milage}</div>
        </div>
      </div>
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
          margin 0 auto;
          max-width: 480px;
        }

        .info {
          display: flex;
          margin-bottom: 16px;
          margin-top: 16px;
          max-width: 320px;
          justify-content: space-between;
        }
        .info-item {
          margin-right: 8px;
          flex-basis: 50%;
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
