'use client'

import type { FunctionComponent } from 'react'
import { useRouter } from 'next/navigation'

import type { Car } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'
import useChatSettings from '@/utils/chatSlot'
import prefersReducedMotion from '@/utils/prefersReducedMotion'

interface Props {
  /**
   * The car whose page this is, or the cars compared. None for a page about
   * no car in particular, such as the updates, whose questions go as the
   * list's do: the advisor would take several for a comparison
   */
  cars?: ReadonlyArray<Car>
  /** Written with the car's review; the general ones without it */
  starters?: ReadonlyArray<string>
}

/**
 * The advisor's bar on a page other than the list, carrying the cars the page
 * is about, if any, with each question. It draws nothing: the bar is the root
 * layout's, so it stays in place from one page to the next. A car picked from
 * an answer opens its own page, unless it is the car whose page this is,
 * which is scrolled up to.
 */
const PageChat: FunctionComponent<Props> = ({ cars, starters }) => {
  const router = useRouter()

  const showCar = (car: Car) => {
    // By id: the page's cars came from the server, a picked one from the
    // client's own list, so they are never the same object
    if (cars?.length === 1 && cars[0]?.id === car.id) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    } else {
      router.push(carPathOf(car))
    }
  }

  useChatSettings({ hide: false, onShowCar: showCar, about: cars, starters })

  return null
}

export default PageChat
