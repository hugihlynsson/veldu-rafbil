'use client'

import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { colors } from '../modules/globals'
import MiniCar from './MiniCar'
import newCars from '../modules/newCars'
import { NewCar } from '../types'
import { UIDataTypes, UITools, ChatStatus, UIMessage } from 'ai'

interface Props {
  onDone: () => void
  messages: UIMessage<unknown, UIDataTypes, UITools>[]
  status: ChatStatus
  onClearChat: () => void
  onReleaseBodyLock: () => void
  onSendMessage: (message: string) => void
}

const suggestions = [
  'Er hagstæðara að reka rafbíl?',
  'Hvaða rafbílar bjóða upp á 7 sæti?',
  'Hver hentar best fyrir langferðir?',
  'Henta afturhjóladrifnir á veturna?',
  'Hvar er best að hlaða?',
  'Hver er með nútímalegasta viðmótið?',
  'Hvaða rafbíll verður góður í endursölu?',
  'Hver er öruggastur fyrir börn?',
  'Hversu mikilvægur er hraðhleðsluhraðinn?',
  'Hver er flottur fyrir innanbæjarakstur?'
]

enum State {
  Initializing,
  Visible,
  Leaving,
}

// Helper function to find cars mentioned in text
const findMentionedCars = (text: string) => {
  const mentioned: NewCar[] = []
  const lowerText = text.toLowerCase()

  for (const car of newCars) {
    // Check if the message mentions this car (make + model)
    const carName = `${car.make} ${car.model}`.toLowerCase()
    const carNameWithSub = car.subModel
      ? `${car.make} ${car.model} ${car.subModel}`.toLowerCase()
      : null

    if (
      lowerText.includes(carName) ||
      (carNameWithSub && lowerText.includes(carNameWithSub))
    ) {
      // Avoid duplicates
      if (
        !mentioned.find(
          (c) =>
            c.make === car.make &&
            c.model === car.model &&
            c.subModel === car.subModel,
        )
      ) {
        mentioned.push(car)
      }
    }
  }

  return mentioned
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
    const shuffled = [...suggestions].sort(() => Math.random() - 0.5)
    setSelectedSuggestions(shuffled.slice(0, 3))

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
      const shuffled = [...suggestions].sort(() => Math.random() - 0.5)
      setSelectedSuggestions(shuffled.slice(0, 3))
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
        <header>
          <button onClick={handleClose} className="close">
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
                fill={colors.stone}
              />
            </svg>
          </button>
          Spjall
          {messages.length > 0 && (
            <button
              onClick={() => {
                handleClose()
                setTimeout(onClearChat, 300)
              }}
              className="clear-chat"
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

        <div className="messages" ref={messagesContainerRef}>
          {messages.length === 0 && (
            <div className="welcome">
              <p className="welcome-title">Hæ! Ég get hjálpað þér með spurningar um rafbíla.</p>
              <div className="suggestions-grid">
                {selectedSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-button"
                    onClick={() => onSendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
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
              index ===
                messages.findLastIndex((m) => m.role === 'user')

            return (
              <div
                key={message.id}
                ref={isLastUserMessage ? lastUserMessageRef : null}
                className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
              >
                <div className="message-content">
                  {message.parts?.map((part, index) =>
                    part.type === 'text' ? (
                      <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                        {part.text}
                      </ReactMarkdown>
                    ) : null,
                  )}
                </div>
                {mentionedCars.length > 0 && (
                  <div className="car-cards">
                    {mentionedCars.map((car) => (
                      <MiniCar
                        key={`${car.make}-${car.model}-${car.subModel}`}
                        car={car}
                        onClose={handleClose}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {messages[messages.length - 1]?.role === 'user' &&
            status !== 'error' && (
              <div key="typing" className="message assistant">
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          {messages.length > 0 &&
           messages[messages.length - 1]?.role === 'assistant' &&
           status !== 'streaming' && (
            <div className="follow-up-suggestions">
              <div className="suggestions-grid">
                {selectedSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-button"
                    onClick={() => onSendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
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

        header {
          position: relative;
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-size: 18px;
          text-align: center;
          padding: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          font-weight: 600;
        }

        .close {
          position: absolute;
          left: 11px;
          top: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          width: 32px;
          border: 0;
          padding: 0;
          border-radius: 16px;
          appearance: none;
          background-color: transparent;
          font-size: 30px;
          color: ${colors.stone};
          cursor: pointer;
          transition: all 0.2s;
        }
        .close:hover {
          background-color: ${colors.cloud};
        }
        .close path {
          transition: all 0.2s;
        }
        .close:hover path {
          fill: ${colors.tint};
        }

        .clear-chat {
          position: absolute;
          right: 11px;
          top: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          width: 32px;
          border: 0;
          padding: 0;
          border-radius: 16px;
          appearance: none;
          background-color: transparent;
          color: ${colors.stone};
          cursor: pointer;
          transition: all 0.2s;
        }
        .clear-chat:hover {
          background-color: ${colors.cloud};
          color: ${colors.tint};
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .welcome {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px 0;
          align-items: center;
        }
        .welcome-title {
          margin: 0;
          color: ${colors.tint};
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          text-wrap: pretty;
        }
        .suggestions-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 500px;
        }
        .suggestion-button {
          appearance: none;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 13px;
          font-weight: 500;
          color: ${colors.tint};
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          line-height: 1.4;
          width: fit-content;
        }
        .suggestion-button:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .suggestion-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }

        .follow-up-suggestions {
          padding: 12px 0 8px 0;
          animation: fadeIn 0.3s ease-in-out;
        }

        .message {
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.3s ease-in-out;
          margin-bottom: 16px;
          scroll-margin-top: 20px;
        }
        .message.user {
          align-items: flex-end;
        }
        .message.assistant {
          align-items: flex-start;
        }
        .message:nth-last-child(2) {
          margin-bottom: 0;
        }

        .message-content {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
        }
        .message.user .message-content {
          background-color: ${colors.sky};
          color: ${colors.lab};
        }
        .message.assistant .message-content {
          background-color: ${colors.cloud};
          color: ${colors.tint};
        }

        /* Markdown styling */
        .message-content :global(p) {
          margin: 0 0 0.5em 0;
        }
        .message-content :global(p:last-child) {
          margin-bottom: 0;
        }
        .message-content :global(strong) {
          font-weight: 600;
        }
        .message-content :global(em) {
          font-style: italic;
        }
        .message-content :global(code) {
          background-color: rgba(0, 0, 0, 0.06);
          padding: 2px 4px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 0.9em;
        }
        .message-content :global(pre) {
          background-color: rgba(0, 0, 0, 0.06);
          padding: 8px 10px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 0.5em 0;
        }
        .message-content :global(pre code) {
          background-color: transparent;
          padding: 0;
        }
        .message-content :global(ul),
        .message-content :global(ol) {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        .message-content :global(li) {
          margin: 0.25em 0;
        }
        .message-content :global(a) {
          color: inherit;
          text-decoration: underline;
        }
        .message-content :global(a:hover) {
          opacity: 0.8;
        }
        .message-content :global(table) {
          border-collapse: collapse;
          width: 100%;
          margin: 0.5em 0;
          font-size: 13px;
        }
        .message-content :global(th),
        .message-content :global(td) {
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 6px 8px;
          text-align: left;
        }
        .message-content :global(th) {
          background-color: rgba(0, 0, 0, 0.04);
          font-weight: 600;
        }
        .message-content :global(tr:nth-child(even)) {
          background-color: rgba(0, 0, 0, 0.02);
        }

        .car-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
          width: 100%;
        }

        @media (min-width: 480px) {
          .car-cards {
            width: 80%;
          }
        }

        .typing {
          display: flex;
          gap: 4px;
          padding: 14px 16px;
        }
        .typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: ${colors.clay};
          animation: typing 1.4s infinite;
        }
        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        form {
          padding: 16px;
          display: flex;
          gap: 8px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        input {
          flex: 1;
          border: 1px solid ${colors.cloud};
          border-radius: 20px;
          padding: 10px 16px;
          font-size: 16px;
          font-weight: 400;
          color: ${colors.tint};
          transition: all 0.2s;
        }
        input::placeholder {
          color: ${colors.clay};
        }
        input:hover:not(:disabled) {
          border-color: ${colors.clay};
        }
        input:focus {
          outline: none;
          border-color: ${colors.sky};
        }
        input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        button[type='submit'] {
          appearance: none;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${colors.sky};
          border: 0;
          border-radius: 50%;
          color: ${colors.lab};
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        button[type='submit']:hover:not(:disabled) {
          background-color: ${colors.skyDarker};
        }
        button[type='submit']:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}

export default ChatModal
