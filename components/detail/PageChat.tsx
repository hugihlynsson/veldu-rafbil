'use client'

import { FunctionComponent } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import type { Car } from '@/modules/data/cars'
import { carPathOf, comparisonPathOf } from '@/modules/detail/paths'
import { MAX_COMPARED } from '@/modules/detail/comparison'
import prefersReducedMotion from '@/utils/prefersReducedMotion'

// The bar arrives after the figures, as on the list, and the AI SDK after it
const ChatContainer = dynamic(() => import('@/components/chat/ChatContainer'), {
  ssr: false,
})

interface Props {
  cars: ReadonlyArray<Car>
}

/**
 * The advisor's bar on a car's page or a comparison, carrying the cars it is
 * about with each question. A car picked from an answer that is one of them is
 * scrolled up to. Another opens its own page from a car's page, and on a
 * comparison joins the cars when there is room.
 */
const PageChat: FunctionComponent<Props> = ({ cars }) => {
  const router = useRouter()

  const showCar = (car: Car) => {
    if (cars.includes(car)) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    } else if (cars.length === 1 || cars.length >= MAX_COMPARED) {
      router.push(carPathOf(car))
    } else {
      router.push(comparisonPathOf([...cars, car]))
    }
  }

  return <ChatContainer hide={false} onShowCar={showCar} about={cars} />
}

export default PageChat
