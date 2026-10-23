import { describe, expect, it } from 'vitest'

import { deviceOf, pageOf, referrerHost, scrollDepth } from './visit'

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
