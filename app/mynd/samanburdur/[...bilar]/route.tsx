import { MAX_COMPARED } from '@/modules/detail/comparison'
import { resolveSlugs } from '@/modules/detail/slugs'
import { shareImage } from '../../shareImage'

/**
 * The picture a shared comparison link unfurls into. Its own route rather than
 * an opengraph-image beside the page, which a catch-all segment cannot have.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bilar: string[] }> },
) {
  const { cars } = resolveSlugs(
    (await params).bilar.map(decodeURIComponent),
    MAX_COMPARED,
  )
  return shareImage(cars)
}
