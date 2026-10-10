import { describe, expect, it } from 'vitest'

import carFilter from '@/modules/list/carFilter'
import cars from '@/modules/data/cars'
import type { Filters } from '@/modules/list/filters'
import {
  ADVISOR_KEY,
  buildIntentQuestions,
  intentRequest,
  withNumbers,
} from './questions'

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
      ADVISOR_KEY,
      'drive',
      'fastcharge',
      'range',
      'value',
    ])
  })

  it('gives every filter question a way to say it does not apply', () => {
    const { questions } = intentRequest('ódýr', [])
    const { [ADVISOR_KEY]: advisor, ...filters } = questions
    expect(advisor.type).toBe('noul')
    for (const question of Object.values(filters)) {
      expect(question.type).toBe('choice')
      expect(Object.keys(question.criteria ?? {})[0]).toBe('none')
    }
    expect(filters.drive.instructions).toContain('drive')
  })

  it('asks nothing when the text set every filter', () => {
    const every = Object.keys(buildIntentQuestions()) as Array<keyof Filters>
    expect(intentRequest('x', every).questions).toEqual({})
  })
})

describe('withNumbers', () => {
  const stated = (numbers: string[]) =>
    Object.fromEntries(
      Object.values(withNumbers(numbers)).map((question) => [
        question.key,
        question.stated?.map((option) => option.value),
      ]),
    )

  it('offers a number to every filter it could be, as typed', () => {
    expect(stated(['8', '600'])).toEqual({
      price: [8_000_000],
      range: [600],
      seats: [8],
      drive: [],
      acceleration: [8],
      fastcharge: [8],
      value: [],
    })
  })

  it('reads a number spelled out, and shows it as a figure', () => {
    expect(stated(['atta']).seats).toEqual([8])
    expect(stated(['fimm']).price).toEqual([5_000_000])
    const { questions } = intentRequest('atta', [], withNumbers(['atta']))
    expect(
      (questions.seats.criteria as Record<string, string>).seats_8,
    ).toContain('"atta" (8)')
  })

  it('offers seats only for more people than nearly every car seats', () => {
    expect(stated(['4', '5', '6']).seats).toEqual([6])
  })

  it('reads a price written out or in millions', () => {
    expect(stated(['6.000.000', '6,5', '6.500']).price).toEqual([
      6_000_000, 6_500_000,
    ])
  })

  it('names the number in the request it stands for', () => {
    const { questions } = intentRequest('kemst 600', [], withNumbers(['600']))
    expect(questions.range.criteria).toHaveProperty('at_least_600_km')
    expect(
      (questions.range.criteria as Record<string, string>).at_least_600_km,
    ).toContain('The 600 in')
    expect(questions.range.instructions).toContain('number')
    expect(questions.drive.instructions).not.toContain('number')
  })
})
