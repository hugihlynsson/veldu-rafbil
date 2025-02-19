// `app` directory
import { Metadata } from 'next'

import cars from '../modules/newCars'
import { Filters, Drive } from '../types'
import NewCars from './newCars'
import Footer from '../components/Footer'
import { ParsedUrlQuery } from 'querystring'
import { getSortingFromQuery } from '../modules/sorting'

export const metadata: Metadata = {
  title: 'Veldu Rafbíl',
  description: `Listi yfir alla ${cars.length} bílana sem eru seldir á Íslandi og eru 100% rafdrifnir, með hlekk á seljanda og helstu upplýsingum til samanburðar`,
}

const getFiltersFromQuery = (query: ParsedUrlQuery): Filters => {
  let filters: Filters = {}

  let { hrodun, drif, hradhledsla, nafn, verd, draegni, virdi, frambod } = query

  if (hrodun) filters.acceleration = Number(hrodun)
  if (drif)
    filters.drive =
      typeof drif === 'string' ? [drif as Drive] : (drif as Drive[])
  if (hradhledsla) filters.fastcharge = Number(hradhledsla)
  if (nafn)
    filters.name =
      typeof nafn === 'string' ? [nafn as string] : (nafn as string[])
  if (verd) filters.price = Number(verd)
  if (draegni) filters.range = Number(draegni)
  if (virdi) filters.value = Number(virdi)
  if (frambod)
    filters.availability = frambod === 'faanlegir' ? 'available' : 'expected'

  return filters
}

type Props = { searchParams: Promise<Record<string, string>> }

export default async function Page({ searchParams }: Props) {
  return (
    <>
      <NewCars
        sorting={getSortingFromQuery(await searchParams)}
        filters={getFiltersFromQuery(await searchParams)}
      />
      <Footer />
    </>
  )
}
