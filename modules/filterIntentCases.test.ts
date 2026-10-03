import { describe, expect, it } from 'vitest'

import { parseFilterIntent } from './filterIntent'
import {
  bracketValues,
  intentCases,
  scoreCase,
  summarize,
} from './filterIntentCases'

const literal = intentCases.filter((testCase) => testCase.kind === 'literal')

describe('the eval set', () => {
  // A label that names no option would score every answer as wrong
  it('names only brackets the model is offered', () => {
    const unknown = intentCases.flatMap((testCase) =>
      Object.entries(testCase.expect).flatMap(([key, expected]) =>
        expected && typeof expected === 'object' && 'oneOf' in expected
          ? expected.oneOf
              .filter(
                (label) =>
                  !bracketValues(key as keyof typeof testCase.expect).has(
                    label,
                  ),
              )
              .map((label) => `${testCase.text}: ${key} ${label}`)
          : [],
      ),
    )
    expect(unknown).toEqual([])
  })

  it('scores a bracket by the value it stands for', () => {
    const testCase = intentCases.find(
      ({ text }) => text === 'ódýrasti bíllinn',
    )!
    const cheap = bracketValues('price').get('cheap') as number
    const loose = bracketValues('price').get('not_the_priciest') as number

    expect(scoreCase(testCase, { price: cheap }).right).toEqual(['price'])
    expect(scoreCase(testCase, { price: loose }).wrong).toEqual(['price'])
  })
})

describe('the parser on the eval set', () => {
  it.each(literal.map((testCase) => [testCase.text, testCase] as const))(
    'reads everything %j says outright',
    (_text, testCase) => {
      const score = scoreCase(
        testCase,
        parseFilterIntent(testCase.text).filters,
      )
      expect(score).toEqual({
        right: Object.keys(testCase.expect),
        wrong: [],
        missed: [],
        extra: [],
      })
    },
  )

  // Whatever it does read must be right, as a suggestion from the text is
  // offered even when it matches no car
  it.each(intentCases.map((testCase) => [testCase.text, testCase] as const))(
    'never misreads %j',
    (_text, testCase) => {
      const score = scoreCase(
        testCase,
        parseFilterIntent(testCase.text).filters,
      )
      expect({ wrong: score.wrong, extra: score.extra }).toEqual({
        wrong: [],
        extra: [],
      })
    },
  )

  it('asks a model about a literal request only for the words left over', () => {
    const unread = literal
      .filter((testCase) => parseFilterIntent(testCase.text).unread.length)
      .map((testCase) => testCase.text)
    // Words that might mean more, which a model is asked about
    expect(unread).toEqual([
      'fimm manna fjölskylda, 600 km',
      'fjórhjóladrifinn fyrir veturinn, 7 sæti',
      'nýjustu bílarnir sem eru á leiðinni',
    ])
  })

  it('scores the whole set', () => {
    const summary = summarize(
      intentCases.map((testCase) =>
        scoreCase(testCase, parseFilterIntent(testCase.text).filters),
      ),
    )
    expect(summary.precision).toBe(1)
    expect(summary.exact).toBeGreaterThanOrEqual(literal.length)
  })
})
