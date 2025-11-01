'use client'

import React, { memo } from 'react'

interface Props {
  hasMessages: boolean
  onClose: () => void
  onClearChat: () => void
}

const ChatHeader: React.FunctionComponent<Props> = ({
  hasMessages,
  onClose,
  onClearChat,
}) => {
  return (
    <header className="relative text-lg text-center p-[14px_16px] shadow-[0_1px_0px_0_rgba(0,0,0,0.05)] font-semibold">
      <button
        onClick={onClose}
        className="absolute left-[11px] top-[11px] flex items-center justify-center h-8 w-8 border-0 p-0 rounded-2xl appearance-none bg-transparent text-[30px] text-stone cursor-pointer transition-all duration-200 hover:bg-cloud [&_path]:transition-all [&_path]:duration-200 hover:[&_path]:fill-tint"
      >
        <svg
          width="14"
          height="14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <title>Close</title>
          <path
            d="m2.07 13.12 4.78-4.78 4.93 4.93 1.29-1.29-4.93-4.93 4.78-4.78L11.64.98 6.85 5.77 1.91.83.63 2.1l4.94 4.94-4.79 4.79 1.29 1.28Z"
            className="fill-stone"
          />
        </svg>
      </button>
      Spjall
      {hasMessages && (
        <button
          onClick={onClearChat}
          className="absolute right-[11px] top-[11px] flex items-center justify-center h-8 w-8 border-0 p-0 rounded-2xl appearance-none bg-transparent text-stone cursor-pointer transition-all duration-200 hover:bg-cloud hover:text-tint"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Hreinsa spjall</title>
            <path
              d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </header>
  )
}

const MemoizedChatHeader = memo(ChatHeader)

MemoizedChatHeader.displayName = 'ChatHeader'

export default MemoizedChatHeader
