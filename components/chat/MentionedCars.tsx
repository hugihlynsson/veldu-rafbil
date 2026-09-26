'use client'

import React from 'react'
import MiniCar from '@/components/MiniCar'
import {
  findMentionedCars,
  getMessageText,
  type ChatMessage,
} from '@/modules/chatHelpers'

interface Props {
  lastMessage?: ChatMessage
  onClose: () => void
}

const MentionedCars: React.FunctionComponent<Props> = ({
  lastMessage,
  onClose,
}) => {
  if (!lastMessage || lastMessage.role !== 'assistant') return null

  const mentionedCars = findMentionedCars(getMessageText(lastMessage))

  if (mentionedCars.length === 0) return null

  return (
    <div className="mb-3">
      <div className="flex gap-3 w-full overflow-x-auto pl-5 pr-20 scroll-pl-5 scroll-pr-20 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {mentionedCars.map((car, index) => (
          <div
            key={car.id}
            className="opacity-0 animate-[slideInCar_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] shrink-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <MiniCar car={car} onClose={onClose} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MentionedCars
