'use client'

import React, { useEffect, useState, useRef } from 'react'
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
      250

    // If already near bottom and content is streaming, keep it scrolled to bottom
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, status])

  const handleClose = () => {
    setState(() => State.Leaving)
    onReleaseBodyLock()
    setTimeout(onDone, 300)
  }

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
      className={`container ${state === State.Visible ? 'visible' : ''}`}
      onClick={handleClose}
    >
      <section
        className={state === State.Visible ? 'visible' : ''}
        onClick={(event) => event.stopPropagation()}
      >
        <ChatHeader
          hasMessages={messages.length > 0}
          onClose={handleClose}
          onClearChat={() => {
            handleClose()
            setTimeout(onClearChat, 300)
          }}
        />

        <div className="messages" ref={messagesContainerRef}>
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

      <style jsx>{`
        .container {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: start;
          justify-content: center;
          z-index: 1000;
        }
        .container:before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0);
          transition: all 0.3s;
          transition-delay: 0.1s;
        }
        .container.visible:before {
          transition-delay: 0s;
          background-color: rgba(0, 0, 0, 0.2);
        }

        section {
          z-index: 1;
          display: flex;
          flex-direction: column;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          transform: scale(0.95);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.32, 0, 0.67, 0);
        }
        section.visible {
          opacity: 1;
          transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
          transform: scale(1);
        }

        @media (min-width: 600px) {
          section {
            height: calc(100vh - 24px);
            height: calc(100dvh - 24px);
            max-width: 600px;
            width: 90vw;
            border-radius: 24px 24px 32px 32px;
            margin-top: 12px;
            box-shadow: 0px 8px 60px rgba(0, 0, 0, 0.15);
          }
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          padding-bottom: 80px;
        }
      `}</style>
    </div>
  )
}

export default ChatModal
