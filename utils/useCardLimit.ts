import { startTransition, useEffect, useState } from 'react'

// Enough to fill a tall desktop's grid, three across, and a phone's first
// several screens
const FIRST_CARDS = 12

// Once the whole list has been in this document, a return to it from a car's
// page renders every card at once, so the scroll it comes back to exists
let shownWhole = false

/**
 * How many of the list's cards to render. The HTML and the hydration carry
 * the first few only: every card made 1.2 MB of HTML, some 8,500 elements, and
 * a hydration that held a phone's first taps. The rest follow in a transition
 * right after, which yields to anything the reader does first.
 */
export default function useCardLimit(): number | undefined {
  const [whole, setWhole] = useState(shownWhole)

  useEffect(() => {
    if (whole) return
    shownWhole = true
    startTransition(() => setWhole(true))
  }, [whole])

  return whole ? undefined : FIRST_CARDS
}
