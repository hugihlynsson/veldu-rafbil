'use client'

import { FunctionComponent } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import type { Car } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'
import prefersReducedMotion from '@/utils/prefersReducedMotion'

// The bar arrives after the figures, as on the list, and the AI SDK after it
const ChatContainer = dynamic(() => import('@/components/chat/ChatContainer'), {
  ssr: false,
})

interface Props {
  cars: ReadonlyArray<Car>
  /** Written with the car's review; the general ones without it */
  starters?: ReadonlyArray<string>
}

/**
 * The advisor's bar on a car's page or a comparison, carrying the cars it is
 * about with each question. A car picked from an answer opens its own page,
 * unless it is the car whose page this is, which is scrolled up to.
 */
const PageChat: FunctionComponent<Props> = ({ cars, starters }) => {
  const router = useRouter()

  const showCar = (car: Car) => {
    // By id: the page's cars came from the server, a picked one from the
    // client's own list, so they are never the same object
    if (cars.length === 1 && cars[0]?.id === car.id) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    } else {
      router.push(carPathOf(car))
    }
  }

  return (
    <ChatContainer
      hide={false}
      onShowCar={showCar}
      about={cars}
      starters={starters}
    />
  )
}

export default PageChat
