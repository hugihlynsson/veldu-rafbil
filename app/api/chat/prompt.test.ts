import { describe, expect, it } from 'vitest'

import systemPrompt from './prompt'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import cars from '@/modules/data/cars'
import { carRef, resolveCarRefs } from '@/modules/chat/cars'
import { grantAmountText } from '@/modules/copy/grantCopy'
import { realRangeHighFactor, realRangeLowFactor } from '@/modules/data/globals'

describe('the assistant system prompt', () => {
  const lines = systemPrompt.split('\n')
  const lineOf = (car: (typeof cars)[number]) =>
    lines.find((line) => line.startsWith(`${car.label}: `))

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
    for (const car of cars) {
      const line = lineOf(car)
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

  // The ref is copied off this line into a [car:…] marker, and has to come
  // back as the car it sits beside
  it('gives every car the ref its marker resolves to', () => {
    for (const car of cars) {
      expect(lineOf(car), car.id).toContain(`(auðkenni: ${carRef(car)})`)
      expect(resolveCarRefs([carRef(car)])).toEqual([car.id])
    }
  })

  // An example naming a car no longer on the list teaches a ref that is dropped
  it('asks for car markers by an example of a real one', () => {
    const examples = [...systemPrompt.matchAll(/\[car:([^\]<]+)\]/g)].map(
      (match) => match[1],
    )
    expect(examples.length).toBeGreaterThan(0)
    expect(resolveCarRefs(examples)).toHaveLength(examples.length)
  })

  // After the answer, where the order they come in is the ranking rather than
  // whichever car the text happened to name first
  it('shows the car markers after the answer, before the follow-ups', () => {
    const example = systemPrompt.slice(systemPrompt.indexOf('TIL DÆMIS'))
    expect(example.indexOf('[car:')).toBeLessThan(example.indexOf('[q:'))
  })
})
