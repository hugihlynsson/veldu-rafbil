import React, { FunctionComponent, CSSProperties } from 'react'
import Link from 'next/link'

import { UsedCarModel } from '../types'
import estimateWLTP from '../modules/estimateWLTP'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import selectCarImageSize from '../modules/selectCarImageSize'
import { isNumber } from 'util'

const getImageSize = (total: number): CSSProperties => {
  switch (total) {
    case 0:
      return {}
    case 1:
    case 3:
    case 2:
      return { width: '100%', height: '100%' }
    case 4:
    case 5:
      return { width: '50%', height: '50%' }
    case 6:
    case 7:
      return { width: '33.33333%', height: '50%' }
    case 8:
      return { width: '25%', height: '50%' }
    default:
      return { width: '33.3333%', height: '33.3333%' }
  }
}

const getRange = (years: Array<number>): string => {
  const validYears = years.filter(Boolean)
  if (validYears.length === 0) {
    return ''
  }

  const highest = validYears.reduce((highest, current) =>
    current > highest ? current : highest,
  )

  const lowest = validYears.reduce((lowest, current) =>
    current < lowest ? current : lowest,
  )

  if (isNumber(lowest) && lowest === highest) {
    return highest.toString()
  }

  return `${lowest} - ${highest}`
}

const getExtraCount = (n: number): number => {
  if (n > 9) {
    return n - 8
  }

  switch (n) {
    case 2:
      return 2
    case 3:
      return 3
    case 5:
      return 2
    case 6:
      return 0
    case 7:
      return 2
    default:
      return 0
  }
}

export interface Props {
  count: number
  images: Array<string>
  lowestPrice?: number
  model: UsedCarModel
  years: Array<number>
}

const UsedCarModelCars: FunctionComponent<Props> = ({
  count,
  images,
  lowestPrice,
  model,
  years,
}) => (
  <article>
    <Link href="/notadir/[id]" as={`/notadir/${model.id}`}>
      <a>
        <div className="images">
          <div className="imagesContainer">
            {images
              .filter((_, n) => n < 9)
              .map((src) => (
                <div
                  key={src}
                  className="imageGridItem"
                  style={getImageSize(images.length)}
                >
                  <img
                    src={selectCarImageSize(
                      src,
                      images.length === 1 ? 'medium' : 'small',
                    )}
                    alt=""
                  />
                </div>
              ))}
            {getExtraCount(images.length) + count - images.length > 0 && (
              <div className="imagesMore" style={getImageSize(images.length)}>
                <span>
                  +{getExtraCount(images.length) + count - images.length}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="content">
          <h1 className="title">
            {model.make} <span className="title--model">{model.model}</span>
          </h1>

          <p className="years">{getRange(years)}</p>

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
            <strong>
              {count} {count === 1 ? 'bíll' : 'bílar'}
            </strong>{' '}
            til sölu
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
        box-shadow: 0 2px 32px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: box-shadow 0.2s;
      }
      a:hover {
        box-shadow: 0 2px 48px rgba(0, 0, 0, 0.16);
      }

      .images {
        width: 100%;
        padding-bottom: 66.6667%;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid #f0f0f0;
      }

      .imagesContainer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .imageGridItem {
        float: left;
      }

      .imagesContainer img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .imagesMore {
        position: absolute;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .imagesMore span {
        color: rgba(255, 255, 255, 0.8);
        font-weight: 600;
        font-size: 20px;
      }

      .content {
        padding: 24px;
      }

      .title {
        margin: 0 0 2px;
        font-weight: 600;
        font-size: 32px;
      }
      .title--model {
        font-weight: 400;
      }

      .years {
        font-size: 14px;
        color: #bbb;
        font-weight: 500;
        margin: 0 0 20px;
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
