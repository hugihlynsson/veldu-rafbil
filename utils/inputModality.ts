import { useEffect } from 'react'

type Modality = 'pointer' | 'keyboard'

// Whether the reader last pointed at something or pressed a key.
//
// The browser already knows: it is how :focus-visible decides whether to draw
// a ring. It will not answer for a text field though, where the pseudo-class
// matches however focus arrived, click included — so anything drawing its own
// ring around a text field has to keep track itself. The chat pill does.
//
// It lives outside React because it is a fact about the page rather than about
// any component: the chat input is unmounted and mounted again as it moves in
// and out of the dialog, and the gesture that moved it must not go with it.
let modality: Modality = 'pointer'
let isTracking = false

export const getInputModality = (): Modality => modality

const handlePointerDown = () => {
  modality = 'pointer'
}

const handleKeyDown = (event: KeyboardEvent) => {
  // A shortcut is aimed at the page, not at moving through it
  if (event.metaKey || event.ctrlKey || event.altKey) return
  modality = 'keyboard'
}

/**
 * Starts tracking, once per page. The listeners are passive, capturing so that
 * nothing can hide a gesture by stopping propagation on the way up, and are
 * never removed — the question outlives every component that asks it.
 */
const useInputModality = (): void => {
  useEffect(() => {
    if (isTracking) return
    isTracking = true
    window.addEventListener('pointerdown', handlePointerDown, {
      capture: true,
      passive: true,
    })
    window.addEventListener('keydown', handleKeyDown, {
      capture: true,
      passive: true,
    })
  }, [])
}

export default useInputModality
