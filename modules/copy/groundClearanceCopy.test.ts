import { describe, expect, it } from 'vitest'

import {
  groundClearanceDetail,
  groundClearanceFigure,
  groundClearanceLine,
  groundClearanceText,
} from './groundClearanceCopy'

describe('groundClearanceFigure', () => {
  it('gives the figure in mm, or says it is not known', () => {
    expect(groundClearanceFigure({ mm: 186 })).toBe('186 mm')
    expect(groundClearanceFigure({ mm: 240, adjustable: true })).toBe('240 mm')
    expect(groundClearanceFigure(null)).toBe('Óþekkt')
  })
})

describe('groundClearanceDetail', () => {
  it('labels a raised air-suspension level, and nothing else', () => {
    expect(groundClearanceDetail({ mm: 240, adjustable: true })).toBe(
      'Hæsta stilling',
    )
    expect(groundClearanceDetail({ mm: 186 })).toBeUndefined()
    expect(groundClearanceDetail(null)).toBeUndefined()
  })
})

describe('groundClearanceLine', () => {
  it('says "up to" for a raised level', () => {
    expect(groundClearanceLine({ mm: 180 })).toBe('Veghæð 180 mm')
    expect(groundClearanceLine({ mm: 240, adjustable: true })).toBe(
      'Veghæð allt að 240 mm',
    )
    expect(groundClearanceLine(null)).toBe('Veghæð óþekkt')
  })
})

describe('groundClearanceText', () => {
  it('gives the figure in mm', () => {
    expect(groundClearanceText({ mm: 186 })).toBe('veghæð 186 mm')
  })

  // A model told only the number takes it for the height the car drives at
  it('says a raised figure is the air suspension at its highest', () => {
    expect(groundClearanceText({ mm: 240, adjustable: true })).toBe(
      'veghæð 240 mm í hæstu stillingu loftpúðafjöðrunar',
    )
  })

  it('says when there is no figure, rather than a number', () => {
    expect(groundClearanceText(null)).toBe('veghæð óþekkt')
  })
})
