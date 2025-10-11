'use client'

import React, { useState, useRef } from 'react'
import { colors } from '../modules/globals'

interface Props {
  chatState: any
  onOpenChat: () => void
}

const FloatingChat: React.FunctionComponent<Props> = ({
  chatState,
  onOpenChat,
}) => {
  const [input, setInput] = useState<string>('')
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status } = chatState
  const isLoading = status === 'in_progress'

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({
        role: 'user',
        parts: [{ type: 'text', text: input }],
      })
      setInput('')
      onOpenChat()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (messages.length > 0) {
      onOpenChat()
    }
  }

  return (
    <div className="floating-chat-container">
      <form
        onSubmit={onSubmit}
        className={`floating-chat-form ${isHovered ? 'hovered' : ''} ${isFocused ? 'focused' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          placeholder="Spurðu Veldu Rafbíl"
          disabled={isLoading}
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

      <style jsx>{`
        .floating-chat-container {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          pointer-events: none;
        }

        .floating-chat-form {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 8px 8px 20px;
          background: rgba(220, 220, 220, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 100px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.0);
          width: 320px;
          max-width: 90vw;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          scale: 0.98;
          border: 1px solid rgba(0, 0, 0, 0.02);
        }

        .floating-chat-form.hovered {
          scale: 1;
        }

        .floating-chat-form.focused {
          width: 400px;
          scale: 1;
        }

        input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 8px 0;
          font-size: 16px;
          font-weight: 400;
          color: ${colors.tint};
          outline: none;
        }

        input::placeholder {
          color: ${colors.stone};
        }

        input:disabled {
          opacity: 0.6;
        }

        button[type='submit'] {
          appearance: none;
          width: 36px;
          height: 36px;
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
          transform: scale(1.05);
        }

        button[type='submit']:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 500px) {
          .floating-chat-container {
            bottom: 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default FloatingChat
