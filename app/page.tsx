import { Metadata } from 'next'

import { connection } from 'next/server'

import cars from '@/modules/cars'
import CarList from '@/components/CarList'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Veldu Rafbíl',
  description: `Listi yfir alla ${cars.length} bílana sem eru seldir á Íslandi og eru 100% rafdrifnir, með hlekk á seljanda og helstu upplýsingum til samanburðar`,
}

export default async function Page() {
  // Rendered per request, so the list arrives sorted and filtered for its URL
  // rather than in data order until it hydrates
  await connection()

  return (
    <main>
      <CarList />
      <Footer />
    </main>
  )
}
