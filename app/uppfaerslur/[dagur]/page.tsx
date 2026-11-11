import { Metadata } from 'next'
import clsx from 'clsx'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { dayText } from '@/modules/copy/dayText'
import { shareImageSize } from '@/modules/detail/paths'
import {
  dayOn,
  days,
  dayShareImagePath,
  headlineOf,
  labelOf,
  publishedTime,
} from '@/modules/news/feed'
import { dayDescription } from '@/modules/news/newsCopy'
import { NEWS_FEED_PATH, NEWS_PATH, newsDayPath } from '@/modules/news/paths'
import { dayArticle, newsBreadcrumbs } from '@/modules/news/structuredData'
import PageTop from '@/components/detail/PageTop'
import Footer from '@/components/Footer'
import PageChat from '@/components/detail/PageChat'
import StructuredData from '@/components/StructuredData'
import { pageColumn } from '@/components/pageColumn'
import DayArticle from '@/components/news/DayArticle'
import Pager from '@/components/news/Pager'

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
      publishedTime: publishedTime(day),
      images: [{ url: dayShareImagePath(day), ...shareImageSize }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function Page({ params }: Props) {
  const day = dayOn((await params).dagur)
  if (!day) notFound()

  const index = days.indexOf(day)
  const newer = days[index - 1]
  const older = days[index + 1]

  return (
    <>
      <StructuredData
        data={[
          dayArticle(day),
          newsBreadcrumbs({
            name: dayText(day.date),
            path: newsDayPath(day.date),
          }),
        ]}
      />
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
            <DayArticle day={day} page className="mt-6 lg:mt-10" />

            <Pager
              label="Aðrir dagar"
              newer={
                newer && {
                  href: newsDayPath(newer.date),
                  text: headlineOf(newer),
                }
              }
              older={
                older && {
                  href: newsDayPath(older.date),
                  text: headlineOf(older),
                }
              }
              className="mt-12"
            />
          </div>
        </div>
      </main>
      <Footer />
      <PageChat />
    </>
  )
}
