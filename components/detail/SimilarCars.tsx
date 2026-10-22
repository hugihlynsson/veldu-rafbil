import { FunctionComponent } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Car } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import CompareIcon from '@/components/CompareIcon'

interface CompareLink {
  href: string
  label: string
}

interface Props {
  cars: ReadonlyArray<Car>
  heading: string
  /** A link beside the heading, for all of them at once */
  all?: CompareLink
  /** The button on a card, when there is a comparison to make with it */
  compareWith?: (car: Car) => CompareLink | undefined
  className?: string
}

/** The cars to look at next, each opening its own page */
const SimilarCars: FunctionComponent<Props> = ({
  cars,
  heading,
  all,
  compareWith,
  className,
}) => (
  <section aria-labelledby="similar" className={className}>
    <div className="flex items-baseline justify-between gap-4">
      {/* As the list labels its sorting */}
      <h2 id="similar" className="m-0 text-sm font-semibold">
        {heading}
      </h2>
      {all && (
        <Link
          href={all.href}
          className="text-sm font-semibold text-tint no-underline hover:underline"
        >
          {all.label} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
    <ul className="mt-3 mb-0 p-0 list-none grid gap-3 md:grid-cols-3">
      {cars.map((other) => {
        const compare = compareWith?.(other)
        return (
          // The whole card opens the car's page; the button over it compares
          <li
            key={other.id}
            className="relative flex items-center gap-3 rounded-card overflow-hidden transition-colors duration-200 hover:bg-shade md:flex-col md:items-stretch md:overflow-visible md:hover:bg-transparent md:isolate md:before:absolute md:before:-inset-1 md:before:-bottom-3 md:before:-z-10 md:before:rounded-xl md:before:bg-shade md:before:opacity-0 md:before:transition-opacity md:before:duration-200 md:hover:before:opacity-100"
          >
            {/* Beside the name, flush to the card with its border drawn
                over it. Above the name it needs no border, and on hover
                the card shows 4px past the photo: rounded-xl is the
                photo's rounded-lg grown by those 4px, at whatever
                --corner scales them by */}
            <Image
              alt=""
              sizes="(max-width: 767px) 128px, 210px"
              src={`/images/${other.heroImageName}.jpg`}
              width={128}
              height={85}
              className="w-32 h-auto aspect-[3/2] shrink-0 self-stretch object-cover md:w-full md:rounded-lg"
            />
            <div
              className={clsx(
                'flex-1 min-w-0 py-2 text-balance md:p-0 md:px-1',
                !compare && 'pr-3',
              )}
            >
              <Link
                href={carPathOf(other)}
                className="text-base font-semibold leading-tight text-tint no-underline after:absolute after:inset-0 after:rounded-card after:border after:border-line md:after:border-0"
              >
                {other.make} <span className="font-normal">{other.model}</span>
              </Link>
              <div className="mt-1 text-sm font-medium text-stone">
                {/* On the narrowest phones it breaks between the two */}
                <span className="whitespace-nowrap">
                  {addDecimalSeparators(other.priceWithGrant)} kr. ·
                </span>{' '}
                <span className="whitespace-nowrap">{other.range} km</span>
              </div>
            </div>
            {/* An icon beside the name on phones, where the words would
                squeeze it, and the words under it from md up */}
            {compare && (
              <Link
                href={compare.href}
                aria-label={compare.label}
                className="relative z-1 shrink-0 self-center mr-3 inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full border border-line-chip bg-lab text-tint no-underline transition duration-100 hover:bg-cloud active:scale-[0.95] md:self-start md:w-auto md:h-auto md:mx-1 md:py-1 md:px-3"
              >
                <span className="flex md:hidden">
                  <CompareIcon size={14} />
                </span>
                <span className="hidden md:inline">Bera saman</span>
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  </section>
)

export default SimilarCars
