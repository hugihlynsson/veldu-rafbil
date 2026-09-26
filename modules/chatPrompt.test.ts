import { describe, expect, it } from 'vitest'

import systemPrompt from './chatPrompt'
import addDecimalSeparators from './addDecimalSeparators'
import cars from './cars'
import { grantAmountText } from './grantCopy'
import { realRangeHighFactor, realRangeLowFactor } from './globals'

describe('the assistant system prompt', () => {
  it('lists every car by its label and the price a buyer pays', () => {
    for (const car of cars) {
      expect(systemPrompt, car.id).toContain(
        `${car.label}: ${addDecimalSeparators(car.priceWithGrant)} kr`,
      )
    }
  })

  // Without them a question about charging was answered from the model's
  // memory, and could disagree with the card beside the chat
  it('gives every car the battery and fast-charge figures its card shows', () => {
    const lines = systemPrompt.split('\n')
    for (const car of cars) {
      const line = lines.find((line) => line.startsWith(`${car.label}: `))
      expect(line, car.id).toContain(`${car.capacity} kWh`)
      expect(line, car.id).toContain(`${car.timeToCharge10To80} mín`)
      expect(line, car.id).toContain(`${car.kmPerMinuteCharged} km/mín`)
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
