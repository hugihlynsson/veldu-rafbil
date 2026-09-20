import { Metadata } from 'next'

import cars from '../modules/newCars'
import NewCars from './newCars'
import Footer from '../components/Footer'
import { getDirectionFromQuery, getSortingFromQuery } from '../modules/sorting'
import { getFiltersFromQuery } from '../modules/filters'
import { SearchParams } from '../types'

export const metadata: Metadata = {
  title: 'Veldu Rafbíl',
  description: `Listi yfir alla ${cars.length} bílana sem eru seldir á Íslandi og eru 100% rafdrifnir, með hlekk á seljanda og helstu upplýsingum til samanburðar`,
}

type Props = { searchParams: Promise<SearchParams> }

export default async function Page({ searchParams }: Props) {
  const query = await searchParams

  return (
    <main>
      <NewCars
        sorting={getSortingFromQuery(query)}
        direction={getDirectionFromQuery(query)}
        filters={getFiltersFromQuery(query)}
      />
      <Footer />
    </main>
  )
}
