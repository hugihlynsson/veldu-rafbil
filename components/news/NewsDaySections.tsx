import { FunctionComponent } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { carWithSlug } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import type { DayKind, NewsDay, NewsItem } from '@/modules/news/news'
import { dayKinds } from '@/modules/news/news'
import { itemText } from '@/modules/news/newsCopy'

const kindLabels: Record<DayKind, string> = {
  added: 'Nýir á lista',
  price: 'Verðbreytingar',
  delivery: 'Afhending',
  removed: 'Hættir í sölu',
}

const Row: FunctionComponent<{ item: NewsItem }> = ({ item }) => {
  const car = carWithSlug(item.slug)
  const onSale = car && !car.deprecated

  return (
    <li className="relative flex items-center gap-3 rounded-card overflow-hidden transition-colors duration-200 hover:bg-shade">
      {car ? (
        // The size the box renders at, so the 1x/2x pair is 128 and 256
        <Image
          alt=""
          src={`/images/${car.heroImageName}.jpg`}
          width={96}
          height={64}
          className="w-24 h-16 shrink-0 object-cover"
        />
      ) : (
        <div className="w-24 h-16 shrink-0 bg-cloud" />
      )}
      <div className="flex-1 min-w-0 py-2 pr-3">
        {car ? (
          <Link
            href={carPathOf(car)}
            className="text-base font-semibold leading-tight text-tint no-underline after:absolute after:inset-0 after:rounded-card after:border after:border-line"
          >
            {car.make} <span className="font-normal">{car.model}</span>
            {car.subModel && (
              <span className="text-sm font-medium text-stone">
                {' '}
                {car.subModel}
              </span>
            )}
          </Link>
        ) : (
          <span className="text-base font-semibold leading-tight">
            {item.label}
          </span>
        )}
        {/* A new car is told by its figures today, under a heading that
            already says it is new */}
        {item.kind !== 'added' ? (
          <div className="mt-0.5 text-sm font-medium text-stone">
            {itemText(item, 'news')}
          </div>
        ) : (
          onSale && (
            <div className="mt-0.5 text-sm font-medium text-stone">
              Í dag {addDecimalSeparators(car.priceWithGrant)} kr.
              {car.hasGrant && ' með styrk'} · {car.range} km
              {car.expectedDelivery &&
                ` · væntanlegur ${car.expectedDelivery.toLowerCase()}`}
            </div>
          )
        )}
      </div>
    </li>
  )
}

/** What a day brought, a kind at a time: new cars first */
const NewsDaySections: FunctionComponent<{ day: NewsDay }> = ({ day }) =>
  dayKinds.map(
    (kind) =>
      day.items[kind].length > 0 && (
        <section key={kind} className="mt-5">
          <h3 className="m-0 text-sm font-semibold">{kindLabels[kind]}</h3>
          <ul className="mt-2 mb-0 p-0 list-none grid gap-2">
            {day.items[kind].map((item) => (
              <Row key={`${item.slug}-${item.kind}`} item={item} />
            ))}
          </ul>
        </section>
      ),
  )

export default NewsDaySections
