'use client'

import React from 'react'
import clsx from 'clsx'

import useShrinkwrap from '@/utils/useShrinkwrap'

interface Props {
  suggestions: string[]
  animate: boolean
  onSendMessage: (message: string) => void
}

const FollowUpSuggestions: React.FunctionComponent<Props> = ({
  suggestions,
  animate,
  onSendMessage,
}) => {
  return (
    <div className="pb-2 mx-5">
      <div className="flex flex-col gap-2.5 w-full max-w-[500px]">
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            text={suggestion}
            animate={animate}
            index={index}
            onSendMessage={onSendMessage}
          />
        ))}
      </div>
    </div>
  )
}

const Suggestion: React.FunctionComponent<{
  text: string
  animate: boolean
  index: number
  onSendMessage: (message: string) => void
}> = ({ text, animate, index, onSendMessage }) => {
  const ref = useShrinkwrap<HTMLButtonElement>(text)

  return (
    <button
      ref={ref}
      className={clsx(
        'appearance-none bg-raised/60 backdrop-blur-lg border border-edge rounded-xl px-4 py-3.5 text-control font-medium text-tint cursor-pointer transition duration-200 text-left leading-[1.4] whitespace-pre-line wrap-break-word w-fit hover:bg-raised/90 hover:border-edge-strong hover:-translate-y-0.5 hover:shadow-(--shadow-chip-hover) active:translate-y-0 active:shadow-(--shadow-chip-press)',
        animate && 'animate-follow-up-in',
      )}
      style={animate ? { animationDelay: `${index * 0.08}s` } : undefined}
      onClick={() => onSendMessage(text)}
    >
      {text}
    </button>
  )
}

export default FollowUpSuggestions
