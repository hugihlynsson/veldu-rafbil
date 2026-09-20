import { useEffect } from 'react'

type Modality = 'pointer' | 'keyboard'

// :focus-visible will not answer for a text field, and this outlives the chat
// input, which is remounted as it moves in and out of the dialog.
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

/** Starts tracking once per page; capturing, so no gesture can be hidden */
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
