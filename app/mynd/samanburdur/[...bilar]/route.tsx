import { resolveCompared } from '@/modules/detail/slugs'
import { shareImage } from '../../shareImage'

/**
 * The picture a shared comparison link unfurls into. Its own route rather than
 * an opengraph-image beside the page, which a catch-all segment cannot have.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ bilar: string[] }> },
) {
  const { cars } = resolveCompared((await params).bilar)
  return shareImage(request, cars)
}
