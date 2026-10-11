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
}

/**
 * The advisor's bar on a car's page, carrying the car with each question. A
 * car picked from an answer is scrolled up to when it is this one, and opens
 * its own page when it is another.
 */
const PageChat: FunctionComponent<Props> = ({ cars }) => {
  const router = useRouter()

  const showCar = (car: Car) => {
    if (cars.includes(car)) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    } else {
      router.push(carPathOf(car))
    }
  }

  return <ChatContainer hide={false} onShowCar={showCar} about={cars} />
}

export default PageChat
