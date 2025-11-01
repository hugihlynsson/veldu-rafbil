'use client'

import React from 'react'
import MiniCar from '../MiniCar'
import { UIDataTypes, UIMessage, UITools } from 'ai'
import { findMentionedCars } from '../../utils/chatHelpers'

interface Props {
  lastMessage?: UIMessage<unknown, UIDataTypes, UITools>
  onClose: () => void
}

const MentionedCars: React.FunctionComponent<Props> = ({ lastMessage, onClose }) => {
  if (!lastMessage || lastMessage.role !== 'assistant') return null

  // Find cars mentioned in the last assistant message (only when not streaming)
  const mentionedCars =
    lastMessage.parts
      ?.filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join(' ')
    ? findMentionedCars(lastMessage.parts?.filter((part) => part.type === 'text').map((part) => part.text).join(' '))
    : []

  if (mentionedCars.length === 0) return null

  return (
    <div className="car-cards-container">
      <div className="car-cards">
        {mentionedCars.map((car, index) => (
          <div
            key={`${car.make}-${car.model}-${car.subModel}`}
            className="car-card-wrapper"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <MiniCar car={car} onClose={onClose} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .car-cards-container {
          width: calc(100% + 44px);
          margin-left: -24px;
          margin-right: -24px;
          margin-bottom: 12px;
        }

        .car-cards {
          display: grid;
          gap: 12px;
          width: 100%;
          grid-auto-flow: column;
          grid-template-rows: repeat(3, auto);
          grid-auto-columns: 90%;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-padding-left: 24px;
          scroll-padding-right: 24px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
          padding-left: 24px;
          padding-right: 24px;
        }

        .car-cards::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .car-card-wrapper {
          opacity: 0;
          animation: slideInCar 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .car-cards.scrollable .car-card-wrapper {
          scroll-snap-align: start;
        }

        @keyframes slideInCar {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default MentionedCars
