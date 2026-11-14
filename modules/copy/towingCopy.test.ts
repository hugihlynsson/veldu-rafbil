import { describe, expect, it } from 'vitest'

import { towingFigure, towingText } from './towingCopy'

describe('towingFigure', () => {
  it('tells a figure from no towbar and from no figure at all', () => {
    expect(towingFigure(1500)).toBe('1.500 kg')
    expect(towingFigure(0)).toBe('Enginn krókur')
    expect(towingFigure(null)).toBe('Óþekkt')
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
