import { allCars, carWithSlug } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { buildCarDetail } from './carDetail'

interface Context {
  params: Promise<{ slug: string }>
}

// One file a car, built at the deploy like the list, those no longer sold new
// included, since their pages and history stay
export const dynamic = 'force-static'
export const dynamicParams = false

export const generateStaticParams = () =>
  allCars.map((car) => ({ slug: carSlug(car) }))

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control':
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
}

export async function GET(_request: Request, { params }: Context) {
  const car = carWithSlug((await params).slug)
  if (!car) return new Response(null, { status: 404 })

  const payload = buildCarDetail(
    car,
    new Date(),
    process.env.VERCEL_GIT_COMMIT_SHA,
  )
  return new Response(JSON.stringify(payload), { headers })
}
