import { FunctionComponent } from 'react'

import { ProcessedUsedCar } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import selectCarImageSize from '../modules/selectCarImageSize'

interface Props {
  car: ProcessedUsedCar
}

const UsedCar: FunctionComponent<Props> = ({ car }) => (
  <a href={car.link} target="_blank" rel="noopener">
    <div className="sizer" />

    {car.image && <img alt="" src={selectCarImageSize(car.image, 'medium')} />}

    <div className="content">
      <div className="info">
        {car.date} 𐄁 {car.milage}
      </div>

      <div className="price">
        {car.price
          ? `${addDecimalSeprators(car.price)} kr.`
          : 'Ekkert skráð verð'}
      </div>

      <div className="description">{car.modelExtra || '—'}</div>
    </div>

    <style jsx>{`
      a {
        display: block;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 32px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
        border-radius: 16px;
        color: inherit;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      a:hover {
        transform: scale(1.03);
        box-shadow: 0 8px 48px rgba(0, 0, 0, 0.2);
      }

      .sizer {
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
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 48px 24px 24px;
        background: linear-gradient(transparent 0px, rgba(0, 0, 0, 0.4) 48px);
      }

      .info {
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        opacity: 0.8;
      }

      .price {
        color: #fff;
        font-size: 24px;
        margin-top: 2px;
        margin-bottom: 2px;
        font-weight: 500;
      }

      .description {
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        opacity: 0.8;
      }
    `}</style>
  </a>
)

export default UsedCar
