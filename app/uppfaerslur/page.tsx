import { Metadata } from 'next'
import clsx from 'clsx'

import { LIST_SHARE_IMAGE_PATH, shareImageSize } from '@/modules/detail/paths'
import { recentDays } from '@/modules/news/feed'
import { NEWS_FEED_PATH, NEWS_PATH } from '@/modules/news/paths'
import { newsBreadcrumbs } from '@/modules/news/structuredData'
import PageTop from '@/components/detail/PageTop'
import Footer from '@/components/Footer'
import PageChat from '@/components/detail/PageChat'
import StructuredData from '@/components/StructuredData'
import { pageColumn } from '@/components/pageColumn'
import DayArticle from '@/components/news/DayArticle'
import DayLines from '@/components/news/DayLines'
import YearLinks from '@/components/news/YearLinks'

// Told in full, a couple of months of news; the rest of the year are a line
// each, and the years before on their own pages. Each day in full is its
// photos and a row per car, so twenty made the page some 700 KB.
const FULL_DAYS = 10

const title = 'Uppfærslur – Veldu Rafbíl'
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
  const older = recentDays.slice(FULL_DAYS)

  return (
    <>
      <StructuredData data={newsBreadcrumbs()} />
      <main className="max-w-page mx-auto pb-14 md:pb-24">
        <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6')}>
          <PageTop />
        </header>
        <div className={pageColumn}>
          <div>
            <h1 className="m-0 mt-4 font-semibold text-display leading-tight">
              Uppfærslur
            </h1>
            <p className="mt-2 mb-0 max-w-prose text-base leading-normal text-pretty text-stone">
              Nýir bílar, ný verð og bílar sem hætta í sölu, daginn sem þeir
              breytast á listanum.
            </p>

            {recentDays.slice(0, FULL_DAYS).map((day) => (
              <DayArticle
                key={day.date}
                day={day}
                className="mt-16 md:mt-24 lg:mt-20"
              />
            ))}

            {older.length > 0 && (
              <section aria-labelledby="older" className="mt-16 md:mt-24">
                <h2 id="older" className="m-0 text-sm font-semibold">
                  Eldra:
                </h2>
                <DayLines days={older} heading="h3" />
              </section>
            )}

            <YearLinks className="mt-12 md:mt-16" />
          </div>
        </div>
      </main>
      <Footer />
      <PageChat />
    </>
  )
}
