'use client'

import React from 'react'
import clsx from 'clsx'
import MiniCar from '@/components/list/MiniCar'
import type { Car } from '@/modules/data/cars'
import { getAnswerCars } from '@/modules/chat/cars'
import type { ChatMessage } from '@/modules/chat/message'

interface Props {
  lastMessage?: ChatMessage
  animate: boolean
  onPick: (car: Car) => void
}

const MentionedCars: React.FunctionComponent<Props> = ({
  lastMessage,
  animate,
  onPick,
}) => {
  if (!lastMessage || lastMessage.role !== 'assistant') return null

  const mentionedCars = getAnswerCars(lastMessage)

  if (mentionedCars.length === 0) return null

  return (
    <div className="mb-3">
      <div className="flex gap-3 w-full overflow-x-auto pl-5 pr-20 scroll-pl-5 scroll-pr-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mentionedCars.map((car, index) => (
          <div
            key={car.id}
            className={clsx(
              'shrink-0',
              animate && 'animate-car-in [--rise:4px]',
            )}
            style={animate ? { animationDelay: `${index * 0.1}s` } : undefined}
          >
            <MiniCar car={car} onSelect={() => onPick(car)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MentionedCars
