import { FunctionComponent } from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'
import Image from 'next/image'

import type { Drive } from '@/modules/data/newCarSchema'
import { Car } from '@/modules/data/cars'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { formatKmPerMinute } from '@/modules/data/getKmPerMinutesCharged'
import LinkPill from '@/components/LinkPill'

interface Props {
  car: Car
  showValue?: boolean
  showSeats?: boolean
  preload?: boolean
}

const statLabel =
  'uppercase text-eyebrow font-semibold tracking-wider mb-0.75 text-stone'
const statValue = 'text-2xl font-normal'
const statDetail = 'mt-0.5 text-xs text-stone font-medium'

// Out of view a card skips layout and stands in at this height, so the scroll
// to a car from the chat is aimed with it and corrects less the closer it is.
// Under md: the photo, full width at 3:2, over its text, which measures 280px
// on average at every phone width. From md: the photo gets the page less the
// card's margins and gap (ml-10, mr-8, ml-8: 26 steps) and the text column,
// unless the text beside it, 243px on average, is taller.
const skipLayoutOutOfView =
  '[content-visibility:auto] [contain-intrinsic-size:auto_calc(100vw*2/3+280px)] md:[contain-intrinsic-size:auto_max(243px,(min(100vw,var(--container-page))-var(--container-card-text)-var(--spacing)*26)*2/3)]'

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
  const { id: carId, priceWithGrant, hasGrant } = car

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
        'mb-8 md:flex md:m-0 md:mx-8 md:mb-10 md:ml-10 md:items-center',
        skipLayoutOutOfView,
      )}
    >
      <div className="md:w-[40%] md:grow md:self-center">
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

      <div className="py-2.5 px-(--gutter) mx-auto max-w-column xs:py-4.5 md:m-0 md:ml-8 md:p-0 md:w-[330px] md:max-w-card-text md:shrink-0 md:grow">
        {car.expectedDelivery && (
          <div className="mb-0.5 text-base font-medium text-stone">
            Væntanlegur {car.expectedDelivery.toLowerCase()}
          </div>
        )}

        <h2 className="m-0 font-semibold text-display">
          <span>{car.make}</span>{' '}
          <span className="font-normal">{car.model}</span>
          <span className="block font-medium text-base text-stone -mt-px mb-2">
            {subTitle}
          </span>
        </h2>

        <LinkPill
          className="mt-2 -ml-0.5"
          href={car.sellerUrl}
          external
          extra={
            (car.expectedDelivery && hasGrant && 'áætlað verð með styrk ↗') ||
            (car.expectedDelivery && 'áætlað verð ↗') ||
            (showValue &&
              `${hasGrant ? 'með styrk ' : ''}${addDecimalSeparators(
                Math.round(car.pricePerKm),
              )} kr. á km.`) ||
            (hasGrant && 'með styrk') ||
            undefined
          }
          title={
            hasGrant
              ? `Fullt verð án styrks: ${addDecimalSeparators(car.price)} kr.`
              : undefined
          }
          onClick={() => trackEvent('Seller clicked')}
        >
          {addDecimalSeparators(priceWithGrant)} kr.
          {!car.expectedDelivery && ' ↗'}
        </LinkPill>

        <div className="flex mb-4 mt-6 max-w-[320px] justify-between xs:max-w-[360px]">
          <div className="mr-2 xs:mr-4 basis-1/3">
            <div className={statLabel}>0-100 km/klst</div>
            <div className={statValue}>{car.acceleration.toFixed(1)}s</div>
            <div
              className={statDetail}
              title={`Afl (${Math.round(car.power * 1.34102)} hö)`}
            >
              {car.power} kW<span className="sr-only"> afl</span>
            </div>
          </div>

          <div className="mr-2 xs:mr-4 basis-1/3 shrink-0">
            <div className={statLabel}>Rafhlaða</div>
            <div className={statValue}>{car.capacity} kWh</div>
            <div
              className={statDetail}
              title={`Meðaldrægniaukning á milli 10%-80% á hröðustu hleðslu (${car.timeToCharge10To80} min)`}
            >
              {formatKmPerMinute(car.kmPerMinuteCharged)} km/min
              <span className="sr-only">
                {' '}
                meðaldrægniaukning á hröðustu hleðslu
              </span>
            </div>
          </div>

          <div className="mr-0 basis-1/3" title="Samkvæmt WLTP prófunum">
            <div className={statLabel}>Drægni</div>
            <div className={statValue}>
              {car.range} km<span className="sr-only"> samkvæmt WLTP</span>
            </div>
            <div className={statDetail} title={getDriveLabel(car.drive)}>
              {car.drive}
              <span className="sr-only">, {getDriveLabel(car.drive)}</span>
            </div>
          </div>
        </div>

        {car.evDatabaseUrl && (
          <a
            className="inline-block text-sm text-stone no-underline font-medium transition-colors duration-100 hover:underline hover:text-tint"
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
