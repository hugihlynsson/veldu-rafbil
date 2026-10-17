import { resolveSlugs } from '@/modules/detail/slugs'
import { shareImage } from '../../shareImage'

/** The picture a link to a car's page unfurls into */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { cars } = resolveSlugs([decodeURIComponent((await params).slug)])
  if (cars.length === 0) return new Response(null, { status: 404 })
  return shareImage(cars[0])
}
