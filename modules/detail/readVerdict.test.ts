import { describe, expect, it } from 'vitest'

import { readVerdict } from './readVerdict'

describe('readVerdict', () => {
  it('reads the answer as a car review is read', () => {
    expect(readVerdict('**Kia** fer lengra.\n\nTesla hleður hraðar.')).toEqual({
      paragraphs: ['Kia fer lengra.', 'Tesla hleður hraðar.'],
    })
  })

  it('has nothing to show for an empty answer', () => {
    expect(readVerdict(' \n\n ')).toBeNull()
  })

  // What the page shows while it is written is the start of what it keeps
  it('reads an answer cut short as the start of the whole one', () => {
    const whole = '**Kia** fer lengra.\n\nTesla hleður hraðar.'
    for (let end = 1; end < whole.length; end++) {
      const shown = readVerdict(whole.slice(0, end))?.paragraphs ?? []
      const kept = readVerdict(whole)!.paragraphs
      shown.slice(0, -1).forEach((paragraph, index) => {
        expect(paragraph).toBe(kept[index])
      })
      const last = shown.at(-1)
      if (last)
        expect(kept[shown.length - 1]).toContain(last.replace(/\*$/, ''))
    }
  })
})
