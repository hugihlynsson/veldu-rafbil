import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import CarIcon from '@/components/CarIcon'
import { photoZoom } from '@/components/photoZoom'
import { carWithSlug, type Car } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import type { NewsDay, NewsItem } from '@/modules/news/news'
import { dayKinds } from '@/modules/news/news'
import {
  itemText,
  kindLabels,
  notesPrice,
  priceNote,
} from '@/modules/news/newsCopy'

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

// Where a car's photo goes. A car that left the data before it kept its
// photo has none, so its frame holds a car drawn in the frame's own grey
const frame =
  'shrink-0 overflow-hidden flex items-center justify-center bg-cloud text-clay'

const carLink =
  'font-semibold text-tint no-underline after:absolute after:inset-0'

// A new car is a tile, its photo over its name: two to a line on a phone,
// three from md, where the photo reaches 4px past the text on either side
const Tile: FunctionComponent<{ item: NewsItem }> = ({ item }) => {
  const car = carWithSlug(item.slug)

  return (
    <li
      className={clsx('relative flex flex-col gap-2 md:gap-3', car && 'group')}
    >
      <div
        className={clsx(
          frame,
          'aspect-[3/2] rounded-lg md:-mx-1 md:rounded-xl',
        )}
      >
        {!car && <CarIcon size={40} />}
        {car && (
          <Image
            alt=""
            src={`/images/${car.heroImageName}.jpg`}
            // Half the column on a phone and a third of the page from md,
            // 307px at most
            sizes="(max-width: 767px) 50vw, 307px"
            width={307}
            height={205}
            className={clsx('w-full h-full object-cover', photoZoom)}
          />
        )}
      </div>
      <div className="min-w-0">
        <div className="text-sm leading-snug md:text-base">
          {car ? (
            <Link href={carPathOf(car)} className={carLink}>
              {car.make} <span className="font-normal">{car.model}</span>
            </Link>
          ) : (
            <span className="font-semibold">{item.label}</span>
          )}
          {car?.subModel && (
            <span className="font-medium text-xs text-stone md:text-sm">
              {' '}
              {car.subModel}
            </span>
          )}
        </div>
        {/* Too narrow on a phone to keep a figure whole, so the line wraps as
            a sentence does, with each dot held to the end of its line rather
            than starting the next */}
        <div className="mt-0.5 font-medium text-control text-stone md:text-sm">
          {detailOf(item, car).split(' · ').join('\u00a0· ')}
        </div>
      </div>
    </li>
  )
}

// Every other change is a row, its photo beside two lines, so a day of twenty
// new prices reads as one list rather than a wall of photos. From md the rows
// go two to a line with a larger photo, and three where the section has the
// page's whole width, in the type a tile has on a phone and a photo a step
// smaller to match. That last step asks the section rather than the window:
// the updates page gives a day less than the page while its date is beside it
const Row: FunctionComponent<{ item: NewsItem }> = ({ item }) => {
  const car = carWithSlug(item.slug)
  const parts = detailOf(item, car).split(' · ')

  return (
    // The fill reaches 8px past the photo on every side and rounds by the
    // photo's radius and those 8px, so the two corners run parallel. Text
    // taller than the photo pushes it out, to 4px past the text's box. A row
    // fills rather than zooming its photo, and only where there is a page
    // to go to
    <li
      className={clsx(
        'relative flex items-start gap-3 py-2.5 md:items-center md:gap-4 @wide:gap-3 md:[--photo-h:--spacing(16)] @wide:[--photo-h:--spacing(14)]',
        car &&
          'group md:isolate md:before:absolute md:before:-inset-x-2 md:before:inset-y-[min(50%_-_var(--photo-h)/2_-_8px,6px)] md:before:-z-10 md:before:rounded-[calc(var(--radius-lg)+8px)] md:before:bg-shade md:before:opacity-0 md:before:transition-opacity md:before:duration-200 md:hover:before:opacity-100',
      )}
    >
      <div
        className={clsx(
          frame,
          'w-18 h-12 rounded-sm md:w-24 md:h-(--photo-h) md:rounded-lg @wide:w-21',
        )}
      >
        {!car && <CarIcon size={24} />}
        {car && (
          <Image
            alt=""
            src={`/images/${car.heroImageName}.jpg`}
            // 72px on a phone, 96px from md, where its width is taken, and
            // 84px three to a line, so its 1x/2x pair is 128 and 256 throughout
            width={96}
            height={64}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-base leading-snug @wide:text-sm">
          {car ? (
            <Link href={carPathOf(car)} className={carLink}>
              {car.make} <span className="font-normal">{car.model}</span>
            </Link>
          ) : (
            <span className="font-semibold">{item.label}</span>
          )}
          {car?.subModel && (
            <span className="font-medium text-sm text-stone @wide:text-xs">
              {' '}
              {car.subModel}
            </span>
          )}
        </div>
        {/* The figures break at a dot on the narrowest phones rather than
            inside one */}
        <div className="mt-0.5 font-medium text-sm text-stone @wide:text-control">
          {parts.map((part, index) => (
            <span key={part}>
              {index > 0 && ' · '}
              <span className="whitespace-nowrap">{part}</span>
            </span>
          ))}
        </div>
      </div>
    </li>
  )
}

/**
 * What a day brought, a kind at a time: new cars first. From lg the headings
 * are told in the rail beside the day, so here they are only read out, and
 * the kinds are set apart by the space a heading would have opened
 */
const NewsDaySections: FunctionComponent<{ day: NewsDay }> = ({ day }) =>
  dayKinds.map(
    (kind) =>
      day.items[kind].length > 0 && (
        <section
          key={kind}
          className="@container mt-6 md:mt-8 lg:mt-10 lg:first-of-type:mt-5"
        >
          <h3 className="m-0 text-sm font-semibold lg:sr-only">
            {kindLabels[kind]}
            {notesPrice(kind) && (
              <span className="font-medium text-stone"> · {priceNote}</span>
            )}
          </h3>
          <ul
            className={clsx(
              'mb-0 p-0 list-none',
              // A row's own padding is taken back off the list's ends from lg,
              // so the first photo of a day starts where a tile's would, on
              // the line the rail's first rule is drawn at
              kind === 'added'
                ? 'mt-3 grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-6 md:gap-y-8 lg:mt-0'
                : 'mt-1 md:mt-2 md:grid md:grid-cols-2 md:gap-x-8 lg:-my-2.5 @wide:grid-cols-3 @wide:gap-x-6',
            )}
          >
            {day.items[kind].map((item) =>
              kind === 'added' ? (
                <Tile key={item.slug} item={item} />
              ) : (
                <Row key={`${item.slug}-${item.kind}`} item={item} />
              ),
            )}
          </ul>
        </section>
      ),
  )

export default NewsDaySections
