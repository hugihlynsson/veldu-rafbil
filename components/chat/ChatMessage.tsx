'use client'

import React from 'react'
import { Streamdown } from 'streamdown'
import { UIDataTypes, UITools, UIMessage } from 'ai'
import { useEffect } from 'react'
import { useRef } from 'react'
import { stripFollowUps } from '../../utils/chatHelpers'
import clsx from 'clsx'

interface Props {
  message: UIMessage<unknown, UIDataTypes, UITools>
  isLastUserMessage: boolean
  isStreaming?: boolean
}

const ChatMessage: React.FunctionComponent<Props> = ({
  message,
  isLastUserMessage,
  isStreaming = false,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLastUserMessage) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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
          isUser ? 'bg-sky text-lab' : 'bg-cloud text-tint',
        )}
      >
        {message.parts?.map((part, index) =>
          part.type === 'text' ? (
            <Streamdown
              key={index}
              animated
              isAnimating={isStreaming}
              controls={false}
              components={{
                table: ({ children }) => (
                  <div className="table-wrapper">
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {stripFollowUps(part.text)}
            </Streamdown>
          ) : null,
        )}
      </div>
    </div>
  )
}

export default ChatMessage
