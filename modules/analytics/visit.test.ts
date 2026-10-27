import { describe, expect, it } from 'vitest'

import { productEventSchema } from './events'
import {
  deviceOf,
  pageOf,
  readShare,
  referrerHost,
  scrollDepth,
  shareUrl,
} from './visit'

describe('pageOf', () => {
  it('reads the list, the rewrite a query takes it to included', () => {
    expect(pageOf('/')).toEqual({ kind: 'list', slugs: [] })
    expect(pageOf('/with-query')).toEqual({ kind: 'list', slugs: [] })
  })

  it("reads a car's page and a comparison, with their slugs", () => {
    expect(pageOf('/bill/kia-ev3')).toEqual({
      kind: 'car',
      slugs: ['kia-ev3'],
    })
    expect(pageOf('/samanburdur/kia-ev3/skoda-elroq')).toEqual({
      kind: 'comparison',
      slugs: ['kia-ev3', 'skoda-elroq'],
    })
  })

  it('reads a slug as a page links to it, encoded or in capitals', () => {
    expect(pageOf('/bill/Kia-EV3').slugs).toEqual(['kia-ev3'])
    expect(pageOf('/bill/%C3%BEr%C3%B3un').slugs).toEqual(['þróun'])
    expect(pageOf('/bill/100%').slugs).toEqual(['100%'])
  })

  it('keeps no more slugs than a comparison holds', () => {
    expect(pageOf('/samanburdur/a/b/c/d/e/f').slugs).toEqual([
      'a',
      'b',
      'c',
      'd',
    ])
  })

  it('reads anything else as another page', () => {
    for (const path of ['/bill', '/bill/a/b', '/samanburdur', '/llms.txt']) {
      expect(pageOf(path)).toEqual({ kind: 'other', slugs: [] })
    }
  })
})

describe('deviceOf', () => {
  it('splits where the layout does', () => {
    expect(deviceOf(390)).toBe('phone')
    expect(deviceOf(767)).toBe('phone')
    expect(deviceOf(768)).toBe('tablet')
    expect(deviceOf(1024)).toBe('desktop')
  })
})

describe('scrollDepth', () => {
  it('measures to the bottom of the window', () => {
    expect(scrollDepth(0, 800, 3_200)).toBe(25)
    expect(scrollDepth(1_600, 800, 3_200)).toBe(75)
    expect(scrollDepth(2_400, 800, 3_200)).toBe(100)
  })

  it('reads a page shorter than the window, or overscrolled, as read', () => {
    expect(scrollDepth(0, 800, 600)).toBe(100)
    expect(scrollDepth(2_600, 800, 3_200)).toBe(100)
  })
})

describe('referrerHost', () => {
  it('names another site by its host', () => {
    expect(referrerHost('https://www.google.com/search?q=rafbíl', 'a.is')).toBe(
      'www.google.com',
    )
  })

  it('names none for the site itself, or none at all', () => {
    expect(referrerHost('https://a.is/bill/kia-ev3', 'a.is')).toBeUndefined()
    expect(referrerHost('', 'a.is')).toBeUndefined()
  })
})

describe('shareUrl and readShare', () => {
  it('reads back the share a link was made for', () => {
    const url = new URL(shareUrl('https://a.is/bill/kia-ev3', 'k3f9x2a1'))
    expect(readShare(url.search)).toEqual({
      shareId: 'k3f9x2a1',
      search: '',
      found: true,
    })
  })

  it('names only the latest share of a link opened from another', () => {
    const url = shareUrl('https://a.is/bill/kia-ev3?deilt=old1', 'new2')
    expect(new URL(url).searchParams.getAll('deilt')).toEqual(['new2'])
  })

  it('keeps the rest of the query', () => {
    expect(readShare('?verd=6000000&deilt=k3f9&rod=dragi')).toEqual({
      shareId: 'k3f9',
      search: '?verd=6000000&rod=dragi',
      found: true,
    })
    expect(readShare('?verd=6000000').found).toBe(false)
  })

  it('names no share the schema would refuse, though it still clears it', () => {
    for (const junk of ['', 'k3', 'K3F9X2', '<script>', 'a'.repeat(13)]) {
      expect(readShare(`?deilt=${encodeURIComponent(junk)}`)).toEqual({
        shareId: undefined,
        search: '',
        found: true,
      })
    }
  })

  it('names one the schema reads', () => {
    const { shareId } = readShare('?deilt=k3f9x2a1')
    const viewed = {
      name: 'page_viewed',
      viewId: 'a1b2',
      query: '',
      shareId,
      page: { kind: 'car', slugs: ['kia-ev3'] },
      ageMs: 0,
    }
    expect(productEventSchema.safeParse(viewed).success).toBe(true)
  })
})
