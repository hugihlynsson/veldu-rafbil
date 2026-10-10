import { FunctionComponent } from 'react'
import clsx from 'clsx'
import { trackEvent } from 'fathom-client'
import Image, { getImageProps } from 'next/image'

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

const eyebrow = 'uppercase text-eyebrow font-semibold tracking-wider text-stone'
const statLabel = clsx(eyebrow, 'mb-0.75')
const statValue = 'text-2xl font-normal'
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

// Every view is the same card under md. From md each one lays it out its own
// way: the list as the photo beside the text, the grid as the photo over it,
// and the table as one thin row. The grid and the table place their parts on
// tracks CarList's grid shares out (subgrid), so prices and figures line up
// across cards; containment would cut a card off from them, so neither skips
// layout from md.
const layouts = {
  list: {
    card: [
      'md:flex md:m-0 md:mx-8 md:mb-10 md:ml-10 md:items-center',
      skipLayoutOutOfViewInList,
    ],
    photoBox: 'md:w-[40%] md:grow md:self-center',
    photo: 'md:rounded-sm',
    sizes: '(max-width: 767px) 100vw, (max-width: 1023px) 40vw, 540px',
    text: 'md:m-0 md:ml-8 md:p-0 md:w-[330px] md:max-w-card-text md:shrink-0 md:grow',
    heading: '',
    delivery: '',
    name: '',
    subtitle: '',
    price: '',
    stats: '',
    stat: '',
    label: '',
    value: '',
    more: '',
  },
  grid: {
    card: 'md:mb-10 md:grid md:grid-rows-subgrid md:row-span-5 md:[content-visibility:visible]',
    // Out past the text by 4px a side
    photoBox: 'md:-mx-1',
    photo: 'md:rounded-lg',
    // What CarList's grid resolves to, plus the overhang: from md two columns
    // of the page less its margins (ml-10, mr-8) and the gap (gap-x-6); from
    // lg three of the window less 5rem, up to --container-grid
    sizes:
      '(max-width: 767px) 100vw, (max-width: 1023px) calc(50vw - 40px), (max-width: 1279px) calc(33.3vw - 34px), 392px',
    text: 'md:contents',
    heading: 'md:pt-3',
    delivery: 'md:text-sm',
    name: 'md:text-xl',
    subtitle: 'md:mt-0 md:text-sm',
    price: 'md:mt-0',
    stats: 'md:mt-4 md:mb-3 md:max-w-none',
    stat: '',
    label: '',
    value: 'md:text-xl',
    more: 'md:justify-self-start md:self-start md:text-xs',
  },
  table: {
    card: 'md:grid md:grid-cols-subgrid md:col-span-full md:items-center md:m-0 md:py-3 md:border-b md:border-line/50 md:[content-visibility:visible]',
    // A step smaller under lg, where the name column has no room to spare
    photoBox: 'md:w-24 lg:w-32',
    // TablePhoto's own
    photo: '',
    sizes: '',
    text: 'md:contents',
    heading: '',
    delivery: 'md:m-0 md:text-sm',
    name: 'md:text-lg',
    subtitle: 'md:m-0 md:text-sm',
    price: 'md:m-0',
    stats: 'md:contents',
    stat: 'md:m-0',
    // TableHeader names the columns once
    label: 'md:sr-only',
    value: 'md:text-lg',
    more: 'md:hidden lg:inline-block lg:text-xs',
  },
} satisfies Record<View, Record<string, string | string[]>>

const statNames = {
  acceleration: '0-100 km/klst',
  battery: 'Rafhlaða',
  range: 'Drægni',
}

/** The column names over the table, which its rows only read out */
export const TableHeader = () => (
  <div
    aria-hidden
    className={clsx(
      'hidden md:grid md:grid-cols-subgrid md:col-span-full sticky top-0 z-10 py-2 bg-lab border-b border-line/50',
      eyebrow,
    )}
  >
    <span />
    <span />
    <span>Verð</span>
    <span>{statNames.acceleration}</span>
    <span>{statNames.battery}</span>
    <span>{statNames.range}</span>
    <span className="hidden lg:block" />
  </div>
)

