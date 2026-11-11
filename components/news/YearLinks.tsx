import { FunctionComponent } from 'react'
import Link from 'next/link'

import { newsYears } from '@/modules/news/feed'
import { newsYearPath } from '@/modules/news/paths'

interface Props {
  /** The year whose page this is, which links nowhere */
  current?: string
  className?: string
}

/** Every year of news, each to its page, so none is further than a click */
const YearLinks: FunctionComponent<Props> = ({ current, className }) => (
  <nav aria-label="Uppfærslur eftir árum" className={className}>
    <h2 className="m-0 text-sm font-semibold">Eftir árum:</h2>
    <ul className="mt-2 mb-0 p-0 list-none flex flex-wrap gap-x-5 gap-y-1">
      {newsYears.map((year) => (
        <li key={year}>
          {year === current ? (
            <span
              aria-current="page"
              className="block py-1 text-base font-semibold"
            >
              {year}
            </span>
          ) : (
            <Link
              href={newsYearPath(year)}
              className="block py-1 text-base text-tint no-underline hover:underline"
            >
              {year}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </nav>
)

export default YearLinks
