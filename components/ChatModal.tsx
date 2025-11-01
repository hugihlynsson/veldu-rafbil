'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { UIDataTypes, UITools, ChatStatus, UIMessage } from 'ai'
import { parseFollowUps } from '../utils/chatHelpers'
import ChatHeader from './chat/ChatHeader'
import ChatMessage from './chat/ChatMessage'
import FollowUpSuggestions from './chat/FollowUpSuggestions'
import MentionedCars from './chat/MentionedCars'
import TypingIndicator from './chat/TypingIndicator'

const emptyMessageFilter = (
  message: UIMessage<unknown, UIDataTypes, UITools>,
) =>
  message.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim()

interface Props {
  onDone: () => void
  messages: UIMessage<unknown, UIDataTypes, UITools>[]
  status: ChatStatus
  onClearChat: () => void
  onReleaseBodyLock: () => void
  onSendMessage: (message: string) => void
}

enum State {
  Initializing,
  Visible,
  Leaving,
}

const ChatModal: React.FunctionComponent<Props> = ({
  onDone,
  messages,
  status,
  onClearChat,
  onReleaseBodyLock,
  onSendMessage,
}) => {
  const [state, setState] = useState<State>(State.Initializing)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const hasScrolledToInitialPosition = useRef(false)

  useEffect(() => {
    setTimeout(() => setState(() => State.Visible), 1)

    // Mark that initial position has been set after a short delay
    setTimeout(() => {
      hasScrolledToInitialPosition.current = true
    }, 10)
  }, [])

  // Keep scroll at bottom during streaming to prevent jumps
  useEffect(() => {
    if (!messagesContainerRef.current) return

    const container = messagesContainerRef.current
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      20

    // If already near bottom and content is streaming, keep it scrolled to bottom
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, status])

  const handleClose = useCallback(() => {
    setState(() => State.Leaving)
    onReleaseBodyLock()
    setTimeout(onDone, 300)
  }, [onDone, onReleaseBodyLock])

  const handleClearChat = useCallback(() => {
    handleClose()
    setTimeout(onClearChat, 300)
  }, [handleClose, onClearChat])

  // Extract data from the last assistant message
  const lastMessage = messages[messages.length - 1]
  const lastMessageFollowUps =
    lastMessage?.role === 'assistant'
      ? (() => {
          const textContent = lastMessage.parts
            ?.filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join(' ')
          return textContent ? parseFollowUps(textContent) : []
        })()
      : []

  const showLoading =
    (lastMessage?.role === 'user' && status !== 'error') ||
    (status === 'streaming' &&
      !lastMessage?.parts?.some(({ type }) => type === 'text'))

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 flex items-start justify-center z-1000 before:content-[''] before:block before:absolute before:inset-0 before:bg-black/0 before:transition-all before:duration-300 before:delay-100 ${state === State.Visible ? 'before:delay-0 before:bg-black/20' : ''}`}
      onClick={handleClose}
    >
      <section
        className={`z-1 flex flex-col bg-white/95 backdrop-blur-[20px] w-screen h-dvh overflow-hidden scale-95 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.32,0,0.67,0)] min-[600px]:h-[calc(100dvh-24px)] min-[600px]:max-w-[600px] min-[600px]:w-[90vw] min-[600px]:rounded-[24px_24px_32px_32px] min-[600px]:mt-3 min-[600px]:shadow-[0px_8px_60px_rgba(0,0,0,0.15)] ${state === State.Visible ? 'opacity-100 ease-[cubic-bezier(0.33,1,0.68,1)] scale-100' : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        <ChatHeader
          hasMessages={messages.length > 0}
          onClose={handleClose}
          onClearChat={handleClearChat}
        />

        <div className="flex-1 overflow-y-auto p-5 flex flex-col pb-20" ref={messagesContainerRef}>
          {messages.filter(emptyMessageFilter).map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLastUserMessage={
                message.id === messages.findLast((m) => m.role === 'user')?.id
              }
            />
          ))}

          {showLoading && <TypingIndicator />}

          {status !== 'streaming' && lastMessage && (
            <MentionedCars lastMessage={lastMessage} onClose={handleClose} />
          )}

          {status !== 'streaming' && lastMessageFollowUps.length > 0 && (
            <FollowUpSuggestions
              suggestions={lastMessageFollowUps}
              onSendMessage={onSendMessage}
            />
          )}
          <span ref={messagesEndRef} />
        </div>
      </section>
    </div>
  )
}

export default ChatModal
