'use client'

import React from 'react'
import CloseButton from '../CloseButton'

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
    <header className="relative text-lg text-center p-[14px_16px] shadow-(--shadow-hairline) font-semibold">
      <CloseButton onClick={onClose} />
      <h2 id="chat-modal-title" className="m-0 text-lg font-semibold">
        Spjall
      </h2>
      {hasMessages && (
        <button
          type="button"
          aria-label="Hreinsa spjall"
          onClick={onClearChat}
          className="absolute right-[11px] top-[11px] flex items-center justify-center h-8 w-8 border-0 p-0 rounded-2xl appearance-none bg-transparent text-stone cursor-pointer transition-all duration-200 hover:bg-cloud hover:text-tint"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
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

export default ChatHeader
