import { describe, expect, it } from 'vitest'

import { listHeadline } from './listHeadline'

describe('listHeadline', () => {
  it('counts the cars in the plural', () => {
    expect(listHeadline(204)).toBe(
      'Allir 204 rafbílarnir sem seldir eru á Íslandi',
    )
    expect(listHeadline(211)).toBe(
      'Allir 211 rafbílarnir sem seldir eru á Íslandi',
    )
  })

  it('agrees with a count ending in 1', () => {
    expect(listHeadline(201)).toBe(
      'Allur 201 rafbíllinn sem seldur er á Íslandi',
    )
  })
})
