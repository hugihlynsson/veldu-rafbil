'use client'

import React from 'react'

interface Props {
  suggestions: string[]
  onSendMessage: (message: string) => void
}

const FollowUpSuggestions: React.FunctionComponent<Props> = ({
  suggestions,
  onSendMessage,
}) => {
  return (
    <div className="pb-2 mx-5">
      <div className="flex flex-col gap-2.5 w-full max-w-[500px]">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="appearance-none bg-raised/60 backdrop-blur-lg border border-scrim/8 rounded-xl p-[14px_16px] text-[13px] font-medium text-tint cursor-pointer transition-all duration-200 text-left leading-[1.4] w-fit opacity-0 animate-[slideInUp_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards] hover:bg-raised/90 hover:border-scrim/12 hover:-translate-y-0.5 hover:shadow-(--shadow-chip-hover) active:translate-y-0 active:shadow-(--shadow-chip-press)"
            style={{ animationDelay: `${index * 0.08}s` }}
            onClick={() => onSendMessage(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FollowUpSuggestions
