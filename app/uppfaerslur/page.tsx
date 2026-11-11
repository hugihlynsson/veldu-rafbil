import { Metadata } from 'next'
import { LIST_SHARE_IMAGE_PATH, shareImageSize } from '@/modules/detail/paths'
import { archivePages, frontDays } from '@/modules/news/feed'
import { NEWS_FEED_PATH, NEWS_PATH, newsPagePath } from '@/modules/news/paths'
import { newsBreadcrumbs } from '@/modules/news/structuredData'
import Footer from '@/components/Footer'
import PageChat from '@/components/detail/PageChat'
import StructuredData from '@/components/StructuredData'
import NewsPage from '@/components/news/NewsPage'

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
  const [older] = archivePages

  return (
    <>
      <StructuredData data={newsBreadcrumbs()} />
      <NewsPage
        title="Uppfærslur"
        intro="Nýir bílar, ný verð og bílar sem hætta í sölu, daginn sem þeir breytast á listanum."
        days={frontDays}
        older={older?.[0] && { path: newsPagePath(older[0].date), days: older }}
      />
      <Footer />
      <PageChat />
    </>
  )
}
