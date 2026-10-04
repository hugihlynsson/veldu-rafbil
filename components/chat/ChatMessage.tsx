'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect, useRef, useState } from 'react'
import type { ChatMessage as Message } from '@/modules/chat/message'
import prefersReducedMotion from '@/utils/prefersReducedMotion'
import clsx from 'clsx'

interface Props {
  message: Message
  isLastUserMessage: boolean
  animate: boolean
}

const ChatMessage: React.FunctionComponent<Props> = ({
  message,
  isLastUserMessage,
  animate,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  // As it was on arrival: a question scrolls into view once, and not again
  // when a later one makes it the last no longer
  const [scrollsOnArrival] = useState(isLastUserMessage)

  useEffect(() => {
    if (scrollsOnArrival) {
      ref.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
    }
  }, [scrollsOnArrival])

  const isUser = message.role === 'user'

  return (
    <div
      ref={ref}
      className={clsx(
        'flex flex-col mb-4 scroll-mt-5 last:mb-0 px-5',
        animate && 'animate-message-in',
        isUser ? 'items-end' : 'items-start',
      )}
    >
      <div
        className={clsx(
          'message-content max-w-[90%] px-3.5 py-2.5 rounded-2xl text-sm leading-6 wrap-break-word',
          isUser ? 'bg-sky text-on-sky' : 'bg-cloud text-tint',
        )}
      >
        {message.parts?.map((part, index) =>
          part.type === 'text' ? (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="table-wrapper">
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {part.text}
            </ReactMarkdown>
          ) : null,
        )}
      </div>
    </div>
  )
}

export default ChatMessage
