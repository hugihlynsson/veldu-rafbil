import { describe, expect, it } from 'vitest'

import { neighboursOf } from './neighbours'

const [a, b, c] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

describe('neighboursOf', () => {
  it('finds the cars either side', () => {
    expect(neighboursOf([a, b, c], b)).toEqual({ previous: a, next: c })
  })

  it('has nothing past either end', () => {
    expect(neighboursOf([a, b, c], a)).toEqual({ previous: undefined, next: b })
    expect(neighboursOf([a, b, c], c)).toEqual({ previous: b, next: undefined })
  })

  // A car opened from the chat or a link that the filters leave out
  it('has none for a car not in the list', () => {
    expect(neighboursOf([a, c], b)).toEqual({})
  })
})
