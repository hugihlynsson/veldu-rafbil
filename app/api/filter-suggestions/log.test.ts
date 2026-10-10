import { describe, expect, it } from 'vitest'

import { suggestionsLogEvent, type SuggestionsTurn } from './log'

const turn = (over: Partial<SuggestionsTurn>): SuggestionsTurn => ({
  timestamp: '2026-10-09T12:00:00.000Z',
  text: 'fjórhjóladrif, 600',
  result: { suggestions: [], model: 'answered' },
  answers: undefined,
  inputTokens: undefined,
  superseded: false,
  millis: 250,
  model: 'jev-latest',
  environment: 'production',
  commit: 'd791754',
  ...over,
})

describe('suggestionsLogEvent', () => {
  it('records what the parser read and what it left for the model', () => {
    expect(suggestionsLogEvent(turn({})).parsed).toEqual({
      filters: { drive: ['AWD'] },
      unread: [],
      numbers: ['600'],
    })
  })

  it('lists each answer by the shares that are not zero, rounded', () => {
    const event = suggestionsLogEvent(
      turn({
        answers: {
          range: {
            type: 'choice',
            choice: 'at_least_600_km',
            confidence: 0.9,
            probabilities: {
              none: 0.0312,
              decent: 0.001,
              at_least_600_km: 0.9688,
            },
          },
          asksAdvisor: { type: 'noul', noul: 0.0712 },
        },
      }),
    )
    expect(event.answers).toEqual([
      { question: 'range', label: 'none', share: 0.03 },
      { question: 'range', label: 'at_least_600_km', share: 0.97 },
      { question: 'asksAdvisor', label: 'yes', share: 0.07 },
    ])
    expect(event.asksAdvisor).toBe(0.07)
  })

  it('has no answers when the model was not asked', () => {
    const event = suggestionsLogEvent(
      turn({ result: { suggestions: [], model: 'not-needed' } }),
    )
    expect(event.answers).toBeUndefined()
    expect(event.asksAdvisor).toBeUndefined()
  })
})
