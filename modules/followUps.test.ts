import { describe, expect, it } from 'vitest'
import type { TextStreamPart, ToolSet } from 'ai'
import {
  convertArrayToReadableStream,
  convertReadableStreamToArray,
} from 'ai/test'

import {
  createFollowUpSplitter,
  followUpTransform,
  splitFollowUps,
} from './followUps'

const answer = `Já, Toyota bZ4X er fjórhjóladrifinn.

| Bíll | Drif |
| --- | --- |
| bZ4X | AWD |

[q:Hvað fer hann langt?]
[q:Er fjórhjóladrif nauðsynlegt fyrir innanbæjarakstur?]
[q:Hvaða aðrir sambærilegir bílar eru fjórhjóladrifnir?]
`

const clean = `Já, Toyota bZ4X er fjórhjóladrifinn.

| Bíll | Drif |
| --- | --- |
| bZ4X | AWD |`

const questions = [
  'Hvað fer hann langt?',
  'Er fjórhjóladrif nauðsynlegt fyrir innanbæjarakstur?',
  'Hvaða aðrir sambærilegir bílar eru fjórhjóladrifnir?',
]

const streamed = (chunks: string[]) => {
  const splitter = createFollowUpSplitter()
  const shown = chunks.map((chunk) => splitter.push(chunk))
  return {
    text: shown.join('') + splitter.end(),
    shown,
    questions: splitter.questions(),
  }
}

describe('splitting follow-ups out of an answer', () => {
  it('takes the markers out and keeps the questions', () => {
    expect(splitFollowUps(answer)).toEqual({ text: clean, questions })
  })

  // The provider cuts its chunks wherever it likes, markers included
  it('gives the same result however the stream is cut', () => {
    for (let cut = 1; cut < answer.length; cut++) {
      const result = streamed([answer.slice(0, cut), answer.slice(cut)])
      expect(result.text, `cut at ${cut}`).toBe(clean)
      expect(result.questions, `cut at ${cut}`).toEqual(questions)
    }
  })

  it('gives the same result a character at a time', () => {
    const result = streamed([...answer])
    expect(result.text).toBe(clean)
    expect(result.questions).toEqual(questions)
  })

  // Nothing of a marker may flash on screen before it is recognised
  it('never shows part of a marker', () => {
    for (const chunk of streamed([...answer]).shown) {
      expect(chunk).not.toMatch(/\[|q:/)
    }
  })

  it('leaves an answer without markers alone', () => {
    expect(splitFollowUps('Hann fer 500 km.')).toEqual({
      text: 'Hann fer 500 km.',
      questions: [],
    })
  })

  it('keeps brackets that are not markers', () => {
    expect(splitFollowUps('Sjá [hlekk](https://x.is) og [q]').text).toBe(
      'Sjá [hlekk](https://x.is) og [q]',
    )
  })

  it('keeps text the model wrote after a marker', () => {
    expect(splitFollowUps('Fyrst [q:Spurning?] svo meira')).toEqual({
      text: 'Fyrst  svo meira',
      questions: ['Spurning?'],
    })
  })

  // An answer cut off by an error or a stop can end inside one
  it('drops a marker that never closed', () => {
    expect(splitFollowUps('Svarið.\n[q:Hvað fer han')).toEqual({
      text: 'Svarið.',
      questions: [],
    })
  })

  it('does not let an unclosed [q: swallow the rest of the answer', () => {
    const long = `Texti [q: ${'orð '.repeat(100)}endir.`
    expect(splitFollowUps(long).text).toBe(long)
  })

  it('ignores an empty marker', () => {
    expect(splitFollowUps('Svar [q: ]').questions).toEqual([])
  })
})

describe('followUpTransform', () => {
  const run = async (parts: TextStreamPart<ToolSet>[]) => {
    const found: string[] = []
    const out = await convertReadableStreamToArray(
      convertArrayToReadableStream(parts).pipeThrough(
        followUpTransform(found)(),
      ),
    )
    return { out, found }
  }

  const textOf = (parts: TextStreamPart<ToolSet>[]) =>
    parts.map((part) => (part.type === 'text-delta' ? part.text : '')).join('')

  it('streams the answer without its markers and collects them', async () => {
    const { out, found } = await run([
      { type: 'text-start', id: 't' },
      { type: 'text-delta', id: 't', text: answer.slice(0, 60) },
      { type: 'text-delta', id: 't', text: answer.slice(60) },
      { type: 'text-end', id: 't' },
    ])

    expect(textOf(out)).toBe(clean)
    expect(found).toEqual(questions)
    expect(out.at(-1)).toEqual({ type: 'text-end', id: 't' })
  })

  it('passes everything that is not text through untouched', async () => {
    const reasoning: TextStreamPart<ToolSet> = {
      type: 'reasoning-delta',
      id: 'r',
      text: '[q:not a follow-up]',
    }
    const { out, found } = await run([reasoning])

    expect(out).toEqual([reasoning])
    expect(found).toEqual([])
  })
})