// The phone's full-width photo, and from md a thumbnail. One <picture> rather
// than an image per size, as a lazy image hidden with display: none is still
// fetched; and not one image with both in its sizes, as a vw anywhere in them
// drops Next's 128 and 256 from the srcset. Not preloaded, as which of the two
// is wanted waits on the media query.
const TablePhoto = ({ src }: { src: string }) => {
  const {
    props: { srcSet: thumbnail },
  } = getImageProps({ alt: '', src, width: 128, height: 85 })
  const { props: photo } = getImageProps({
    alt: '',
    src,
    width: 1920,
    height: 1280,
    sizes: '100vw',
  })

  return (
    <picture>
      <source media="(width >= 768px)" srcSet={thumbnail} />
      <img {...photo} alt="" className="w-full h-auto md:rounded" />
    </picture>
  )
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
  const layout = layouts[view]
  const src = `/images/${car.heroImageName}.jpg`
  const table = view === 'table'
  const { id: carId, priceWithGrant, hasGrant } = car

  // Not agree(): sæti is neuter and reads the same at every count. A car
  // without a subModel gets the seat count on its own rather than a lone dot.
  const subTitle = [car.subModel, showSeats && `${car.seats} sæti`]
    .filter(Boolean)
    .join(' · ')

  const priceNote =
    (car.expectedDelivery && hasGrant && 'áætlað verð með styrk') ||
    (car.expectedDelivery && 'áætlað verð') ||
    (showValue &&
      `${hasGrant ? 'með styrk ' : ''}${addDecimalSeparators(
        Math.round(car.pricePerKm),
      )} kr. á km.`) ||
    (hasGrant && 'með styrk') ||
    undefined

  return (
    <article
      id={carId}
      // MiniCar scrolls here from the chat, and moves focus with it
      tabIndex={-1}
      className={clsx('mb-8', skipLayoutOutOfView, layout.card)}
    >
      <div className={layout.photoBox}>
        {table ? (
          <TablePhoto src={src} />
        ) : (
          <Image
            preload={preload}
            alt=""
            sizes={layout.sizes}
            src={src}
            width={1920}
            height={1280}
            className={clsx('w-full h-auto', layout.photo)}
          />
        )}
      </div>

      <div
        className={clsx(
          'py-2.5 px-(--gutter) mx-auto max-w-column xs:py-4.5',
          layout.text,
        )}
      >
        <div className={layout.heading}>
          {car.expectedDelivery && (
            <div
              className={clsx(
                'mb-0.5 text-base font-medium text-stone',
                layout.delivery,
              )}
            >
              Væntanlegur {car.expectedDelivery.toLowerCase()}
            </div>
          )}

          <h2 className={clsx('m-0 font-semibold text-display', layout.name)}>
            <span>{car.make}</span>{' '}
            <span className="font-normal">{car.model}</span>
            <span
              className={clsx(
                'block font-medium text-base text-stone -mt-px mb-2',
                layout.subtitle,
              )}
            >
              {subTitle}
            </span>
          </h2>
        </div>

        <div className={clsx('mt-2', layout.price)}>
          <LinkPill
            className="-ml-0.5"
            href={car.sellerUrl}
            external
            // The table writes it under the pill, to keep its column narrow
            extra={
              priceNote && `${priceNote}${car.expectedDelivery ? ' ↗' : ''}`
            }
            extraClassName={clsx(table && 'md:hidden')}
            title={
              hasGrant
                ? `Fullt verð án styrks: ${addDecimalSeparators(car.price)} kr.`
                : undefined
            }
            onClick={() => trackEvent('Seller clicked')}
          >
            {addDecimalSeparators(priceWithGrant)} kr.
            {car.expectedDelivery ? (
              table && <span className="hidden md:inline"> ↗</span>
            ) : (
              <> ↗</>
            )}
          </LinkPill>

          {table && priceNote && (
            <div className="hidden md:block mt-1 uppercase font-bold text-eyebrow text-stone">
              {priceNote}
            </div>
          )}
        </div>

        <div
          className={clsx(
            'flex mb-4 mt-6 max-w-[320px] justify-between xs:max-w-[360px]',
            layout.stats,
          )}
        >
          <div className={clsx('mr-2 xs:mr-4 basis-1/3', layout.stat)}>
            <div className={clsx(statLabel, layout.label)}>
              {statNames.acceleration}
            </div>
            <div className={clsx(statValue, layout.value)}>
              {car.acceleration.toFixed(1)}s
            </div>
            <div
              className={statDetail}
              title={`Afl (${Math.round(car.power * 1.34102)} hö)`}
            >
              {car.power} kW<span className="sr-only"> afl</span>
            </div>
          </div>

          <div className={clsx('mr-2 xs:mr-4 basis-1/3 shrink-0', layout.stat)}>
            <div className={clsx(statLabel, layout.label)}>
              {statNames.battery}
            </div>
            <div className={clsx(statValue, layout.value)}>
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

          <div
            className={clsx('mr-0 basis-1/3', layout.stat)}
            title="Samkvæmt WLTP prófunum"
          >
            <div className={clsx(statLabel, layout.label)}>
              {statNames.range}
            </div>
            <div className={clsx(statValue, layout.value)}>
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
              layout.more,
            )}
            target="_blank"
            href={car.evDatabaseUrl}
            rel="noopener"
            onClick={() => trackEvent('Ev Database Link Clicked')}
          >
            <span className={clsx(table && 'lg:hidden')}>Nánar á </span>
            ev-database.org ↗
          </a>
        )}
      </div>
    </article>
  )
}

export default NewCar
