import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { carSubtitle, deprecatedNotice } from './subtitle'

describe('carSubtitle', () => {
  const [car] = cars

  it('names the variant and when it arrives', () => {
    expect(
      carSubtitle({ ...car, subModel: 'Pro', expectedDelivery: 'Lok 2026' }),
    ).toBe('Pro · Væntanlegur lok 2026')
  })

  it('is empty for a car with neither', () => {
    expect(
      carSubtitle({ ...car, subModel: undefined, expectedDelivery: undefined }),
    ).toBe('')
  })
})

describe('deprecatedNotice', () => {
  const [car] = cars

  it('says since when a car is no longer sold new', () => {
    expect(deprecatedNotice({ ...car, deprecated: '2026-10-11' })).toBe(
      'Ekki seldur nýr síðan í október 2026',
    )
  })

  it('says nothing of a car still sold', () => {
    expect(deprecatedNotice({ ...car, deprecated: undefined })).toBeUndefined()
  })
})
