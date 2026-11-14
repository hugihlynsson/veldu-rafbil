import { describe, expect, it } from 'vitest'

import { listHeadline, listLead } from './listHeadline'

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

describe('listLead', () => {
  it('counts the cars in the plural', () => {
    expect(listLead(224)).toBe(
      'Allir 224 rafbílarnir sem seldir eru nýir á Íslandi',
    )
    expect(listLead(211)).toBe(
      'Allir 211 rafbílarnir sem seldir eru nýir á Íslandi',
    )
  })

  it('agrees with a count ending in 1', () => {
    expect(listLead(221)).toBe(
      'Allur 221 rafbíllinn sem seldur er nýr á Íslandi',
    )
  })
})
