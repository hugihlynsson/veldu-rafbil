import { Metadata } from 'next'
import clsx from 'clsx'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LIST_SHARE_IMAGE_PATH, shareImageSize } from '@/modules/detail/paths'
import { daysIn, newsYears } from '@/modules/news/feed'
import { itemsOf } from '@/modules/news/news'
import { daySummary } from '@/modules/news/newsCopy'
import { NEWS_FEED_PATH, NEWS_PATH, newsYearPath } from '@/modules/news/paths'
import { newsBreadcrumbs } from '@/modules/news/structuredData'
import PageTop from '@/components/detail/PageTop'
import Footer from '@/components/Footer'
import PageChat from '@/components/detail/PageChat'
import StructuredData from '@/components/StructuredData'
import { pageColumn } from '@/components/pageColumn'
import DayLines from '@/components/news/DayLines'
import YearLinks from '@/components/news/YearLinks'

interface Props {
  params: Promise<{ ar: string }>
}

// Every year is known at the build, so any other is no page at all
export const dynamicParams = false

export const generateStaticParams = () => newsYears.map((ar) => ({ ar }))

// A year's days as one, counted
const summaryOf = (year: string) => daySummary({ items: itemsOf(daysIn(year)) })

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const year = (await params).ar
  if (!newsYears.includes(year)) return { title: 'Veldu Rafbíl' }

  const title = `Uppfærslur ${year} – Veldu Rafbíl`
  const description = `Rafbílar á Íslandi ${year}, dag fyrir dag: ${summaryOf(year)}`

  return {
    title,
    description,
    alternates: {
      canonical: newsYearPath(year),
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
}

export default async function Page({ params }: Props) {
  const year = (await params).ar
  if (!newsYears.includes(year)) notFound()

  return (
    <>
      <StructuredData data={newsBreadcrumbs(year)} />
      <main className="max-w-page mx-auto pb-14 md:pb-24">
        <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6')}>
          <PageTop />
        </header>
        <div className={pageColumn}>
          <div>
            <Link
              href={NEWS_PATH}
              className="text-sm font-semibold text-stone no-underline hover:underline"
            >
              <span aria-hidden>←</span> Allar uppfærslur
            </Link>
            <h1 className="m-0 mt-6 font-semibold text-display leading-tight lg:mt-10">
              Uppfærslur {year}
            </h1>
            <p className="mt-2 mb-0 max-w-prose text-base leading-normal text-pretty text-stone">
              {summaryOf(year)}
            </p>

            <div className="mt-10 md:mt-14">
              <DayLines days={daysIn(year)} heading="h2" />
            </div>

            <YearLinks current={year} className="mt-12 md:mt-16" />
          </div>
        </div>
      </main>
      <Footer />
      <PageChat />
    </>
  )
}
