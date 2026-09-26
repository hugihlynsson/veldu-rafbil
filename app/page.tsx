import { Metadata } from 'next'

import cars from '@/modules/cars'
import CarList from '@/components/CarList'
import Footer from '@/components/Footer'

// Built once at deploy, for a visit with no sort or filter in its URL. One with
// either is rewritten to app/listi and rendered per request (next.config.ts).
// Forced, as nuqs reads the URL through useSearchParams, which would otherwise
// leave the list out of the build for the browser to render.
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Veldu Rafbíl',
  description: `Listi yfir alla ${cars.length} bílana sem eru seldir á Íslandi og eru 100% rafdrifnir, með hlekk á seljanda og helstu upplýsingum til samanburðar`,
}

export default function Page() {
  return (
    <main>
      <CarList />
      <Footer />
    </main>
  )
}
