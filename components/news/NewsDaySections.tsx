import { FunctionComponent } from 'react'
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

// A row of a list rather than a card, without dividers: the photo is as tall
// as the two lines beside it, and a run of twenty reads as one list
const Row: FunctionComponent<{ item: NewsItem }> = ({ item }) => {
  const car = carWithSlug(item.slug)
  const parts = detailOf(item, car).split(' · ')

  return (
    <li className="relative flex items-start gap-3 py-2">
      {car ? (
        // The size the box renders at, so the 1x/2x pair is 128 and 256
        <Image
          alt=""
          src={`/images/${car.heroImageName}.jpg`}
          width={72}
          height={48}
          className="w-18 h-12 shrink-0 rounded-sm object-cover bg-cloud"
        />
      ) : (
        <div className="w-18 h-12 shrink-0 rounded-sm bg-cloud" />
      )}
      <div className="flex-1 min-w-0">
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
        <section key={kind} className="mt-6">
          <h3 className="m-0 text-sm font-semibold">
            {kindLabels[kind]}
            {kind === 'price' && (
              <span className="font-medium text-stone"> · {priceNote}</span>
            )}
          </h3>
          <ul className="mt-1 mb-0 p-0 list-none">
            {day.items[kind].map((item) => (
              <Row key={`${item.slug}-${item.kind}`} item={item} />
            ))}
          </ul>
        </section>
      ),
  )

export default NewsDaySections
