import { FunctionComponent } from 'react'
import Link from 'next/link'

import { newsYears } from '@/modules/news/feed'

/** Every year of news, each to the page its last day is told on */
const YearLinks: FunctionComponent<{ className?: string }> = ({
  className,
}) => (
  <nav aria-label="Uppfærslur eftir árum" className={className}>
    <h2 className="m-0 text-sm font-semibold">Eftir árum:</h2>
    <ul className="mt-2 mb-0 p-0 list-none flex flex-wrap gap-x-5 gap-y-1">
      {newsYears.map(({ year, path }) => (
        <li key={year}>
          <Link
            href={path}
            className="block py-1 text-base text-tint no-underline hover:underline"
          >
            {year}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)

export default YearLinks
