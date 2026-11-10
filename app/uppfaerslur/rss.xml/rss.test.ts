import { describe, expect, it } from 'vitest'

import { days, headlineOf } from '@/modules/news/feed'
import type { NewsDay } from '@/modules/news/news'
import { SITE_URL } from '@/modules/siteUrl'
import { buildFeed } from './rss'

const day: NewsDay = {
  date: '2026-10-31',
  items: {
    added: [
      {
        kind: 'added',
        date: '2026-10-31',
        slug: 'a',
        label: 'Smart #1 <Brabus> & co',
      },
    ],
    price: [],
    estimate: [],
    delivery: [],
    removed: [],
  },
}

describe('the news feed', () => {
  it('escapes what the car data can hold', () => {
    const feed = buildFeed([day], () => 'Smart #1 <Brabus> & co bætist við')
    expect(feed).toContain(
      '<title>Smart #1 &lt;Brabus&gt; &amp; co bætist við</title>',
    )
    expect(feed).not.toContain('<Brabus>')
  })

  it('links each day to its page, as its own id', () => {
    const feed = buildFeed([day], () => 'x')
    expect(feed).toContain(`<link>${SITE_URL}/uppfaerslur/2026-10-31</link>`)
    expect(feed).toContain(
      `<guid isPermaLink="true">${SITE_URL}/uppfaerslur/2026-10-31</guid>`,
    )
    expect(feed).toContain('<pubDate>Sat, 31 Oct 2026 00:00:00 GMT</pubDate>')
  })

  it('names each car as it is called now, not as it was', () => {
    const feed = buildFeed(
      [day],
      () => 'x',
      () => 'Smart #1 Pulse',
    )
    expect(feed).toContain('Smart #1 Pulse: ')
    expect(feed).not.toContain('Brabus')
  })

  it('has an item for each of the newest days', () => {
    const feed = buildFeed(days, headlineOf)
    expect(feed.match(/<item>/g)).toHaveLength(Math.min(days.length, 50))
  })
})
