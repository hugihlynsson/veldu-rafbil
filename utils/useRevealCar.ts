import { useEffect, useRef } from 'react'

import type { Car } from '@/modules/data/cars'
import carFilter, { filtersShowing } from '@/modules/list/carFilter'
import type { Filters } from '@/modules/list/filters'
import scrollToCenter from './scrollToCenter'

const revealCard = (id: string) => {
  const card = document.getElementById(id)
  if (!card) return
  scrollToCenter(card)
  // Without this the reader is scrolled somewhere their focus is not
  card.focus({ preventScroll: true })
}

/**
 * Scrolls to a car's card and focuses it. The chat can point at a car the
 * filters are hiding: those it fails are dropped, and its card is revealed
 * once the render without them has put it on the page.
 */
const useRevealCar = (
  filters: Filters,
  setFilters: (filters: Filters) => void,
): ((car: Car) => void) => {
  const pending = useRef<string | null>(null)

  useEffect(() => {
    if (!pending.current) return
    revealCard(pending.current)
    pending.current = null
  })

  return (car) => {
    if (carFilter(filters)(car)) return revealCard(car.id)
    pending.current = car.id
    setFilters(filtersShowing(filters, car))
  }
}

export default useRevealCar
