'use client'

import React from 'react'
import MiniCar from '../MiniCar'
import { UIDataTypes, UIMessage, UITools } from 'ai'
import { findMentionedCars } from '../../utils/chatHelpers'

interface Props {
  lastMessage?: UIMessage<unknown, UIDataTypes, UITools>
  onClose: () => void
}

const MentionedCars: React.FunctionComponent<Props> = ({
  lastMessage,
  onClose,
}) => {
  if (!lastMessage || lastMessage.role !== 'assistant') return null

  // Find cars mentioned in the last assistant message (only when not streaming)
  const mentionedCars = lastMessage.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    ? findMentionedCars(
        lastMessage.parts
          ?.filter((part) => part.type === 'text')
          .map((part) => part.text)
          .join(' '),
      )
    : []

  if (mentionedCars.length === 0) return null

  return (
    <div className="w-[calc(100%+44px)] -ml-6 -mr-6 mb-3">
      <div className="grid gap-3 w-full grid-flow-col auto-rows-auto auto-cols-[90%] overflow-x-auto snap-x snap-mandatory scroll-pl-6 scroll-pr-6 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] pl-6 pr-6 [&::-webkit-scrollbar]:hidden [&.scrollable>*]:snap-start">
        {mentionedCars.map((car, index) => (
          <div
            key={`${car.make}-${car.model}-${car.subModel}`}
            className="opacity-0 animate-[slideInCar_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]"
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
