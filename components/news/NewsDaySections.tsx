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

// On a phone every car is a row of a list, its photo as tall as the two lines
// beside it, so a run of twenty reads as one list. From md a new car is a tile
// with its photo over its name, as the similar cars on a car's page are, and
// the rest stay rows, in columns: a day of twenty new prices would otherwise
// be a wall of photos
const Row: FunctionComponent<{ item: NewsItem; tile: boolean }> = ({
  item,
  tile,
}) => {
  const car = carWithSlug(item.slug)
  const parts = detailOf(item, car).split(' · ')
  const tileBox = tile && 'md:w-full md:h-auto md:aspect-[3/2] md:rounded-lg'

  return (
    <li
      className={clsx(
        'relative flex items-start gap-3 py-2.5',
        tile && 'md:flex-col md:gap-2.5 md:py-0',
      )}
    >
      {car ? (
        <Image
          alt=""
          src={`/images/${car.heroImageName}.jpg`}
          // A tile is a third of the page from md, some 290px at most; a row's
          // photo is 72px everywhere, so its 1x/2x pair is 128 and 256
          {...(tile
            ? {
                sizes: '(max-width: 767px) 72px, 290px',
                width: 290,
                height: 193,
              }
            : { width: 72, height: 48 })}
          className={clsx(
            'w-18 h-12 shrink-0 rounded-sm object-cover bg-cloud',
            tileBox,
          )}
        />
      ) : (
        <div
          className={clsx('w-18 h-12 shrink-0 rounded-sm bg-cloud', tileBox)}
        />
      )}
      <div className={clsx('flex-1 min-w-0', tile && 'md:px-0.5')}>
        <div className="text-base leading-snug">
          {car ? (
            <Link
              href={carPathOf(car)}
              className="font-semibold text-tint no-underline after:absolute after:inset-0 hover:underline"
            >
              {car.make} <span className="font-normal">{car.model}</span>
            </Link>
          ) : (
            <span className="font-semibold">{item.label}</span>
          )}
          {car?.subModel && (
            <span className="text-sm font-medium text-stone">
              {' '}
              {car.subModel}
            </span>
          )}
        </div>
        {/* A line of figures breaks at a dot on the narrowest phones rather
            than inside one; a sentence wraps as any other */}
        <div className="mt-0.5 text-sm font-medium text-stone">
          {parts.length > 1
            ? parts.map((part, index) => (
                <span key={part}>
                  {index > 0 && ' · '}
                  <span className="whitespace-nowrap">{part}</span>
                </span>
              ))
            : parts[0]}
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
              'mt-1 mb-0 p-0 list-none md:grid md:gap-x-6',
              kind === 'added'
                ? 'md:mt-3 md:grid-cols-3 md:gap-y-7'
                : 'md:grid-cols-2 lg:grid-cols-3',
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
