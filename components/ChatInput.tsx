'use client'

import React, { useState } from 'react'
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
  inputRef?: React.RefObject<HTMLInputElement | null>
  /** Fired on focus, before anything is sent, so the caller can warm the chat */
  onIntent?: () => void
}

const ChatInput: React.FunctionComponent<Props> = ({
  onOpenChat,
  hide = false,
  disabled = false,
  hasMessages,
  sendMessage,
  inputRef,
  onIntent,
}) => {
  const [input, setInput] = useState<string>('')
  const [isFocused, setIsFocused] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input)
      trackEvent('Sent message')
      setInput('')
      onOpenChat()
    } else if (hasMessages) {
      // Enter on an empty box reopens the conversation. Without this there is
      // no keyboard route back into a chat you already have.
      onOpenChat()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
    onIntent?.()
    if (!hasMessages) {
      // Pick 3 random suggestions
      setSelectedSuggestions(getRandomSuggestions(CHAT_SUGGESTIONS, 3))
    }
  }

  // Opening the chat on focus alone made this input a keyboard trap: with a
  // history, every attempt to tab onto or past it reopened the modal, and
  // closing the modal put focus back here and reopened it again. A click is
  // the same single gesture for pointer users, and Enter covers the keyboard.
  const handleClick = () => {
    if (hasMessages) {
      onOpenChat()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
    trackEvent('Selected suggestion')
    setInput('')
    setIsFocused(false)
    onOpenChat()
  }

  return (
    <div
      className={clsx(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-1000 pointer-events-none flex flex-col-reverse items-center gap-3 transition-all duration-300',
        'min-[500px]:bottom-6',
        hide && 'opacity-0',
      )}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false)
        }
      }}
    >
      <form
        onSubmit={onSubmit}
        className={clsx(
          'pointer-events-auto flex items-center gap-2 p-[8px_8px_8px_20px] bg-[rgba(220,220,220,0.7)] backdrop-blur-xl rounded-full shadow-[0_4px_24px_rgba(0,0,0,0)] w-80 max-w-[90vw] transition-all duration-300 ease-in-out scale-[0.98] border border-black/2 hover:scale-100',
          'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky',
          isFocused && 'w-[400px] scale-100',
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onClick={handleClick}
          placeholder="Spurðu Veldu Rafbíl"
          // The focus ring lives on the form, so that it wraps the whole pill
          // rather than the bare input inside it
          className="flex-1 border-0 bg-transparent p-[8px_0] text-base font-normal text-tint outline-none placeholder:text-black/60 disabled:opacity-60"
        />
        <button
          aria-label="Senda skilaboð"
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
            aria-hidden="true"
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

      {isFocused && !hasMessages && (
        <fieldset
          aria-label="Tillögur að spurningum"
          className="pointer-events-auto m-0 flex min-w-0 flex-col gap-2 border-0 p-0 animate-[fadeInUpRotate_0.3s_ease-out]"
        >
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
              // Keeping the input focused means the blur above never fires and
              // the suggestion survives long enough to be clicked. Safari does
              // not focus buttons on click, so onClick alone would not do.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </fieldset>
      )}
    </div>
  )
}

export default ChatInput
