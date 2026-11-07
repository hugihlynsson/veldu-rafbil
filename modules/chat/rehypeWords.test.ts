import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { describe, expect, it } from 'vitest'
import rehypeWords from './rehypeWords'

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

const answer = `Hér er **Kia EV3** og [Skoda Elroq](https://example.com).

- Drægni: 572 km
- Verð \`6.990.777 kr.\`

| Eiginleiki | EV3 |
| --- | --- |
| Hröðun | 6,6 sek |`

describe('rehypeWords', () => {
  it('names each word after where it starts in the markdown', () => {
    const words = [
      ...render(answer, true).matchAll(/data-word="2:(\d+)">([^<]+)</g),
    ]
    expect(words.length).toBeGreaterThan(15)
    for (const [, offset, word = ''] of words) {
      expect(answer.slice(Number(offset))).toMatch(
        new RegExp(`^${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
      )
    }
  })

  it('gives every word its own name', () => {
    const names = [...render(answer, true).matchAll(/data-word="([^"]+)"/g)]
    expect(new Set(names.map(([, name]) => name)).size).toBe(names.length)
  })

  it('changes nothing but the spans', () => {
    expect(
      render(answer, true).replaceAll(/<span data-word="[^"]+">|<\/span>/g, ''),
    ).toBe(render(answer, false))
  })
})
