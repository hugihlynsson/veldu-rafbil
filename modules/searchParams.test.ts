import { describe, expect, it } from 'vitest'

import { first, list, oneOf } from './searchParams'

describe('first', () => {
  it('reads a plain parameter', () => {
    expect(first('verdi')).toBe('verdi')
  })

  // A parameter given more than once arrives as an array
  it('takes the first of a repeated parameter', () => {
    expect(first(['verdi', 'draegni'])).toBe('verdi')
  })

  it('has nothing to say about a parameter that is not there', () => {
    expect(first(undefined)).toBeUndefined()
    expect(first([])).toBeUndefined()
  })
})

describe('list', () => {
  it('splits the comma separated form', () => {
    expect(list('tesla,kia')).toEqual(['tesla', 'kia'])
  })

  it('accepts the repeated form too, and a mix of the two', () => {
    expect(list(['tesla', 'kia,volvo'])).toEqual(['tesla', 'kia', 'volvo'])
  })

  it('drops the whitespace and the empty entries', () => {
    expect(list(' tesla , , kia ')).toEqual(['tesla', 'kia'])
    expect(list(' , , ')).toEqual([])
    expect(list(undefined)).toEqual([])
  })
})

describe('oneOf', () => {
  const values = { faanlegir: 'available', vaentanlegir: 'expected' } as const

  it('maps a known value onto the field it stands for', () => {
    expect(oneOf('faanlegir', values)).toBe('available')
    expect(oneOf('vaentanlegir', values)).toBe('expected')
  })

  // An unreadable parameter is no filter, not the other one
  it('has nothing to say about a value it does not know', () => {
    expect(oneOf('kannski', values)).toBeUndefined()
    expect(oneOf(undefined, values)).toBeUndefined()
  })

  it('reads a repeated parameter as its first value', () => {
    expect(oneOf(['vaentanlegir', 'faanlegir'], values)).toBe('expected')
  })

  // Every object has one of these, and none of them is an Availability
  it('is not fooled by a name off the prototype', () => {
    expect(oneOf('toString', values)).toBeUndefined()
    expect(oneOf('constructor', values)).toBeUndefined()
  })
})
