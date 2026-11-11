import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { dayRangeText } from '@/modules/copy/dayText'
import { frontDays, olderPage } from '@/modules/news/feed'
import { isDay, itemsOf, type NewsDay } from '@/modules/news/news'
import { daySummary } from '@/modules/news/newsCopy'
import { NEWS_PATH, newsPagePath } from '@/modules/news/paths'
import Footer from '@/components/Footer'
import PageChat from '@/components/detail/PageChat'
import NewsPage from '@/components/news/NewsPage'

interface Props {
  params: Promise<{ dagur: string }>
}

// None at the build: each is rendered the first time it is asked for and kept
// until the next deploy, which is the only thing that brings news
export const generateStaticParams = () => []

const read = async ({ params }: Props) => {
  const cursor = (await params).dagur
  return isDay(cursor) ? olderPage(cursor) : undefined
}

const rangeOf = (days: ReadonlyArray<NewsDay>) =>
  dayRangeText(days.at(-1)?.date ?? '', days[0]?.date ?? '')

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const page = await read(props)
  return {
    title: page?.days.length
      ? `Uppfærslur ${rangeOf(page.days)} – Veldu Rafbíl`
      : 'Veldu Rafbíl',
    // Every day here has its own page, which is the one to find; these are
    // only the way back through them
    robots: { index: false, follow: true },
  }
}

export default async function Page(props: Props) {
  const page = await read(props)
  if (!page?.days.length) notFound()

  const { days, older, newer } = page

  return (
    <>
      <NewsPage
        title={`Uppfærslur ${rangeOf(days)}`}
        intro={daySummary({ items: itemsOf(days) })}
        back={
          <Link
            href={NEWS_PATH}
            className="text-sm font-semibold text-stone no-underline hover:underline"
          >
            <span aria-hidden>←</span> Nýjustu uppfærslur
          </Link>
        }
        days={days}
        older={
          older
            ? { path: newsPagePath(older), days: olderPage(older).days }
            : undefined
        }
        newer={
          newer === undefined
            ? undefined
            : {
                path: newer ? newsPagePath(newer) : NEWS_PATH,
                days: newer ? olderPage(newer).days : frontDays,
              }
        }
      />
      <Footer />
      <PageChat />
    </>
  )
}
