import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { dayOn, frontDays, olderPage } from '@/modules/news/feed'
import { daysRangeText } from '@/modules/news/newsCopy'
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

// Only a day with news, as every link here names one, so the pages are as
// many as the days rather than one for every date there is
const read = async ({ params }: Props) => {
  const cursor = (await params).dagur
  return dayOn(cursor) ? olderPage(cursor) : undefined
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const page = await read(props)
  return {
    title: page?.days.length
      ? `Uppfærslur ${daysRangeText(page.days)} – Veldu Rafbíl`
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
        title={daysRangeText(days)}
        stepped
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
