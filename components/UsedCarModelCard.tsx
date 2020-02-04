import React, { FunctionComponent } from 'react'
import Link from 'next/link'

import { UsedCarModel } from '../types'
import estimateWLTP from '../modules/estimateWLTP'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import selectCarImageSize from '../modules/selectCarImageSize'

export interface Props {
  count: number
  images: Array<string>
  lowestPrice?: number
  model: UsedCarModel
}

const UsedCarModelCars: FunctionComponent<Props> = ({
  count,
  images,
  lowestPrice,
  model,
}) => (
  <article>
    <Link href="/notadir/[id]" as={`/notadir/${model.id}`}>
      <a>
        <div className="images">
          {images[0] && (
            <img src={selectCarImageSize(images[0], 'medium')} alt="" />
          )}
        </div>

        <div className="content">
          <h1 className="title">
            {model.make} <span className="title--model">{model.model}</span>
          </h1>

          <div className="info">
            <div className="info-item">
              <div className="info-item-label">0-100 km/klst</div>
              <div className="info-item-value">
                {model.acceleration?.toFixed(1) ?? '— '}s
              </div>
            </div>

            <div className="info-item" style={{ flexShrink: 0 }}>
              <div className="info-item-label">Rafhlaða</div>
              <div className="info-item-value">{model.capacity ?? '—'} kWh</div>
            </div>

            <div className="info-item" title="Samkvæmt WLTP prófunum">
              <div className="info-item-label">
                Drægni{model.rangeNEDC && <strong>*</strong>}
              </div>
              <div className="info-item-value">
                {model.range ??
                  (model.rangeNEDC && estimateWLTP(model.rangeNEDC)) ??
                  '—'}{' '}
                km
              </div>
            </div>
          </div>

          <p>
            <strong>{count} bílar</strong> til sölu
            {lowestPrice && (
              <strong> frá {addDecimalSeprators(lowestPrice)} kr.</strong>
            )}
          </p>
        </div>
      </a>
    </Link>

    <style jsx>{`
      a {
        display: block;
        color: inherit;
        text-decoration: none;
        border-radius: 16px;
        box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .images {
        width: 100%;
        padding-bottom: 66.6667%;
        overflow: hidden;
        position: relative;
      }

      img {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        height: auto;
        object-fit: cover;
      }

      .content {
        padding: 24px;
      }

      .title {
        margin: 0 0 0.6em;
        font-weight: 600;
        font-size: 32px;
      }
      .title--model {
        font-weight: 400;
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

      p {
        margin-bottom: 0;
        margin-top: 1.5em;
      }
      p strong {
        font-weight: 600;
      }
    `}</style>
  </article>
)

export default UsedCarModelCars
