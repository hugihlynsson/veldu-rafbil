import { useRef, useState } from 'react'
import { getInputModality } from '@/utils/inputModality'

/**
 * What the chat input holds that has to outlive it. One input stands on the
 * page and another in the dialog, as showModal() makes everything outside the
 * dialog inert, so each move between them is a new element.
 */
const useComposer = () => {
  const ref = useRef<HTMLInputElement>(null)
  const shouldFocus = useRef<boolean>(false)
  const [draft, setDraft] = useState<string>('')
  const [showFocusRing, setShowFocusRing] = useState<boolean>(false)

  // The node the dialog would hand focus back to is gone by the time it
  // closes, so the new one claims the focus as it arrives
  const inputRef = (node: HTMLInputElement | null) => {
    ref.current = node
    if (node && shouldFocus.current) {
      shouldFocus.current = false
      node.focus()
      // Focus handed back on close is the reader carrying on, not arriving
      setShowFocusRing(false)
    }
  }

  return {
    ref,
    /** Focuses the next input to arrive, which is the reader's way back */
    // Not on a touch screen: a focus outside the tap raises no keyboard there,
    // and the bar would sit widened for a focus nobody can see
    focusOnArrival: () => {
      shouldFocus.current = getInputModality() !== 'touch'
    },
    inputProps: {
      inputRef,
      value: draft,
      onValueChange: setDraft,
      showFocusRing,
      onFocusRingChange: setShowFocusRing,
    },
  }
}

export default useComposer
