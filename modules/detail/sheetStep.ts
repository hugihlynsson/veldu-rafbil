export type SheetStep = 'previous' | 'next'

type Key = Pick<
  KeyboardEvent,
  | 'key'
  | 'repeat'
  | 'defaultPrevented'
  | 'altKey'
  | 'ctrlKey'
  | 'metaKey'
  | 'shiftKey'
>

/**
 * The car an arrow key steps the sheet to. Not with a modifier, which the
 * browser and the system keep for themselves (Cmd+Left is back), nor while held,
 * which would fetch the photo of every car it passes.
 */
export const stepOfKey = (key: Key): SheetStep | null => {
  if (
    key.defaultPrevented ||
    key.repeat ||
    key.altKey ||
    key.ctrlKey ||
    key.metaKey ||
    key.shiftKey
  ) {
    return null
  }
  if (key.key === 'ArrowLeft') return 'previous'
  if (key.key === 'ArrowRight') return 'next'
  return null
}
