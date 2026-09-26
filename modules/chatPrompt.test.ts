import { describe, expect, it } from 'vitest'

import systemPrompt from './chatPrompt'
import cars from './cars'
import { grantAmountText } from './grantCopy'
import { realRangeHighFactor, realRangeLowFactor } from './globals'

describe('the assistant system prompt', () => {
  it('lists every car by its label and the price a buyer pays', () => {
    for (const car of cars) {
      expect(systemPrompt, car.id).toContain(
        `${car.label}: ${car.priceWithGrant.toLocaleString('is-IS')} kr`,
      )
    }
  })

  it('counts the cars from the list', () => {
    expect(systemPrompt).toContain(`upplýsingum um ${cars.length} rafbíla`)
  })

  it('names the grant the prices actually use', () => {
    expect(systemPrompt).toContain(grantAmountText)
  })

  // /api/cars and llms.txt quote the same bounds; the prompt once had its own
  it('quotes the real-range bounds the published data uses', () => {
    const low = Math.round(realRangeLowFactor * 100)
    const high = Math.round(realRangeHighFactor * 100)
    expect(systemPrompt).toContain(`${low}%-${high}% af WLTP`)
  })

  // A marker the chat UI would render as text rather than a follow-up chip
  it('asks for follow-ups in the format the chat parses', () => {
    expect(systemPrompt).toMatch(/\[q:[^\]]+\]/)
  })
})
