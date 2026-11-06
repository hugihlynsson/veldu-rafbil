import { days, headlineOf, labelOf } from '@/modules/news/feed'
import { buildFeed } from './rss'

// Built at the deploy, which is the only thing that brings news
export const dynamic = 'force-static'

const headers = {
  'Content-Type': 'application/rss+xml; charset=utf-8',
  'Cache-Control':
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
}

export function GET() {
  return new Response(buildFeed(days, headlineOf, labelOf), { headers })
}
