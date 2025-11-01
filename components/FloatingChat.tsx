'use client'

import React, { useState, useRef } from 'react'
import { trackEvent } from 'fathom-client'
import { CHAT_SUGGESTIONS } from '../constants/chatSuggestions'
import { getRandomSuggestions } from '../utils/chatHelpers'
import clsx from 'clsx'

interface Props {
  onOpenChat: () => void
  hide?: boolean
  disabled?: boolean
  hasMessages: boolean
  sendMessage: (message: string) => void
}

const FloatingChat: React.FunctionComponent<Props> = ({
  onOpenChat,
  hide = false,
  disabled = false,
  hasMessages,
  sendMessage,
}) => {
  const [input, setInput] = useState<string>('')
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input)
      trackEvent('Sent message')
      setInput('')
      onOpenChat()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (hasMessages) {
      onOpenChat()
    } else {
      // Pick 3 random suggestions
      setSelectedSuggestions(getRandomSuggestions(CHAT_SUGGESTIONS, 3))
    }
  }

  const handleSuggestionClick = (e: React.MouseEvent, suggestion: string) => {
    e.preventDefault()
    e.stopPropagation()

    sendMessage(suggestion)
    trackEvent('Selected suggestion')
    setInput('')
    setIsFocused(false)
    onOpenChat()
  }

  return (
    <div
      className={clsx(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-1000 pointer-events-none flex flex-col items-center gap-3 transition-all duration-300',
        'min-[500px]:bottom-6',
        hide && 'opacity-0 pointer-events-none',
      )}
    >
      {isFocused && !hasMessages && (
        <div className="pointer-events-auto flex flex-col gap-2 animate-[fadeInUpRotate_0.3s_ease-out]">
          {selectedSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className={clsx(
                'bg-white/70 backdrop-blur-xl border border-black/6 rounded-2xl p-[12px_16px] text-sm font-medium text-tint cursor-pointer transition-all duration-200 text-left whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-[fadeInUpRotate_0.3s_ease-out_backwards]',
                'hover:bg-white/90 hover:text-tint hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
                'active:translate-y-0',
                index === 0 && '[animation-delay:0.45s]',
                index === 1 && '[animation-delay:0.35s]',
                index === 2 && '[animation-delay:0.25s]',
              )}
              onMouseDown={(e) => handleSuggestionClick(e, suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <form
        onSubmit={onSubmit}
        className={clsx(
          'pointer-events-auto flex items-center gap-2 p-[8px_8px_8px_20px] bg-[rgba(220,220,220,0.7)] backdrop-blur-xl rounded-full shadow-[0_4px_24px_rgba(0,0,0,0)] w-80 max-w-[90vw] transition-all duration-300 ease-in-out scale-[0.98] border border-black/2',
          isHovered && 'scale-100',
          isFocused && 'w-[400px] scale-100',
        )}
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
          className="flex-1 border-0 bg-transparent p-[8px_0] text-base font-normal text-tint outline-none placeholder:text-black/50 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="appearance-none w-9 h-9 flex items-center justify-center bg-sky border-0 rounded-full text-lab cursor-pointer transition-all duration-200 shrink-0 hover:enabled:bg-sky-darker hover:enabled:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
        >
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
    </div>
  )
}

export default FloatingChat
