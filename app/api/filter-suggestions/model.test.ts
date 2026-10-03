import { describe, expect, it, vi } from 'vitest'

import carFilter from '@/modules/list/carFilter'
import cars from '@/modules/data/cars'
import {
  APPLY_THRESHOLD,
  buildIntentQuestions,
  conservativeIndex,
  intentRequest,
  suggestFilters,
  suggestionsFromAnswers,
} from './model'
import type { Filters } from '@/modules/list/filters'

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

describe('the brackets, over the car data', () => {
  const questions = Object.values(buildIntentQuestions())
  const matches = (filters: Filters) => cars.filter(carFilter(filters)).length

  it.each(questions.map((question) => [question.key, question] as const))(
    'every %s option keeps some cars, each tighter than the one before',
    (_key, question) => {
      const counts = question.options.map((option) =>
        matches({ [question.key]: option.value }),
      )
      expect(counts.every((count) => count > 0)).toBe(true)
      if (question.ordered) {
        expect(counts).toEqual([...counts].sort((a, b) => b - a))
        expect(new Set(counts).size).toBe(counts.length)
      }
    },
  )

  it('names the figure a bracket filters on', () => {
    const price = buildIntentQuestions().price!
    const cheap = price.options.at(-1)!
    expect(cheap.description).toContain((cheap.value / 1_000_000).toFixed(1))
  })
})

describe('intentRequest', () => {
  it('asks about every filter but the ones the text set and the name', () => {
    const { state, questions } = intentRequest('ódýr', ['price', 'seats'])
    expect(state).toEqual({ request: 'ódýr' })
    expect(Object.keys(questions).sort()).toEqual([
      'acceleration',
      'availability',
      'drive',
      'fastcharge',
      'range',
      'value',
    ])
  })

  it('gives every question a way to say it does not apply', () => {
    const { questions } = intentRequest('ódýr', [])
    for (const question of Object.values(questions)) {
      expect(question.type).toBe('choice')
      expect(Object.keys(question.criteria)[0]).toBe('none')
    }
    expect(questions.drive.instructions).toContain('drive')
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
