import { describe, expect, it } from 'vitest'

import {
  towingCell,
  towingClause,
  towingFigure,
  towingText,
} from './towingCopy'

describe('towingFigure', () => {
  it('tells a figure from no towbar and from no figure at all', () => {
    expect(towingFigure(1500)).toBe('1.500 kg')
    expect(towingFigure(0)).toBe('Enginn krókur')
    expect(towingFigure(null)).toBe('Óþekkt')
  })
})

describe('towingClause', () => {
  // A review says nothing it has no figure for
  it('says nothing of a car whose figure is not known', () => {
    expect(towingClause(1500)).toBe('má draga 1.500 kg')
    expect(towingClause(0)).toBe('má ekki draga kerru')
    expect(towingClause(null)).toBeUndefined()
  })
})

describe('towingText', () => {
  it('gives the figure in kg', () => {
    expect(towingText(1500)).toBe('dráttargeta 1.500 kg')
  })

  // A model told "0 kg" has read it as a missing figure and guessed
  it('says a car that takes no towbar has none', () => {
    expect(towingText(0)).toBe('enginn dráttarkrókur')
  })

  it('says when there is no figure, rather than a number', () => {
    expect(towingText(null)).toBe('dráttargeta óþekkt')
  })
})

describe('towingCell', () => {
  it('gives the figure alone, as its heading names the unit', () => {
    expect(towingCell(1500)).toBe('1.500')
  })

  it('tells no towbar from a figure not known', () => {
    expect(towingCell(0)).toBe('enginn dráttarkrókur')
    expect(towingCell(null)).toBe('óþekkt')
  })
})
