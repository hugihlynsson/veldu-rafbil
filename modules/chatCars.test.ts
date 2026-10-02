import { describe, expect, it } from 'vitest'

import cars from './cars'
import { carRef, getAnswerCars, resolveCarRefs } from './chatCars'
import {
  MAX_TAGGED_CARS,
  validateChatMessages,
  type ChatMessage,
} from './chatMessage'

const [first, second, third] = cars

const answer = (text: string, carIds?: string[]): ChatMessage => ({
  id: 'a',
  role: 'assistant',
  parts: [{ type: 'text', text }],
  ...(carIds && { metadata: { cars: carIds } }),
})

describe('carRef', () => {
  it('names every car once', () => {
    expect(new Set(cars.map(carRef)).size).toBe(cars.length)
  })

  it('is the id, short of what every id starts with', () => {
    expect(carRef(first)).toBe(first.id.slice('car-'.length))
  })
})

describe('resolveCarRefs', () => {
  it('turns refs into ids, in the order the model ranked them', () => {
    expect(resolveCarRefs([carRef(second), carRef(first)])).toEqual([
      second.id,
      first.id,
    ])
  })

  it('drops a ref that names no car', () => {
    expect(resolveCarRefs(['tesla-model-z', carRef(first), ''])).toEqual([
      first.id,
    ])
  })

  it('keeps a car tagged twice where it was first ranked', () => {
    expect(
      resolveCarRefs([carRef(first), carRef(second), carRef(first)]),
    ).toEqual([first.id, second.id])
  })

  it('reads a ref whatever its case', () => {
    expect(resolveCarRefs([carRef(first).toUpperCase()])).toEqual([first.id])
  })

  // More would fail the metadata schema, and the next request with it
  it('keeps no more than an answer may carry', () => {
    expect(resolveCarRefs(cars.map(carRef))).toHaveLength(MAX_TAGGED_CARS)
  })

  it('tags every car with an id the message schema takes', async () => {
    for (let at = 0; at < cars.length; at += MAX_TAGGED_CARS) {
      const ids = resolveCarRefs(
        cars.slice(at, at + MAX_TAGGED_CARS).map(carRef),
      )
      expect(await validateChatMessages([answer('Svar.', ids)])).not.toBeNull()
    }
  })
})

describe('getAnswerCars', () => {
  it('shows the tagged cars in their order, not the ones the text names', () => {
    expect(
      getAnswerCars(answer(`Um ${third.label}.`, [second.id, first.id])),
    ).toEqual([second, first])
  })

  it('leaves out a tagged car no longer on the list', () => {
    expect(getAnswerCars(answer('Svar.', ['car-farinn', first.id]))).toEqual([
      first,
    ])
  })

  // Answers stored before the tags, and ones the model tagged nothing in
  it('falls back to the cars the text names', () => {
    const text = `${first.make} ${first.model} er góður.`
    expect(getAnswerCars(answer(text))).toContain(first)
    expect(getAnswerCars(answer(text, ['car-farinn']))).toContain(first)
  })
})
