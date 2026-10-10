import { describe, expect, it, vi } from 'vitest'

import {
  APPLY_THRESHOLD,
  conservativeIndex,
  suggestFilters,
  suggestionsFromAnswers,
} from './model'
import { ADVISOR_KEY, buildIntentQuestions, withNumbers } from './questions'

const choice = (probabilities: Record<string, number>) => ({
  type: 'choice',
  choice: Object.keys(probabilities)[0],
  confidence: 0.5,
  probabilities,
})

describe('conservativeIndex', () => {
  it('takes the tightest bracket that is too tight at most a fifth of the time', () => {
    expect(conservativeIndex([0.1, 0.3, 0.6])).toBe(1)
    expect(conservativeIndex([0, 0, 1])).toBe(2)
    expect(conservativeIndex([0.25, 0.25, 0.5])).toBe(0)
  })

  it('takes the loosest when everything is on it', () => {
    expect(conservativeIndex([1, 0, 0])).toBe(0)
  })
})

describe('suggestionsFromAnswers', () => {
  const price = buildIntentQuestions().price!
  const [notThePriciest, midPriced] = price.options

  it('suggests an ordered filter once enough is off "none"', () => {
    expect(
      suggestionsFromAnswers({
        price: choice({
          none: 0.3,
          not_the_priciest: 0.1,
          mid_priced: 0.5,
          cheap: 0.1,
        }),
      }),
    ).toEqual([
      {
        key: 'price',
        value: midPriced.value,
        source: 'model',
        probability: 0.7,
      },
    ])
  })

  it('leans loose when the guess is spread', () => {
    const [suggestion] = suggestionsFromAnswers({
      price: choice({
        none: 0,
        not_the_priciest: 0.3,
        mid_priced: 0.3,
        cheap: 0.4,
      }),
    })
    expect(suggestion.value).toBe(notThePriciest.value)
  })

  it('suggests nothing below the threshold', () => {
    expect(
      suggestionsFromAnswers({
        price: choice({ none: 1 - APPLY_THRESHOLD + 0.01, cheap: 0.39 }),
        drive: choice({
          none: 0.4,
          all_wheel_drive: 0.55,
          front_wheel_drive: 0.05,
        }),
      }),
    ).toEqual([])
  })

  it('picks an unordered filter outright', () => {
    expect(
      suggestionsFromAnswers({
        drive: choice({ none: 0.2, all_wheel_drive: 0.8 }),
      }),
    ).toEqual([
      { key: 'drive', value: ['AWD'], source: 'model', probability: 0.8 },
    ])
  })

  it('takes seven seats when the model leans there, rather than the safer five', () => {
    expect(
      suggestionsFromAnswers({
        seats: choice({ none: 0.01, five: 0.26, seven: 0.73 }),
      }),
    ).toEqual([{ key: 'seats', value: 7, source: 'model', probability: 0.73 }])
  })

  it('takes a number from the request as it stands', () => {
    expect(
      suggestionsFromAnswers(
        {
          range: choice({
            none: 0.1,
            decent: 0.2,
            long_trips: 0.1,
            at_least_600_km: 0.6,
          }),
        },
        withNumbers(['600']),
      ),
    ).toEqual([{ key: 'range', value: 600, source: 'model', probability: 0.9 }])
  })

  it('falls back to the brackets when they outweigh the number', () => {
    const [decent] = buildIntentQuestions().range!.options
    expect(
      suggestionsFromAnswers(
        {
          range: choice({
            none: 0.1,
            decent: 0.4,
            long_trips: 0.2,
            at_least_600_km: 0.3,
          }),
        },
        withNumbers(['600']),
      ),
    ).toEqual([
      { key: 'range', value: decent.value, source: 'model', probability: 0.9 },
    ])
  })

  it('picks a number for an unordered filter like any other option', () => {
    expect(
      suggestionsFromAnswers(
        { seats: choice({ none: 0.1, five: 0.1, seven: 0.1, seats_8: 0.7 }) },
        withNumbers(['8']),
      ),
    ).toEqual([{ key: 'seats', value: 8, source: 'model', probability: 0.7 }])
  })

  it('counts an option and a number for the same value as one answer', () => {
    expect(
      suggestionsFromAnswers(
        { seats: choice({ none: 0.2, seven: 0.4, seats_7: 0.4 }) },
        withNumbers(['7']),
      ),
    ).toEqual([{ key: 'seats', value: 7, source: 'model', probability: 0.8 }])
  })

  it('gives a number only to the filter surest of it', () => {
    expect(
      suggestionsFromAnswers(
        {
          price: choice({ none: 0.1, up_to_7000000_isk: 0.9 }),
          acceleration: choice({ none: 0.3, under_7_seconds: 0.7 }),
          range: choice({ none: 0.1, at_least_400_km: 0.9 }),
        },
        withNumbers(['7', '400']),
      ).map(({ key, value }) => [key, value]),
    ).toEqual([
      ['price', 7_000_000],
      ['range', 400],
    ])
  })

  it('offers only the numbers typed in a question to the advisor', () => {
    expect(
      suggestionsFromAnswers(
        {
          [ADVISOR_KEY]: { type: 'noul', noul: 0.9 },
          drive: choice({ none: 0, all_wheel_drive: 1 }),
          range: choice({ none: 0, at_least_600_km: 1 }),
        },
        withNumbers(['600']),
      ).map(({ key }) => key),
    ).toEqual(['range'])
  })

  it('gives a number to the filter surest of it over a bracket of that value', () => {
    expect(
      suggestionsFromAnswers(
        {
          price: choice({ none: 0, up_to_5000000_isk: 1 }),
          seats: choice({ none: 0.3, five: 0.7 }),
        },
        withNumbers(['fimm']),
      ).map(({ key }) => key),
    ).toEqual(['price'])
  })

  it('ignores answers it did not ask for, or cannot read', () => {
    expect(
      suggestionsFromAnswers({
        name: choice({ tesla: 1 }),
        price: { probabilities: 'all of them' },
        range: null,
        seats: choice({ none: Number.NaN, seven: -1 }),
      }),
    ).toEqual([])
  })
})

