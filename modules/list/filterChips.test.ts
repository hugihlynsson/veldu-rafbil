import { describe, expect, it } from 'vitest'

import { activeChips, filterChipText } from './filterChips'

describe('activeChips', () => {
  it('stands the chips in their order, whatever order the filters came in', () => {
    expect(
      activeChips({ availability: 'available', seats: 7, name: ['Kia'] }).map(
        ({ name }) => name,
      ),
    ).toEqual(['name', 'seats', 'availability'])
  })
})

describe('filterChipText', () => {
  it('writes a price the way the list does', () => {
    expect(filterChipText('price', 6_500_000)).toEqual({
      label: 'Verð:',
      value: '↓6.500.000 kr.',
      removeLabel: 'Fjarlægja verðsíu: hámark 6.500.000 kr.',
    })
  })

  it('writes an acceleration to one decimal', () => {
    expect(filterChipText('acceleration', 7).value).toBe('↓7.0s')
  })
})
