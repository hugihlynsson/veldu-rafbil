import buildLlmsText from '../../modules/llmsText'

// A route rather than a file in public/ so that the counts and the grant
// figures in it come from the data, the way the page's own description and the
// assistant's system prompt do. A hand-written public/llms.txt would go stale
// the first time a car was added.
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
