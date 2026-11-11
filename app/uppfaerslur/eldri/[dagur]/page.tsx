import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { dayRangeText } from '@/modules/copy/dayText'
import { shareImageSize } from '@/modules/detail/paths'
import {
  archivePageOn,
  archivePages,
  dayShareImagePath,
  frontDays,
} from '@/modules/news/feed'
import { itemsOf, type NewsDay } from '@/modules/news/news'
import { daySummary } from '@/modules/news/newsCopy'
import { NEWS_FEED_PATH, NEWS_PATH, newsPagePath } from '@/modules/news/paths'
import { newsBreadcrumbs } from '@/modules/news/structuredData'
import Footer from '@/components/Footer'
import PageChat from '@/components/detail/PageChat'
import StructuredData from '@/components/StructuredData'
import NewsPage, { type NeighbourPage } from '@/components/news/NewsPage'

interface Props {
  params: Promise<{ dagur: string }>
}

// Only the day each page starts from names one, and all are known at the build
export const dynamicParams = false

export const generateStaticParams = () =>
  archivePages.flatMap(([newest]) => (newest ? [{ dagur: newest.date }] : []))

const rangeOf = (page: ReadonlyArray<NewsDay>) =>
  dayRangeText(page.at(-1)?.date ?? '', page[0]?.date ?? '')

const neighbour = (
  page: ReadonlyArray<NewsDay> | undefined,
): NeighbourPage | undefined =>
  page?.[0] && { path: newsPagePath(page[0].date), days: page }

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const page = archivePageOn((await params).dagur)
  if (!page?.[0]) return { title: 'Veldu Rafbíl' }

  const title = `Uppfærslur ${rangeOf(page)} – Veldu Rafbíl`
  const description = `Rafbílar á Íslandi ${rangeOf(page)}: ${daySummary({ items: itemsOf(page) })}`

  return {
    title,
    description,
    alternates: {
      canonical: newsPagePath(page[0].date),
      types: { 'application/rss+xml': NEWS_FEED_PATH },
    },
    openGraph: {
      title,
      description,
      siteName: 'Veldu Rafbíl',
      locale: 'is_IS',
      images: [{ url: dayShareImagePath(page[0]), ...shareImageSize }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function Page({ params }: Props) {
  const page = archivePageOn((await params).dagur)
  if (!page?.[0]) notFound()

  const index = archivePages.indexOf(page)
  const newer = neighbour(archivePages[index - 1]) ?? {
    path: NEWS_PATH,
    days: frontDays,
  }

  return (
    <>
      <StructuredData
        data={newsBreadcrumbs({
          name: rangeOf(page),
          path: newsPagePath(page[0].date),
        })}
      />
      <NewsPage
        title={`Uppfærslur ${rangeOf(page)}`}
        intro={daySummary({ items: itemsOf(page) })}
        days={page}
        older={neighbour(archivePages[index + 1])}
        newer={newer}
        back={
          <Link
            href={NEWS_PATH}
            className="text-sm font-semibold text-stone no-underline hover:underline"
          >
            <span aria-hidden>←</span> Nýjustu uppfærslur
          </Link>
        }
      />
      <Footer />
      <PageChat />
    </>
  )
}
