import { describe, expect, it } from 'vitest'

import { stepOfKey } from './sheetStep'

const press = (
  key: string,
  over: Partial<Parameters<typeof stepOfKey>[0]> = {},
) =>
  stepOfKey({
    key,
    repeat: false,
    defaultPrevented: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    ...over,
  })

describe('stepOfKey', () => {
  it('steps with the left and right arrows', () => {
    expect(press('ArrowLeft')).toBe('previous')
    expect(press('ArrowRight')).toBe('next')
  })

  it('leaves every other key alone', () => {
    expect(press('ArrowUp')).toBeNull()
    expect(press('ArrowDown')).toBeNull()
    expect(press('Enter')).toBeNull()
  })

  it('leaves an arrow with a modifier to the browser', () => {
    for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
      expect(press('ArrowLeft', { [modifier]: true })).toBeNull()
    }
  })

  it('does not run through the list while an arrow is held', () => {
    expect(press('ArrowRight', { repeat: true })).toBeNull()
  })

  it('leaves an arrow that something else has handled', () => {
    expect(press('ArrowRight', { defaultPrevented: true })).toBeNull()
  })
})
