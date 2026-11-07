import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { describe, expect, it } from 'vitest'
import { markShown, shownAt, startShown } from './reveal'
import rehypeWords, { readWord } from './rehypeWords'

const render = (markdown: string, words: boolean) =>
  renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        rehypePlugins: words ? [[rehypeWords, { part: 2 }]] : [],
      },
      markdown,
    ),
  )

const wordsOf = (markdown: string) =>
  Array.from(
    render(markdown, true).matchAll(/data-word="([^"]+)">([^<]+)</g),
    ([, name, text = '']) => ({ word: readWord(name)!, text }),
  )

const decode = (html: string) =>
  html
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")

const answer = `Hér er **Kia EV3** og [Skoda Elroq](https://example.com), a\\*b og a*b.

- Drægni: 572 km, _um_ 30% &amp; meira
- Verð \`6.990.777 kr.\`

| Eiginleiki | EV3 |
| --- | --- |
| Hröðun | 6,6 sek |`

describe('rehypeWords', () => {
  it('names the words in the order of the markdown, each its own', () => {
    const offsets = wordsOf(answer).map(({ word }) => word.offset)
    expect(offsets.length).toBeGreaterThan(20)
    expect(offsets).toEqual([...offsets].sort((a, b) => a - b))
    expect(new Set(offsets).size).toBe(offsets.length)
  })

  // What the reveal stands on: a word arrives only where the stream has just
  // reached, so one already on screen never fades in a second time however
  // the markdown around it changes shape
  it('has a word arrive only where the answer has just reached', () => {
    const shown = startShown()
    for (let length = 1; length <= answer.length; length++) {
      const prefix = answer.slice(0, length)
      // Offsets count from a text's start in the rendered text, which leaves
      // out escapes, backticks and the rest of an entity
      const dropped = (prefix.match(/\\(?=\p{P})|`|(?<=&)\w+;/gu) ?? []).join(
        '',
      ).length
      const words = wordsOf(prefix).map(({ word, text }) => ({
        word,
        length: decode(text).length,
        arrivesAt: shownAt(shown, word) === undefined ? length : undefined,
      }))
      for (const { word, arrivesAt } of words) {
        if (arrivesAt === undefined) continue
        expect(word.offset, prefix).toBeLessThanOrEqual(length - 1)
        expect(word.offset, prefix).toBeGreaterThanOrEqual(length - 1 - dropped)
      }
      markShown(shown, words)
    }
  })

  it('changes nothing but the spans', () => {
    expect(
      render(answer, true).replaceAll(/<span data-word="[^"]+">|<\/span>/g, ''),
    ).toBe(render(answer, false))
  })
})

describe('readWord', () => {
  it('reads the names rehypeWords writes, and nothing else', () => {
    expect(readWord('2:14')).toEqual({ part: 2, offset: 14 })
    expect(readWord(undefined)).toBeUndefined()
    expect(readWord('2')).toBeUndefined()
    expect(readWord('a:b')).toBeUndefined()
  })
})
