import { describe, expect, it } from 'vitest'
import type { TextStreamPart, ToolSet } from 'ai'
import {
  convertArrayToReadableStream,
  convertReadableStreamToArray,
} from 'ai/test'

import {
  createMarkerSplitter,
  markerTransform,
  splitMarkers,
  type AnswerMarkers,
} from './answerMarkers'

const answer = `Já, Toyota bZ4X er fjórhjóladrifinn.

| Bíll | Drif |
| --- | --- |
| bZ4X | AWD |

[car:toyota-bz4x-awd]
[car:toyota-bz4x-touring-awd]
[q:Hvað fer hann langt?]
[q:Er fjórhjóladrif nauðsynlegt fyrir innanbæjarakstur?]
[q:Hvaða aðrir sambærilegir bílar eru fjórhjóladrifnir?]
`

const clean = `Já, Toyota bZ4X er fjórhjóladrifinn.

| Bíll | Drif |
| --- | --- |
| bZ4X | AWD |`

const markers: AnswerMarkers = {
  followUps: [
    'Hvað fer hann langt?',
    'Er fjórhjóladrif nauðsynlegt fyrir innanbæjarakstur?',
    'Hvaða aðrir sambærilegir bílar eru fjórhjóladrifnir?',
  ],
  cars: ['toyota-bz4x-awd', 'toyota-bz4x-touring-awd'],
}

const streamed = (chunks: string[]) => {
  const splitter = createMarkerSplitter()
  const shown = chunks.map((chunk) => splitter.push(chunk))
  return {
    text: shown.join('') + splitter.end(),
    shown,
    ...splitter.found(),
  }
}

describe('splitting markers out of an answer', () => {
  it('takes the markers out and keeps what they held', () => {
    expect(splitMarkers(answer)).toEqual({ text: clean, ...markers })
  })

  // The provider cuts its chunks wherever it likes, markers included
  it('gives the same result however the stream is cut', () => {
    for (let cut = 1; cut < answer.length; cut++) {
      const result = streamed([answer.slice(0, cut), answer.slice(cut)])
      expect(result, `cut at ${cut}`).toMatchObject({ text: clean, ...markers })
    }
  })

  it('gives the same result a character at a time', () => {
    expect(streamed([...answer])).toMatchObject({ text: clean, ...markers })
  })

  // Nothing of a marker may flash on screen before it is recognised
  it('never shows part of a marker', () => {
    for (const chunk of streamed([...answer]).shown) {
      expect(chunk).not.toMatch(/\[|q:|car:/)
    }
  })

  it('leaves an answer without markers alone', () => {
    expect(splitMarkers('Hann fer 500 km.')).toEqual({
      text: 'Hann fer 500 km.',
      followUps: [],
      cars: [],
    })
  })

  it('keeps brackets that are not markers', () => {
    expect(splitMarkers('Sjá [hlekk](https://x.is), [q] og [car]').text).toBe(
      'Sjá [hlekk](https://x.is), [q] og [car]',
    )
  })

  it('keeps text the model wrote after a marker', () => {
    expect(splitMarkers('Fyrst [q:Spurning?] svo meira')).toEqual({
      text: 'Fyrst  svo meira',
      followUps: ['Spurning?'],
      cars: [],
    })
  })

  // The prompt asks for them after the answer, but the order is the ranking
  // wherever they sit
  it('takes car markers out of the prose too, in the order written', () => {
    expect(
      splitMarkers('Kia EV3 [car:kia-ev3-long-range] eða [car:byd-seal-base].'),
    ).toEqual({
      text: 'Kia EV3  eða .',
      followUps: [],
      cars: ['kia-ev3-long-range', 'byd-seal-base'],
    })
  })

  // Checking them against the car list is chatCars' job, not the splitter's
  it('keeps a car ref it does not know, and one written twice', () => {
    expect(splitMarkers('Svar.\n[car:ekki-til]\n[car:ekki-til]').cars).toEqual([
      'ekki-til',
      'ekki-til',
    ])
  })

  // An answer cut off by an error or a stop can end inside one
  it('drops a marker that never closed', () => {
    expect(splitMarkers('Svarið.\n[q:Hvað fer han')).toEqual({
      text: 'Svarið.',
      followUps: [],
      cars: [],
    })
    expect(splitMarkers('Svarið.\n[car:kia-ev').text).toBe('Svarið.')
  })

  it('does not let an unclosed [q: swallow the rest of the answer', () => {
    const long = `Texti [q: ${'orð '.repeat(100)}endir.`
    expect(splitMarkers(long).text).toBe(long)
    const car = `Texti [car: ${'orð '.repeat(30)}endir.`
    expect(splitMarkers(car).text).toBe(car)
  })

  it('ignores an empty marker', () => {
    expect(splitMarkers('Svar [q: ] [car:]')).toMatchObject({
      followUps: [],
      cars: [],
    })
  })
})

describe('markerTransform', () => {
  const run = async (parts: TextStreamPart<ToolSet>[]) => {
    const found: AnswerMarkers = { followUps: [], cars: [] }
    const out = await convertReadableStreamToArray(
      convertArrayToReadableStream(parts).pipeThrough(markerTransform(found)()),
    )
    return { out, found }
  }

  const textOf = (parts: TextStreamPart<ToolSet>[]) =>
    parts.map((part) => (part.type === 'text-delta' ? part.text : '')).join('')

  // A step that calls a tool and then answers streams two text parts
  it('collects the markers of every text part', async () => {
    const { found } = await run([
      { type: 'text-start', id: 'a' },
      { type: 'text-delta', id: 'a', text: 'Skoða.\n[car:kia-ev3-long-range]' },
      { type: 'text-end', id: 'a' },
      { type: 'text-start', id: 'b' },
      { type: 'text-delta', id: 'b', text: 'Svar.\n[car:byd-seal-base]' },
      { type: 'text-end', id: 'b' },
    ])

    expect(found.cars).toEqual(['kia-ev3-long-range', 'byd-seal-base'])
  })

  it('streams the answer without its markers and collects them', async () => {
    const { out, found } = await run([
      { type: 'text-start', id: 't' },
      { type: 'text-delta', id: 't', text: answer.slice(0, 60) },
      { type: 'text-delta', id: 't', text: answer.slice(60) },
      { type: 'text-end', id: 't' },
    ])

    expect(textOf(out)).toBe(clean)
    expect(found).toEqual(markers)
    expect(out.at(-1)).toEqual({ type: 'text-end', id: 't' })
  })

  it('passes everything that is not text through untouched', async () => {
    const reasoning: TextStreamPart<ToolSet> = {
      type: 'reasoning-delta',
      id: 'r',
      text: '[q:not a follow-up] [car:kia-ev3-long-range]',
    }
    const { out, found } = await run([reasoning])

    expect(out).toEqual([reasoning])
    expect(found).toEqual({ followUps: [], cars: [] })
  })
})
