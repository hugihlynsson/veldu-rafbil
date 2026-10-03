'use client'

import React from 'react'

const TypingIndicator: React.FunctionComponent = () => {
  return (
    // <output> carries role="status", so the dots announce themselves
    <output className="flex flex-col items-start animate-message-in mb-4 scroll-mt-5 px-5">
      <span className="sr-only">Skrifar svar</span>
      <div
        aria-hidden="true"
        className="max-w-[80%] p-[14px_16px] rounded-2xl text-sm leading-6 wrap-break-word bg-cloud text-tint flex gap-1"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-clay animate-typing"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-clay animate-typing [animation-delay:0.2s]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-clay animate-typing [animation-delay:0.4s]"></span>
      </div>
    </output>
  )
}

export default TypingIndicator
