import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { carWithSlug, type Car } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import type { NewsDay, NewsItem } from '@/modules/news/news'
import { dayKinds } from '@/modules/news/news'
import { itemText, kindLabels, priceNote } from '@/modules/news/newsCopy'

// A new car is told by its figures now, under a heading that already says it
// is new
const detailOf = (item: NewsItem, car: Car | undefined): string => {
  if (item.kind !== 'added') return itemText(item, 'news')
  if (!car || car.deprecated)
    return itemText({ ...item, kind: 'removed' }, 'news')
  const grant = car.hasGrant ? ' með styrk' : ''
  const delivery = car.expectedDelivery
    ? ` · væntanlegur ${car.expectedDelivery.toLowerCase()}`
    : ''
  return `${addDecimalSeparators(car.priceWithGrant)} kr.${grant} · ${car.range} km${delivery}`
}

// A new car is a tile, its photo over its name and the text inset from the
// photo's edges: two to a line on a phone, three from md. Every other change
// is a row, its photo beside two lines, so a day of twenty new prices reads as
// one list rather than a wall of photos; from md the rows go two to a line
// with a larger photo, and from lg three, in the type a tile has on a phone
// and a photo a step smaller to match
const Row: FunctionComponent<{ item: NewsItem; tile: boolean }> = ({
  item,
  tile,
}) => {
  const car = carWithSlug(item.slug)
  const parts = detailOf(item, car).split(' · ')

  return (
    <li
      className={clsx(
        'group relative flex',
        tile
          ? 'flex-col gap-2 md:gap-3'
          : // The fill reaches 10px past the photo on every side, as a similar
            // car's does on a car's page, and rounds by the photo's radius
            // and those 10px, so the two corners run parallel
            'items-start gap-3 py-2.5 md:items-center md:gap-4 lg:gap-3 md:isolate md:before:absolute md:before:-inset-x-2.5 md:before:inset-y-0 md:before:-z-10 md:before:rounded-[calc(var(--radius-lg)+10px)] md:before:bg-shade md:before:opacity-0 md:before:transition-opacity md:before:duration-200 md:hover:before:opacity-100',
      )}
    >
      {/* The frame clips the photo, which a tile zooms within on hover */}
      <div
        className={clsx(
          'shrink-0 overflow-hidden bg-cloud',
          tile
            ? 'w-full aspect-[3/2] rounded-lg md:rounded-xl'
            : 'w-18 h-12 rounded-sm md:w-24 md:h-16 md:rounded-lg lg:w-21 lg:h-14',
        )}
      >
        {car && (
          <Image
            alt=""
            src={`/images/${car.heroImageName}.jpg`}
            // A tile is half the column on a phone and a third of the page
            // from md, some 290px at most. A row's photo is 72px on a phone
            // 96px from md, where its width is taken, and 84px from lg, so its
            // 1x/2x pair is 128 and 256 throughout
            {...(tile
              ? {
                  sizes: '(max-width: 767px) 50vw, 290px',
                  width: 290,
                  height: 193,
                }
              : { width: 96, height: 64 })}
            className={clsx(
              'w-full h-full object-cover',
              tile &&
                'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:scale-105 motion-safe:group-hover:duration-500',
            )}
          />
        )}
      </div>
      <div className={clsx('flex-1 min-w-0', tile && 'px-1 md:px-3')}>
        <div
          className={clsx(
            'leading-snug',
            tile ? 'text-sm md:text-base' : 'text-base lg:text-sm',
          )}
        >
          {car ? (
            <Link
              href={carPathOf(car)}
              className="font-semibold text-tint no-underline after:absolute after:inset-0"
            >
              {car.make} <span className="font-normal">{car.model}</span>
            </Link>
          ) : (
            <span className="font-semibold">{item.label}</span>
          )}
          {car?.subModel && (
            <span
              className={clsx(
                'font-medium text-stone',
                tile ? 'text-xs md:text-sm' : 'text-sm lg:text-xs',
              )}
            >
              {' '}
              {car.subModel}
            </span>
          )}
        </div>
        {/* A row's line of figures breaks at a dot on the narrowest phones
            rather than inside one. A tile's is too narrow on a phone to keep
            a figure whole, so it wraps as a sentence does, with each dot held
            to the end of its line rather than starting the next */}
        <div
          className={clsx(
            'mt-0.5 font-medium text-stone',
            tile ? 'text-control md:text-sm' : 'text-sm lg:text-control',
          )}
        >
          {!tile && parts.length > 1
            ? parts.map((part, index) => (
                <span key={part}>
                  {index > 0 && ' · '}
                  <span className="whitespace-nowrap">{part}</span>
                </span>
              ))
            : parts.join('\u00a0· ')}
        </div>
      </div>
    </li>
  )
}

/** What a day brought, a kind at a time: new cars first */
const NewsDaySections: FunctionComponent<{ day: NewsDay }> = ({ day }) =>
  dayKinds.map(
    (kind) =>
      day.items[kind].length > 0 && (
        <section key={kind} className="mt-6 md:mt-8">
          <h3 className="m-0 text-sm font-semibold">
            {kindLabels[kind]}
            {kind === 'price' && (
              <span className="font-medium text-stone"> · {priceNote}</span>
            )}
          </h3>
          <ul
            className={clsx(
              'mb-0 p-0 list-none',
              kind === 'added'
                ? 'mt-3 grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-6 md:gap-y-8'
                : 'mt-1 md:mt-2 md:grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-3 lg:gap-x-6',
            )}
          >
            {day.items[kind].map((item) => (
              <Row
                key={`${item.slug}-${item.kind}`}
                item={item}
                tile={kind === 'added'}
              />
            ))}
          </ul>
        </section>
      ),
  )

export default NewsDaySections
