import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { carSubtitle } from './subtitle'

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
