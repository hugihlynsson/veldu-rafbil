import { FunctionComponent } from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'
import Image from 'next/image'

import type { Drive } from '@/modules/data/newCarSchema'
import { Car } from '@/modules/data/cars'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { formatKmPerMinute } from '@/modules/data/getKmPerMinutesCharged'
import LinkPill from '@/components/LinkPill'
import type { View } from '@/modules/list/view'

interface Props {
  car: Car
  showValue?: boolean
  showSeats?: boolean
  preload?: boolean
  view?: View
}

const statLabel =
  'uppercase text-eyebrow font-semibold tracking-wider mb-0.75 text-stone'
const statValue = 'text-2xl font-normal'
const statValueInGrid = 'md:text-xl'
const statDetail = 'mt-0.5 text-xs text-stone font-medium'

// Out of view a card skips layout and stands in at this height, so the scroll
// to a car from the chat is aimed with it and corrects less the closer it is.
// Under md: the photo, full width at 3:2, over its text, which measures 280px
// on average at every phone width. From md: the photo gets the page less the
// card's margins and gap (ml-10, mr-8, ml-8: 26 steps) and the text column,
// unless the text beside it, 243px on average, is taller.
const skipLayoutOutOfView =
  '[content-visibility:auto] [contain-intrinsic-size:auto_calc(100vw*2/3+280px)]'
const skipLayoutOutOfViewInList =
  'md:[contain-intrinsic-size:auto_max(243px,(min(100vw,var(--container-page))-var(--container-card-text)-var(--spacing)*26)*2/3)]'
// A grid card lays its parts out on rows its whole row of cards shares, so the
// prices and the figures line up across it. Containment would cut it off from
// them, and a card a third as tall has less to skip.
const sharedRowsInGrid =
  'md:grid md:grid-rows-subgrid md:row-span-5 md:[content-visibility:visible]'

// What CarList's grid resolves to, plus the photo's 8px overhang (-mx-1): from
// md two columns of the page less its margins (ml-10, mr-8) and the gap
// (gap-x-6); from lg three of the window less 5rem, up to --container-grid
const sizes = {
  list: '(max-width: 767px) 100vw, (max-width: 1023px) 40vw, 540px',
  grid: '(max-width: 767px) 100vw, (max-width: 1023px) calc(50vw - 40px), (max-width: 1279px) calc(33.3vw - 34px), 392px',
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
  view = 'list',
}) => {
  const grid = view === 'grid'
  const { id: carId, priceWithGrant, hasGrant } = car

  // Not agree(): sæti is neuter and reads the same at every count. A car
  // without a subModel gets what follows on its own rather than a lone dot.
  const subTitle = [
    car.subModel,
    showSeats && `${car.seats} sæti`,
    car.expectedDelivery && `Væntanlegur ${car.expectedDelivery.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article
      id={carId}
      // MiniCar scrolls here from the chat, and moves focus with it
      tabIndex={-1}
      className={clsx(
        'mb-8',
        skipLayoutOutOfView,
        grid
          ? ['md:mb-10', sharedRowsInGrid]
          : [
              'md:flex md:m-0 md:mx-8 md:mb-10 md:ml-10 md:items-center',
              skipLayoutOutOfViewInList,
            ],
      )}
    >
      <div
        className={clsx(
          grid ? 'md:-mx-1' : 'md:w-[40%] md:grow md:self-center',
        )}
      >
        <Image
          preload={preload}
          alt=""
          sizes={sizes[view]}
          src={`/images/${car.heroImageName}.jpg`}
          width={1920}
          height={1280}
          className={clsx(
            'w-full h-auto',
            grid ? 'md:rounded-lg' : 'md:rounded-sm',
          )}
        />
      </div>

      <div
        className={clsx(
          'py-2.5 px-(--gutter) mx-auto max-w-column xs:py-4.5',
          grid
            ? 'md:contents'
            : 'md:m-0 md:ml-8 md:p-0 md:w-[330px] md:max-w-card-text md:shrink-0 md:grow',
        )}
      >
        <h2
          className={clsx(
            'm-0 font-semibold text-display',
            grid && 'md:pt-3 md:text-[1.375rem]',
          )}
        >
          <span>{car.make}</span>{' '}
          <span className="font-normal">{car.model}</span>
          <span
            className={clsx(
              'block font-medium text-base text-stone -mt-px mb-2',
              grid && 'md:mt-0 md:text-sm',
            )}
          >
            {subTitle}
          </span>
        </h2>

        <LinkPill
          className={clsx(
            'mt-2 -ml-0.5',
            grid && 'md:mt-0.5 md:justify-self-start',
          )}
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

        <div
          className={clsx(
            'flex mb-4 mt-6 max-w-[320px] justify-between xs:max-w-[360px]',
            grid && 'md:mt-4 md:mb-3.5 md:max-w-none',
          )}
        >
          <div className="mr-2 xs:mr-4 basis-1/3">
            <div className={statLabel}>0-100 km/klst</div>
            <div className={clsx(statValue, grid && statValueInGrid)}>
              {car.acceleration.toFixed(1)}s
            </div>
            <div
              className={statDetail}
              title={`Afl (${Math.round(car.power * 1.34102)} hö)`}
            >
              {car.power} kW<span className="sr-only"> afl</span>
            </div>
          </div>

          <div className="mr-2 xs:mr-4 basis-1/3 shrink-0">
            <div className={statLabel}>Rafhlaða</div>
            <div className={clsx(statValue, grid && statValueInGrid)}>
              {car.capacity} kWh
            </div>
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
            <div className={clsx(statValue, grid && statValueInGrid)}>
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
            className={clsx(
              'inline-block text-sm text-stone no-underline font-medium transition-colors duration-100 hover:underline hover:text-tint',
              grid && 'md:justify-self-start md:self-start md:text-xs',
            )}
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
