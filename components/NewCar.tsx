import { FunctionComponent } from 'react'
import { trackEvent } from 'fathom-client'
import Image from 'next/image'
import clsx from 'clsx'

import { NewCar as NewCarType, Drive, View } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import { formatKmPerMinutesCharged } from '../modules/getKmPerMinutesCharged'
import LinkPill from './LinkPill'
import getPriceWithGrant from '../modules/getPriceWithGrant'
import getCarId from '../modules/getCarId'

interface Props {
  car: NewCarType
  showValue?: boolean
  showSeats?: boolean
  preload?: boolean
  view?: View
}

const getDriveLabel = (drive: Drive) => {
  switch (drive) {
    case 'AWD':
      return 'Fjórhjóladrif'
    case 'RWD':
      return 'Afturhjóladrif'
    case 'FWD':
      return 'Framhjóladrif'
  }
}

// The column widths the grid in app/newCars.tsx actually resolves to. A wrong
// one is silent: the browser falls back to 100vw and fetches the widest photo.
const overviewSizes =
  '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, (max-width: 1919px) 25vw, 442px'

const listSizes = '(max-width: 767px) 100vw, (max-width: 1023px) 40vw, 540px'

const NewCar: FunctionComponent<Props> = ({
  car,
  showValue,
  showSeats,
  preload,
  view = 'list',
}) => {
  const isOverview = view === 'overview'
  const priceWithGrant = getPriceWithGrant(car.price)
  const hasGrant = priceWithGrant !== car.price

  const carId = getCarId(car)

  // Not agree(): sæti is neuter and reads the same at every count. A car
  // without a subModel gets the seat count on its own rather than a lone dot.
  const subTitle = [car.subModel, showSeats && `${car.seats} sæti`]
    .filter(Boolean)
    .join(' · ')

  return (
    <article
      id={carId}
      // MiniCar scrolls here from the chat, and moves focus with it
      tabIndex={-1}
      className={clsx(
        isOverview
          ? 'flex flex-col h-full'
          : 'mb-8 md:flex md:m-0 md:mx-8 md:mb-10 md:ml-10 md:items-center',
      )}
    >
      <div
        className={
          isOverview
            ? ''
            : 'md:block md:relative md:w-[40%] md:grow md:self-center'
        }
      >
        <Image
          preload={preload}
          alt=""
          sizes={isOverview ? overviewSizes : listSizes}
          src={`/images/${car.heroImageName}.jpg`}
          width={1920}
          height={1280}
          className={clsx(
            'w-full h-auto',
            isOverview ? 'rounded-lg' : 'md:rounded-sm',
          )}
        />
      </div>

      <div
        className={clsx(
          isOverview
            ? 'flex flex-col grow pt-3'
            : 'py-[10px] px-4 mx-auto max-w-[480px] xs:py-[18px] xs:px-6 md:m-0 md:ml-8 md:p-0 md:w-[330px] md:max-w-[380px] md:shrink-0 md:grow',
        )}
      >
        {car.expectedDelivery && (
          <div className="mb-0.5 text-base font-medium text-stone">
            Væntanlegur {car.expectedDelivery.toLowerCase()}
          </div>
        )}

        <h2
          className={clsx(
            'm-0 font-semibold',
            isOverview ? 'text-2xl' : 'text-[32px]',
          )}
        >
          <span>{car.make}</span>{' '}
          <span className="font-normal">{car.model}</span>
          <span
            className={clsx(
              'block font-medium text-stone -mt-px mb-2',
              isOverview ? 'text-sm' : 'text-base',
            )}
          >
            {subTitle}
          </span>
        </h2>

        <LinkPill
          href={car.sellerURL}
          external
          extra={
            (car.expectedDelivery && hasGrant && 'áætlað verð með styrk ↗') ||
            (car.expectedDelivery && 'áætlað verð ↗') ||
            (showValue &&
              `${hasGrant ? 'með styrk ' : ''}${addDecimalSeprators(
                Math.round(priceWithGrant / car.range),
              )} kr. á km.`) ||
            (hasGrant && 'með styrk') ||
            undefined
          }
          title={
            hasGrant
              ? `Fullt verð án styrks: ${addDecimalSeprators(car.price)} kr.`
              : undefined
          }
          onClick={() => trackEvent('Seller clicked')}
        >
          {addDecimalSeprators(priceWithGrant)} kr.
          {!car.expectedDelivery && ' ↗'}
        </LinkPill>

        <div
          className={clsx(
            'flex justify-between',
            isOverview ? 'mt-4 mb-3' : 'mt-6 mb-4 max-w-[320px]',
          )}
        >
          <div className="mr-2 xs:mr-4 basis-1/3">
            <div className="uppercase text-[10px] font-semibold tracking-wider mb-[3px] text-stone">
              0-100 km/klst
            </div>
            <div
              className={clsx(
                'font-normal',
                isOverview ? 'text-xl' : 'text-2xl',
              )}
            >
              {car.acceleration.toFixed(1)}s
            </div>
            <div
              className="mt-0.5 text-xs text-[#666] font-medium"
              title={`Afl (${Math.round(car.power * 1.34102)} hö)`}
            >
              {car.power} kW<span className="sr-only"> afl</span>
            </div>
          </div>

          <div className="mr-2 xs:mr-4 basis-1/3 shrink-0">
            <div className="uppercase text-[10px] font-semibold tracking-wider mb-[3px] text-stone">
              Rafhlaða
            </div>
            <div
              className={clsx(
                'font-normal',
                isOverview ? 'text-xl' : 'text-2xl',
              )}
            >
              {car.capacity} kWh
            </div>
            <div
              className="mt-0.5 text-xs text-[#666] font-medium"
              title={`Meðaldrægniaukning á milli 10%-80% á hröðustu hleðslu (${car.timeToCharge10T080} min)`}
            >
              {formatKmPerMinutesCharged(car.timeToCharge10T080, car.range)}{' '}
              km/min
              <span className="sr-only">
                {' '}
                meðaldrægniaukning á hröðustu hleðslu
              </span>
            </div>
          </div>

          <div className="mr-0 basis-1/3" title="Samkvæmt WLTP prófunum">
            <div className="uppercase text-[10px] font-semibold tracking-wider mb-[3px] text-stone">
              Drægni
            </div>
            <div
              className={clsx(
                'font-normal',
                isOverview ? 'text-xl' : 'text-2xl',
              )}
            >
              {car.range} km<span className="sr-only"> samkvæmt WLTP</span>
            </div>
            <div
              className="mt-0.5 text-xs text-[#666] font-medium"
              title={getDriveLabel(car.drive)}
            >
              {car.drive}
              <span className="sr-only">, {getDriveLabel(car.drive)}</span>
            </div>
          </div>
        </div>

        {car.evDatabaseURL && (
          <a
            className="inline-block text-sm text-stone no-underline font-medium transition-colors duration-100 hover:underline hover:text-stone"
            target="_blank"
            href={car.evDatabaseURL}
            rel="noopener"
            onClick={() => trackEvent('Ev Database Link Clicked')}
          >
            Nánar á ev-database.org ↗
          </a>
        )}
      </div>
    </article>
  )
}

export default NewCar
