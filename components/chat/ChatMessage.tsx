'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { UIDataTypes, UITools, UIMessage } from 'ai'
import { useEffect } from 'react'
import { useRef } from 'react'
import { stripFollowUps } from '@/modules/chatHelpers'
import prefersReducedMotion from '@/utils/prefersReducedMotion'
import clsx from 'clsx'

interface Props {
  message: UIMessage<unknown, UIDataTypes, UITools>
  isLastUserMessage: boolean
}

const ChatMessage: React.FunctionComponent<Props> = ({
  message,
  isLastUserMessage,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLastUserMessage) {
      ref.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
    }
    // Scrolls once, on arrival: the dependency would re-scroll an older one
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isUser = message.role === 'user'

  return (
    <div
      ref={ref}
      className={clsx(
        'flex flex-col animate-[fadeIn_0.3s_ease-in-out] mb-4 scroll-mt-5 nth-last-2:mb-0 px-5',
        isUser ? 'items-end' : 'items-start',
      )}
    >
      <div
        className={clsx(
          'message-content max-w-[90%] p-[10px_14px] rounded-2xl text-sm leading-6 wrap-break-words',
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
              {stripFollowUps(part.text)}
            </ReactMarkdown>
          ) : null,
        )}
      </div>
    </div>
  )
}

export default ChatMessage
