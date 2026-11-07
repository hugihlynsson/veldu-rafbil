import { allCars, carWithSlug } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { sheetReviewOf } from '@/modules/detail/review'

interface Context {
  params: Promise<{ slug: string }>
}

// One small file a car, built at the deploy, so the sheet over the list asks
// for the review it shows rather than bringing every car's with it
export const dynamic = 'force-static'
export const dynamicParams = false

export const generateStaticParams = () =>
  allCars.map((car) => ({ slug: carSlug(car) }))

const headers = {
  'Cache-Control':
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
}

export async function GET(_request: Request, { params }: Context) {
  const car = carWithSlug((await params).slug)
  return Response.json(car ? sheetReviewOf(car) : null, { headers })
}
