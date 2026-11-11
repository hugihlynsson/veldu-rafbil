import { Metadata } from 'next'
import clsx from 'clsx'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { shareImageSize } from '@/modules/detail/paths'
import {
  dayOn,
  days,
  dayShareImagePath,
  headlineOf,
  labelOf,
} from '@/modules/news/feed'
import { dayDescription } from '@/modules/news/newsCopy'
import {
  NEWS_FEED_PATH,
  NEWS_PATH,
  newsDayPath,
  newsYearPath,
} from '@/modules/news/paths'
import { dayArticle, newsBreadcrumbs } from '@/modules/news/structuredData'
import PageTop from '@/components/detail/PageTop'
import Footer from '@/components/Footer'
import PageChat from '@/components/detail/PageChat'
import StructuredData from '@/components/StructuredData'
import { pageColumn } from '@/components/pageColumn'
import DayArticle from '@/components/news/DayArticle'

interface Props {
  params: Promise<{ dagur: string }>
}

// Every day is known at the build, so any other is no page at all
export const dynamicParams = false

export const generateStaticParams = () =>
  days.map(({ date }) => ({ dagur: date }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const day = dayOn((await params).dagur)
  if (!day) return { title: 'Veldu Rafbíl' }

  const title = `${headlineOf(day)} – Veldu Rafbíl`
  const description = dayDescription(day, labelOf)

  return {
    title,
    description,
    alternates: {
      canonical: newsDayPath(day.date),
      types: { 'application/rss+xml': NEWS_FEED_PATH },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      siteName: 'Veldu Rafbíl',
      locale: 'is_IS',
      publishedTime: day.date,
      images: [{ url: dayShareImagePath(day), ...shareImageSize }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

const crumbLink = 'text-stone no-underline hover:underline'

const stepLink =
  'block py-2 text-sm font-semibold text-tint no-underline hover:underline'

export default async function Page({ params }: Props) {
  const day = dayOn((await params).dagur)
  if (!day) notFound()

  const index = days.indexOf(day)
  const newer = days[index - 1]
  const older = days[index + 1]
  const year = day.date.slice(0, 4)

  return (
    <>
      <StructuredData data={[dayArticle(day), newsBreadcrumbs(day.date)]} />
      <main className="max-w-page mx-auto pb-14 md:pb-24">
        <header className={clsx(pageColumn, 'pt-4 pb-6 xs:pt-6')}>
          <PageTop />
        </header>
        <div className={pageColumn}>
          <div>
            <nav
              aria-label="Leiðarslóð"
              className="flex gap-2 text-sm font-semibold text-stone"
            >
              <Link href={NEWS_PATH} className={crumbLink}>
                <span aria-hidden>←</span> Allar uppfærslur
              </Link>
              <span aria-hidden>·</span>
              <Link href={newsYearPath(year)} className={crumbLink}>
                {year}
              </Link>
            </nav>
            <DayArticle day={day} page className="mt-6 lg:mt-10" />

            <nav
              aria-label="Aðrir dagar"
              className="mt-12 pt-4 border-t border-line grid gap-1 sm:grid-cols-2"
            >
              {older && (
                <Link href={newsDayPath(older.date)} className={stepLink}>
                  <span aria-hidden>←</span> {headlineOf(older)}
                </Link>
              )}
              {newer && (
                <Link
                  href={newsDayPath(newer.date)}
                  className={clsx(stepLink, 'sm:col-start-2 sm:text-right')}
                >
                  {headlineOf(newer)} <span aria-hidden>→</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </main>
      <Footer />
      <PageChat />
    </>
  )
}
