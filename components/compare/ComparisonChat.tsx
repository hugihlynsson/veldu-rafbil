'use client'

import { FunctionComponent } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import type { Car } from '@/modules/data/cars'
import { comparisonPathOf, MAX_COMPARED } from '@/modules/compare/comparison'
import prefersReducedMotion from '@/utils/prefersReducedMotion'

// The bar arrives after the figures, as on the list, and the AI SDK after it
const ChatContainer = dynamic(() => import('@/components/chat/ChatContainer'), {
  ssr: false,
})

interface Props {
  cars: ReadonlyArray<Car>
}

/**
 * The advisor's bar on a comparison, carrying the compared cars with each
 * question. A car picked from an answer is shown in its column when it is one
 * of them, joins them when there is room, and is shown on the list otherwise.
 */
const ComparisonChat: FunctionComponent<Props> = ({ cars }) => {
  const router = useRouter()

  const showCar = (car: Car) => {
    if (cars.includes(car)) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    } else if (cars.length < MAX_COMPARED) {
      router.push(comparisonPathOf([...cars, car]))
    } else {
      router.push(`/#${car.id}`)
    }
  }

  return <ChatContainer hide={false} onShowCar={showCar} comparing={cars} />
}

export default ComparisonChat
