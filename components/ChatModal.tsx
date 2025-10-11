'use client'

import React, { useEffect, useState, useRef } from 'react'
import { colors } from '../modules/globals'

interface Props {
  onDone: () => void
  chatState: any
  onClearChat: () => void
}

enum State {
  Initializing,
  Visible,
  Leaving,
}

const ChatModal: React.FunctionComponent<Props> = ({
  onDone,
  chatState,
  onClearChat,
}) => {
  const [state, setState] = useState<State>(State.Initializing)
  const [input, setInput] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = chatState
  const isLoading = status === 'in_progress'

  useEffect(() => {
    setTimeout(() => setState(() => State.Visible), 1)
    return
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleClose = () => {
    setState(() => State.Leaving)
    setTimeout(onDone, 300)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({
        role: 'user',
        parts: [{ type: 'text', text: input }],
      })
      setInput('')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
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
            <button onClick={onClearChat} className="clear-chat">
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

        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <p>Hæ! Ég get hjálpað þér með spurningar um rafbíla.</p>
              <p className="suggestion">
                Prófaðu að spyrja: &quot;Hvað er drægni?&quot; eða &quot;Hvað
                kostar að hlaða?&quot;
              </p>
            </div>
          )}
          {messages.map((message: any) => (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              <div className="message-content">
                {message.parts?.map((part: any, index: number) =>
                  part.type === 'text' ? (
                    <span key={index}>{part.text}</span>
                  ) : null,
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Skrifaðu spurninguna þína hér..."
            disabled={isLoading}
            autoFocus
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10L18 2L10 18L8.5 11.5L2 10Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </section>

      <style jsx>{`
        .container {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: flex-end;
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
          transition: background-color 0.2s;
          transition-delay: 0.1s;
        }
        .container.visible:before {
          transition-delay: 0s;
          background-color: rgba(0, 0, 0, 0.3);
        }

        section {
          z-index: 1;
          display: flex;
          flex-direction: column;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          background-color: #fff;
          width: 100vw;
          max-width: 500px;
          height: 70vh;
          max-height: 600px;
          overflow: hidden;
          box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.1);
          transform: translateY(40px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.32, 0, 0.67, 0);
        }
        section.visible {
          opacity: 1;
          transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
          transform: translateY(0);
        }

        header {
          position: relative;
          background-color: #fff;
          font-size: 18px;
          text-align: center;
          padding: 16px;
          border-bottom: 1px solid ${colors.cloud};
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
          gap: 12px;
        }

        .welcome {
          display: flex;
          flex-direction: column;
          gap: 12px;
          color: ${colors.stone};
          text-align: center;
          padding: 20px 0;
        }
        .welcome p {
          margin: 0;
          text-wrap: pretty;
        }
        .suggestion {
          font-size: 14px;
          color: ${colors.clay};
          text-wrap: pretty;
          padding: 0 20px;
        }

        .message {
          display: flex;
          animation: fadeIn 0.3s ease-in-out;
        }
        .message.user {
          justify-content: flex-end;
        }
        .message.assistant {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
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
          border-top: 1px solid ${colors.cloud};
          background-color: #fff;
        }

        input {
          flex: 1;
          border: 1px solid ${colors.cloud};
          border-radius: 20px;
          padding: 10px 16px;
          font-size: 14px;
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

        @media (min-height: 600px) and (min-width: 800px) {
          .container {
            align-items: center;
          }
          section {
            border-radius: 20px;
            height: 600px;
          }
        }
      `}</style>
    </div>
  )
}

export default ChatModal
