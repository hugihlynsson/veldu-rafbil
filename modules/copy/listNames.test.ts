import { describe, expect, it } from 'vitest'

import { listNames } from './listNames'

describe('listNames', () => {
  // No comma before the last, as Icelandic has none there
  it('sets the last apart with og, and the rest with commas', () => {
    expect(listNames(['a', 'b', 'c'])).toBe('a, b og c')
    expect(listNames(['a', 'b'])).toBe('a og b')
  })

  it('asks between them with eða', () => {
    expect(listNames(['a', 'b', 'c'], 'eða')).toBe('a, b eða c')
  })

  it('gives one name as it is, and none as nothing', () => {
    expect(listNames(['a'])).toBe('a')
    expect(listNames([])).toBe('')
  })
})
