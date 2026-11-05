import { Metadata } from 'next'
import clsx from 'clsx'
import Link from 'next/link'

import { dayText, monthText } from '@/modules/copy/dayText'
import { LIST_SHARE_IMAGE_PATH, shareImageSize } from '@/modules/detail/paths'
import { days, headlineOf } from '@/modules/news/feed'
import type { NewsDay } from '@/modules/news/news'
import { NEWS_FEED_PATH, NEWS_PATH, newsDayPath } from '@/modules/news/paths'
import PageTop from '@/components/detail/PageTop'
import Footer from '@/components/Footer'
import TextLink from '@/components/TextLink'
import { pageColumn } from '@/components/pageColumn'
import NewsDaySections from '@/components/news/NewsDaySections'

// Told in full; the rest are a line each, by month
const FULL_DAYS = 20

const title = 'Fréttir – Veldu Rafbíl'
const description =
  'Nýir rafbílar á Íslandi, verðbreytingar og bílar sem hætta í sölu, um leið og þeir birtast á Veldu Rafbíl.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: NEWS_PATH,
    types: { 'application/rss+xml': NEWS_FEED_PATH },
  },
  openGraph: {
    title,
    description,
    siteName: 'Veldu Rafbíl',
    locale: 'is_IS',
    images: [{ url: LIST_SHARE_IMAGE_PATH, ...shareImageSize }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function Page() {
  const recent = days.slice(0, FULL_DAYS)
  const older = new Map<string, NewsDay[]>()
  for (const day of days.slice(FULL_DAYS)) {
    const month = monthText(day.date)
    older.set(month, [...(older.get(month) ?? []), day])
  }

  return (
    <>
      <main className="max-w-page mx-auto pb-14 md:pb-24">
        <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6')}>
          <PageTop />
        </header>
        <div className={pageColumn}>
          <div className="md:max-w-prose md:mx-auto">
            <h1 className="m-0 mt-4 font-semibold text-display leading-tight">
              Fréttir
            </h1>
            <p className="mt-2 mb-0 text-base leading-normal text-pretty text-stone">
              Nýir bílar, ný verð og bílar sem hætta í sölu, daginn sem þeir
              breytast á listanum. Fæst líka sem{' '}
              <TextLink href={NEWS_FEED_PATH}>RSS-straumur</TextLink>.
            </p>

            {recent.map((day) => (
              <article key={day.date} className="mt-12">
                <time
                  dateTime={day.date}
                  className="uppercase text-eyebrow font-semibold tracking-wider text-stone"
                >
                  {dayText(day.date)}
                </time>
                <h2 className="m-0 mt-1 text-xl font-semibold leading-tight text-balance">
                  <Link
                    href={newsDayPath(day.date)}
                    className="text-tint no-underline hover:underline"
                  >
                    {headlineOf(day)}
                  </Link>
                </h2>
                <NewsDaySections day={day} />
              </article>
            ))}

            {older.size > 0 && (
              <section aria-labelledby="older" className="mt-16">
                <h2 id="older" className="m-0 text-sm font-semibold">
                  Eldri fréttir:
                </h2>
                {[...older].map(([month, ofMonth]) => (
                  <div key={month} className="mt-4">
                    <h3 className="m-0 text-eyebrow uppercase font-semibold tracking-wider text-stone">
                      {month}
                    </h3>
                    <ul className="mt-1 mb-0 p-0 list-none">
                      {ofMonth.map((day) => (
                        <li key={day.date} className="py-1 text-base">
                          <Link
                            href={newsDayPath(day.date)}
                            className="text-tint no-underline hover:underline"
                          >
                            {headlineOf(day)}
                          </Link>{' '}
                          <span className="text-sm text-stone">
                            {dayText(day.date)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
