'use client'

import React, { useEffect, useState, useRef } from 'react'
import { colors } from '../modules/globals'
import { UIDataTypes, UITools, ChatStatus, UIMessage } from 'ai'
import { trackEvent } from 'fathom-client'
import { CHAT_SUGGESTIONS } from '../constants/chatSuggestions'
import { findMentionedCars, getRandomSuggestions } from '../utils/chatHelpers'
import ChatHeader from './chat/ChatHeader'
import ChatMessage from './chat/ChatMessage'
import WelcomeScreen from './chat/WelcomeScreen'
import FollowUpSuggestions from './chat/FollowUpSuggestions'
import TypingIndicator from './chat/TypingIndicator'

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
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastUserMessageRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const hasScrolledToInitialPosition = useRef(false)
  const initialMessageCount = useRef(messages.length)
  const isAutoScrolling = useRef(false)

  useEffect(() => {
    setTimeout(() => setState(() => State.Visible), 1)

    // Pick random suggestions when modal opens or when conversation is ready for new input
    setSelectedSuggestions(getRandomSuggestions(CHAT_SUGGESTIONS, 3))

    // Scroll to last user message immediately on mount (no animation)
    setTimeout(() => {
      if (lastUserMessageRef.current) {
        lastUserMessageRef.current.scrollIntoView({ block: 'start' })
        hasScrolledToInitialPosition.current = true
      }
    }, 10)
  }, [])

  // Update suggestions when messages change (shuffle for variety)
  useEffect(() => {
    if (messages.length > 0 && status !== 'streaming') {
      setSelectedSuggestions(getRandomSuggestions(CHAT_SUGGESTIONS, 3))
    }
  }, [messages, status])

  useEffect(() => {
    // Only smooth scroll if messages have changed after initial mount
    if (hasScrolledToInitialPosition.current && messages.length > initialMessageCount.current) {
      isAutoScrolling.current = true
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        isAutoScrolling.current = false
      }, 1000)
    }
  }, [messages])

  // Keep scroll at bottom during streaming to prevent jumps
  useEffect(() => {
    if (!messagesContainerRef.current) return

    const container = messagesContainerRef.current
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100

    // If already near bottom and content is streaming, keep it scrolled to bottom
    if (isNearBottom && status === 'streaming') {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, status])

  const handleClose = () => {
    setState(() => State.Leaving)
    onReleaseBodyLock()
    setTimeout(onDone, 300)
  }

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
          {messages.length === 0 && (
            <WelcomeScreen
              suggestions={selectedSuggestions}
              onSendMessage={(message) => {
                onSendMessage(message)
                trackEvent('Selected suggestion')
              }}
            />
          )}
          {messages.map((message, index) => {
            // Get text content from message
            const textContent =
              message.parts
                ?.filter((part) => part.type === 'text')
                .map((part) => part.text)
                .join(' ') || ''

            // Find cars mentioned in assistant messages
            const mentionedCars =
              message.role === 'assistant' &&
              status !== 'streaming' &&
              messages[messages.length - 1].id === message.id
                ? findMentionedCars(textContent)
                : []

            // Check if this is the last user message
            const isLastUserMessage =
              message.role === 'user' &&
              index === messages.findLastIndex((m) => m.role === 'user')

            return (
              <ChatMessage
                key={message.id}
                message={message}
                isLastUserMessage={isLastUserMessage}
                mentionedCars={mentionedCars}
                onClose={handleClose}
              />
            )
          })}
          {messages[messages.length - 1]?.role === 'user' &&
            status !== 'error' && <TypingIndicator />}
          {messages.length > 0 &&
            messages[messages.length - 1]?.role === 'assistant' &&
            status !== 'streaming' && (
              <FollowUpSuggestions
                suggestions={selectedSuggestions}
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
          border-radius: 24px 24px 32px 32px;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          width: 90vw;
          max-width: 600px;
          height: calc(100vh - 100px);
          height: calc(100dvh - 100px);
          overflow: hidden;
          box-shadow: 0px 8px 60px rgba(0, 0, 0, 0.15);
          transform: scale(0.95);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.32, 0, 0.67, 0);
          margin-top: 12px;
        }
        section.visible {
          opacity: 1;
          transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
          transform: scale(1);
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  )
}

export default ChatModal
