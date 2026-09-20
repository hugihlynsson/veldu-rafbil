import { buildCarsPayload } from '../../../modules/carApi'

// Built once at deploy and served from the CDN. The data only changes when
// somebody edits the car list and deploys, so there is nothing for a request
// to compute: no function runs, which is also why this endpoint needs none of
// the guarding /api/chat needs. That route spends money on every call and is
// rate limited for it. This one is a static file with a route's name.
export const dynamic = 'force-static'

// Public, read-only, no credentials, so any page may read it from the browser
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control':
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
}

export function GET() {
  // Evaluated at build, so it reports when this copy of the data was published
  const payload = buildCarsPayload(
    new Date(),
    process.env.VERCEL_GIT_COMMIT_SHA,
  )

  // Compact on purpose: the readers this is for are models paying by the token,
  // and whitespace is most of what pretty-printing would send them
  return new Response(JSON.stringify(payload), { headers })
}
