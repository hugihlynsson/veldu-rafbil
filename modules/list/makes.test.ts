import { describe, expect, it } from 'vitest'

import { liftMakes, makes, rowMakes } from './makes'

describe('rowMakes', () => {
  it('holds only makes on the list, spelled as the data spells them', () => {
    for (const make of rowMakes) expect(makes).toContain(make)
  })
})

describe('liftMakes', () => {
  it('moves a name that is a make to the makes', () => {
    expect(liftMakes({ name: ['tesla'] })).toEqual({ make: ['Tesla'] })
  })

  it('adds a typed make to the ones chosen', () => {
    expect(liftMakes({ make: ['Kia'], name: ['tesla'] })).toEqual({
      make: ['Kia', 'Tesla'],
    })
  })

  it('reads a make by what people call it', () => {
    expect(liftMakes({ name: ['vw', 'benz', 'range rover'] })).toEqual({
      make: ['Volkswagen', 'Mercedes-Benz', 'Range Rover'],
    })
  })

  it('keeps a model where it is, a make named with it too', () => {
    expect(liftMakes({ name: ['enyaq', 'kia ev3'] })).toEqual({
      name: ['enyaq', 'kia ev3'],
    })
  })

  it('splits makes typed as one name before lifting them', () => {
    expect(liftMakes({ name: ['byd kia tesla'] })).toEqual({
      make: ['BYD', 'Kia', 'Tesla'],
    })
  })

  it('spells a make in a link as the data does, so the row finds it', () => {
    expect(liftMakes({ make: ['xpeng', 'kia', 'Kia'] })).toEqual({
      make: ['XPENG', 'Kia'],
    })
  })

  it('keeps a make it does not know, which matches no car', () => {
    expect(liftMakes({ make: ['Honda'] })).toEqual({ make: ['Honda'] })
  })

  it('leaves the other filters alone', () => {
    expect(liftMakes({ price: 6_000_000, seats: 7 })).toEqual({
      price: 6_000_000,
      seats: 7,
    })
  })
})
