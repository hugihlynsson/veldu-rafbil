import React, { FunctionComponent, CSSProperties } from 'react'
import Link from 'next/link'

import { UsedCarModel } from '../types'
import estimateWLTP from '../modules/estimateWLTP'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import selectCarImageSize from '../modules/selectCarImageSize'
import { isNumber } from 'util'

type ImageDisplay = 0 | 1 | 4 | 6 | 8 | 9

const getImagesToShow = (total: number): ImageDisplay => {
  switch (total) {
    case 0:
      return 0
    case 1:
    case 2:
    case 3:
      return 1
    case 4:
    case 5:
      return 4
    case 6:
    case 7:
      return 6
    case 8:
      return 8
    default:
      return 9
  }
}

const getImageSize = (total: number): CSSProperties => {
  switch (getImagesToShow(total)) {
    case 0:
      return {}
    case 1:
      return { width: '100%', height: '100%' }
    case 4:
      return { width: '50%', height: '50%' }
    case 6:
      return { width: '33.33333%', height: '50%' }
    case 8:
      return { width: '25%', height: '50%' }
    case 9:
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

const getExtraCount = (total: number, images: number): number =>
  total - getImagesToShow(images)

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
              .filter((_, n) => n < getImagesToShow(images.length))
              .map((src) => (
                <div
                  key={src}
                  className="imageGridItem"
                  style={getImageSize(images.length)}
                >
                  <img
                    src={selectCarImageSize(
                      src,
                      getImagesToShow(images.length) === 1 ? 'medium' : 'small',
                    )}
                    alt=""
                  />
                </div>
              ))}
            {getExtraCount(count, images.length) > 0 && (
              <div
                className="imagesMore"
                style={
                  getImagesToShow(images.length) === 1
                    ? {
                        bottom: '16px',
                        right: '20px',
                        borderRadius: '32px',
                        padding: '7px 16px 8px 14px',
                      }
                    : getImageSize(images.length)
                }
              >
                <span>
                  +{getExtraCount(count, images.length)}{' '}
                  {getExtraCount(count, images.length) === 1 ? 'bíll' : 'bílar'}
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
        box-shadow: 0 2px 32px rgba(0, 0, 0, 0.12);
        overflow: hidden;
        transition: all 0.2s;
      }
      a:hover {
        box-shadow: 0 2px 48px rgba(0, 0, 0, 0.16);
        transform: translateY(-8px);
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
        background: black;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
      }
      .imagesMore span {
        color: white;
        font-weight: 600;
        font-size: 20px;
      }

      .content {
        padding: 16px;
      }

      .title {
        margin: 0 0;
        font-weight: 600;
        font-size: 32px;
        line-height: 1.1;
      }
      .title--model {
        font-weight: 400;
      }

      .years {
        font-size: 14px;
        color: #888;
        font-weight: 500;
        margin: 3px 0 20px;
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
        font-size: 24px;
        font-weight: 400;
      }

      p {
        margin-bottom: 2px;
        margin-top: 1.5em;
      }
      p strong {
        font-weight: 600;
      }

      @media screen and (min-width: 480px) {
        a {
          box-shadow: 0 2px 32px rgba(0, 0, 0, 0.08);
        }
        .content {
          padding: 20px 24px;
        }
      }
    `}</style>
  </article>
)

export default UsedCarModelCars
