import { describe, expect, it } from 'vitest'

import type { RankedSuggestion } from '@/modules/list/filterSuggestions'
import {
  suggestionOutcome,
  type ShownSuggestions,
} from '@/modules/list/suggestionOutcome'
import { outcomeSchema } from './outcome'

const pills: RankedSuggestion[] = [
  { key: 'seats', value: 7, source: 'text', probability: 1, count: 26 },
  {
    key: 'drive',
    value: ['AWD'],
    source: 'model',
    probability: 0.82,
    count: 90,
  },
]

const shown: ShownSuggestions = {
  text: '7 sæta fyrir veturinn',
  requestId: '6f1c8a52-3e0b-4d5e-9a57-0f2b6c1d9e44',
  suggestions: pills,
  shownAt: 1_000,
}

describe('outcomeSchema', () => {
  it('reads what the client sends for each outcome', () => {
    for (const outcome of [
      suggestionOutcome('applied', shown, 2_400.4, 'drive'),
      suggestionOutcome('appliedAll', shown, 2_400),
      suggestionOutcome('sent', { ...shown, requestId: undefined }, 2_400),
    ]) {
      expect(outcomeSchema.parse(outcome)).toEqual(outcome)
    }
    expect(suggestionOutcome('sent', shown, 2_400.4).shownMs).toBe(1_400)
  })

  it('refuses a tap on a pill that was not shown, or a tap on none', () => {
    expect(
      outcomeSchema.safeParse(suggestionOutcome('applied', shown, 2_000))
        .success,
    ).toBe(false)
    expect(
      outcomeSchema.safeParse(
        suggestionOutcome('applied', shown, 2_000, 'price'),
      ).success,
    ).toBe(false)
    expect(
      outcomeSchema.safeParse(suggestionOutcome('sent', shown, 2_000, 'seats'))
        .success,
    ).toBe(false)
  })

  // The body goes to the logs as it came, so nothing in it is taken on trust
  it('refuses a pill that is no filter, and anything extra', () => {
    const outcome = suggestionOutcome('sent', shown, 2_000)
    for (const body of [
      { ...outcome, extra: 'x' },
      { ...outcome, suggestions: [] },
      { ...outcome, suggestions: [{ ...pills[0], value: 'sjö' }] },
      { ...outcome, suggestions: [{ ...pills[0], key: 'colour' }] },
      { ...outcome, suggestions: [{ ...pills[0], count: -1 }] },
      { ...outcome, suggestions: Array(5).fill(pills[0]) },
      { ...outcome, requestId: 'not-a-uuid' },
      { ...outcome, text: 'a'.repeat(1_000) },
    ]) {
      expect(outcomeSchema.safeParse(body).success).toBe(false)
    }
  })

  it('logs a pill as its parser reads it, and nothing else it carries', () => {
    const parsed = outcomeSchema.parse({
      ...suggestionOutcome('sent', shown, 2_000),
      suggestions: [{ ...pills[1], note: 'x' }],
    })
    expect(parsed.suggestions).toEqual([pills[1]])
  })
})
