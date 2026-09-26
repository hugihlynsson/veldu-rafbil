import buildLlmsText from '@/modules/llmsText'

// A route rather than a file in public/ so the counts and grant figures come
// from the data, the way the page description and the system prompt do
export const dynamic = 'force-static'

const headers = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control':
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
}

export function GET() {
  return new Response(buildLlmsText(), { headers })
}
