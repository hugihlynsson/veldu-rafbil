import { FunctionComponent, memo } from 'react'
import { trackEvent } from 'fathom-client'
import Image from 'next/image'

import { NewCar as NewCarType, Drive } from '../types'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import getKmPerMinutesCharged from '../modules/getKmPerMinutesCharged'
import LinkPill from './LinkPill'
import getPriceWithGrant from '../modules/getPriceWithGrant'

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

const NewCar: FunctionComponent<Props> = ({ car, showValue, priority }) => {
  const priceWithGrant = getPriceWithGrant(car.price)
  let hasGrant = priceWithGrant != car.price

  // Create a unique ID for this car
  const carId = `car-${car.make}-${car.model}-${car.subModel || 'base'}`
    .toLowerCase()
    .replace(/\s+/g, '-')

  return (
    <article
      id={carId}
      className="mb-8 md:flex md:m-0 md:mx-8 md:mb-10 md:ml-10 md:items-center"
    >
      <div className="md:block md:relative md:w-[40%] md:grow md:self-center">
        <Image
          priority={priority}
          alt=""
          sizes="(max-width: 767px) 100wv, (max-width: 1023px) 40wv, 540px"
          src={`/images/${car.heroImageName}.jpg`}
          width={1920}
          height={1280}
          className="w-full h-auto md:rounded-sm"
        />
      </div>

      <div className="py-[10px] px-4 mx-auto max-w-[480px] xs:py-[18px] xs:px-6 md:m-0 md:ml-8 md:p-0 md:w-[330px] md:max-w-[380px] md:shrink-0 md:grow">
        {car.expectedDelivery && (
          <div className="mb-0.5 text-base font-medium text-stone">
            Væntanlegur {car.expectedDelivery.toLowerCase()}
          </div>
        )}

        <h1 className="m-0 font-semibold text-[32px]">
          <span>{car.make}</span>{' '}
          <span className="font-normal">{car.model}</span>
          <span className="block font-medium text-base text-stone -mt-px mb-2">
            {car.subModel}
          </span>
        </h1>

        <LinkPill
          href={car.sellerURL}
          external
          extra={
            (car.expectedDelivery &&
              hasGrant &&
              'áætlað verð (með styrk) ↗') ||
            (car.expectedDelivery && 'áætlað verð ↗') ||
            (showValue &&
              `${hasGrant ? '(með styrk) ' : ''}${addDecimalSeprators(
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

        <div className="flex mb-4 mt-6 max-w-[320px] justify-between">
          <div className="mr-2 xs:mr-4 basis-1/3">
            <div className="uppercase text-[10px] font-semibold tracking-wider mb-[3px] text-stone">
              0-100 km/klst
            </div>
            <div className="text-2xl font-normal">
              {car.acceleration.toFixed(1)}s
            </div>
            <div
              className="mt-0.5 text-xs text-[#666] font-medium"
              title={`Afl (${Math.round(car.power * 1.34102)} hö)`}
            >
              {car.power} kW
            </div>
          </div>

          <div className="mr-2 xs:mr-4 basis-1/3 shrink-0">
            <div className="uppercase text-[10px] font-semibold tracking-wider mb-[3px] text-stone">
              Rafhlaða
            </div>
            <div className="text-2xl font-normal">{car.capacity} kWh</div>
            <div
              className="mt-0.5 text-xs text-[#666] font-medium"
              title={`Meðaldrægniaukning á milli 10%-80% á hröðustu hleðslu (${car.timeToCharge10T080} min)`}
            >
              {getKmPerMinutesCharged(car.timeToCharge10T080, car.range)} km/min
            </div>
          </div>

          <div className="mr-0 basis-1/3" title="Samkvæmt WLTP prófunum">
            <div className="uppercase text-[10px] font-semibold tracking-wider mb-[3px] text-stone">
              Drægni
            </div>
            <div className="text-2xl font-normal">{car.range} km</div>
            <div
              className="mt-0.5 text-xs text-[#666] font-medium"
              title={getDriveLabel(car.drive)}
            >
              {car.drive}
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

export default memo(NewCar)
