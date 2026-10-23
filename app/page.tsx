import { Metadata } from 'next'

import cars from '@/modules/data/cars'
import { listHeadline } from '@/modules/copy/listHeadline'
import { LIST_SHARE_IMAGE_PATH, shareImageSize } from '@/modules/detail/paths'
import CarList from '@/components/list/CarList'
import Footer from '@/components/Footer'

// Built once at deploy, for a visit with no sort or filter in its URL; one
// with either is rewritten to app/with-query (next.config.ts). Forced, as nuqs
// reads the URL through useSearchParams, which would otherwise leave the list
// out of the build for the browser to render.
export const dynamic = 'force-static'

const title = 'Veldu Rafbíl'
const description = `Listi yfir alla ${cars.length} bílana sem eru seldir á Íslandi og eru 100% rafdrifnir, með hlekk á seljanda og helstu upplýsingum til samanburðar`

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: 'Veldu Rafbíl',
    locale: 'is_IS',
    images: [
      {
        url: LIST_SHARE_IMAGE_PATH,
        ...shareImageSize,
        alt: listHeadline(cars.length),
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
}

export default function Page() {
  return (
    <main>
      <CarList />
      <Footer />
    </main>
  )
}