describe('suggestFilters', () => {
  it('does not ask when the text says it all', async () => {
    const ask = vi.fn()
    expect(await suggestFilters('7 sæta undir 9 milljónum', ask)).toEqual({
      suggestions: [
        { key: 'price', value: 9_000_000, source: 'text', probability: 1 },
        { key: 'seats', value: 7, source: 'text', probability: 1 },
      ],
      model: 'not-needed',
    })
    expect(ask).not.toHaveBeenCalled()
  })

  it('answers from the text without a model', async () => {
    expect(await suggestFilters('ódýr með 7 sætum', undefined)).toEqual({
      suggestions: [{ key: 'seats', value: 7, source: 'text', probability: 1 }],
      model: 'unavailable',
    })
  })

  it('answers from the text when the model fails', async () => {
    const ask = vi.fn().mockRejectedValue(new Error('timeout'))
    const result = await suggestFilters('ódýr með 7 sætum', ask)
    expect(result.model).toBe('failed')
    expect(result.suggestions).toHaveLength(1)
  })

  it('asks the model about a number the text left, as an option', async () => {
    const ask = vi.fn().mockResolvedValue({
      answers: { range: choice({ none: 0, at_least_600_km: 1 }) },
    })
    const result = await suggestFilters('fjórhjóladrif, 600', ask)

    expect(ask.mock.calls[0][0].questions.range.criteria).toHaveProperty(
      'at_least_600_km',
    )
    expect(result.suggestions).toEqual([
      { key: 'drive', value: ['AWD'], source: 'text', probability: 1 },
      { key: 'range', value: 600, source: 'model', probability: 1 },
    ])
  })

  it('asks the model only about what the text left open', async () => {
    const ask = vi.fn().mockResolvedValue({
      answers: {
        price: choice({ none: 0, cheap: 1 }),
        seats: choice({ none: 0, five: 1 }),
      },
    })
    const result = await suggestFilters('ódýr með 7 sætum', ask)

    expect(Object.keys(ask.mock.calls[0][0].questions)).not.toContain('seats')
    expect(result.model).toBe('answered')
    expect(result.suggestions.map(({ key, source }) => [key, source])).toEqual([
      ['seats', 'text'],
      ['price', 'model'],
    ])
  })
})
