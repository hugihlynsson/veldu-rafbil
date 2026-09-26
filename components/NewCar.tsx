import { FunctionComponent } from 'react'
import { trackEvent } from 'fathom-client'
import Image from 'next/image'

import { Drive } from '../types'
import { Car } from '../modules/cars'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import { formatKmPerMinutesCharged } from '../modules/getKmPerMinutesCharged'
import LinkPill from './LinkPill'

interface Props {
  car: Car
  showValue?: boolean
  showSeats?: boolean
  preload?: boolean
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

const NewCar: FunctionComponent<Props> = ({
  car,
  showValue,
  showSeats,
  preload,
}) => {
  const { id: carId, priceWithGrant } = car
  const hasGrant = priceWithGrant !== car.price

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
      className="mb-8 md:flex md:m-0 md:mx-8 md:mb-10 md:ml-10 md:items-center"
    >
      <div className="md:block md:relative md:w-[40%] md:grow md:self-center">
        <Image
          preload={preload}
          alt=""
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 40vw, 540px"
          src={`/images/${car.heroImageName}.jpg`}
          width={1920}
          height={1280}
          className="w-full h-auto md:rounded-sm"
        />
      </div>

      <div className="py-[10px] px-(--gutter) mx-auto max-w-[480px] xs:py-[18px] md:m-0 md:ml-8 md:p-0 md:w-[330px] md:max-w-[380px] md:shrink-0 md:grow">
        {car.expectedDelivery && (
          <div className="mb-0.5 text-base font-medium text-stone">
            Væntanlegur {car.expectedDelivery.toLowerCase()}
          </div>
        )}

        <h2 className="m-0 font-semibold text-[32px]">
          <span>{car.make}</span>{' '}
          <span className="font-normal">{car.model}</span>
          <span className="block font-medium text-base text-stone -mt-px mb-2">
            {subTitle}
          </span>
        </h2>

        <LinkPill
          href={car.sellerUrl}
          external
          extra={
            (car.expectedDelivery && hasGrant && 'áætlað verð með styrk ↗') ||
            (car.expectedDelivery && 'áætlað verð ↗') ||
            (showValue &&
              `${hasGrant ? 'með styrk ' : ''}${addDecimalSeprators(
                Math.round(car.pricePerKm),
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

        <div className="flex mb-4 mt-6 max-w-[320px] justify-between xs:max-w-[360px]">
          <div className="mr-2 xs:mr-4 basis-1/3">
            <div className="uppercase text-[10px] font-semibold tracking-wider mb-[3px] text-stone">
              0-100 km/klst
            </div>
            <div className="text-2xl font-normal">
              {car.acceleration.toFixed(1)}s
            </div>
            <div
              className="mt-0.5 text-xs text-stone font-medium"
              title={`Afl (${Math.round(car.power * 1.34102)} hö)`}
            >
              {car.power} kW<span className="sr-only"> afl</span>
            </div>
          </div>

          <div className="mr-2 xs:mr-4 basis-1/3 shrink-0">
            <div className="uppercase text-[10px] font-semibold tracking-wider mb-[3px] text-stone">
              Rafhlaða
            </div>
            <div className="text-2xl font-normal">{car.capacity} kWh</div>
            <div
              className="mt-0.5 text-xs text-stone font-medium"
              title={`Meðaldrægniaukning á milli 10%-80% á hröðustu hleðslu (${car.timeToCharge10To80} min)`}
            >
              {formatKmPerMinutesCharged(car.timeToCharge10To80, car.range)}{' '}
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
            <div className="text-2xl font-normal">
              {car.range} km<span className="sr-only"> samkvæmt WLTP</span>
            </div>
            <div
              className="mt-0.5 text-xs text-stone font-medium"
              title={getDriveLabel(car.drive)}
            >
              {car.drive}
              <span className="sr-only">, {getDriveLabel(car.drive)}</span>
            </div>
          </div>
        </div>

        {car.evDatabaseUrl && (
          <a
            className="inline-block text-sm text-stone no-underline font-medium transition-colors duration-100 hover:underline hover:text-stone"
            target="_blank"
            href={car.evDatabaseUrl}
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
