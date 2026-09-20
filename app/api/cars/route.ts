import { buildCarsPayload } from '../../../modules/carApi'

// Built at deploy, so no function runs and this needs none of the guarding
// /api/chat has — that route spends money per call, this one is a static file
export const dynamic = 'force-static'

// Public and read-only, so any page may read it from the browser
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

  // Compact: the readers this is for are models paying by the token
  return new Response(JSON.stringify(payload), { headers })
}
