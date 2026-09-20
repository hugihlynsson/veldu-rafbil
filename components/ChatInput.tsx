'use client'

import React, { useState } from 'react'
import { trackEvent } from 'fathom-client'
import { CHAT_SUGGESTIONS } from '../constants/chatSuggestions'
import { getRandomSuggestions } from '../modules/chatHelpers'
import useInputModality, { getInputModality } from '../utils/inputModality'
import clsx from 'clsx'

interface Props {
  onOpenChat: () => void
  hide?: boolean
  disabled?: boolean
  hasMessages: boolean
  sendMessage: (message: string) => void
  inputRef?: React.Ref<HTMLInputElement>
  /** Held by the caller: this input is remounted as it moves in and out */
  value: string
  onValueChange: (value: string) => void
  /** The caller's too: only it knows a handed-back focus is not an arrival */
  showFocusRing: boolean
  onFocusRingChange: (show: boolean) => void
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
  value,
  onValueChange,
  showFocusRing,
  onFocusRingChange,
  onIntent,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  useInputModality()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (value.trim()) {
      sendMessage(value)
      trackEvent('Sent message')
      onValueChange('')
      onOpenChat()
    } else if (hasMessages) {
      // Without this there is no keyboard route back into an open chat
      onOpenChat()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value)
  }

  // :focus-visible matches a text field however focus arrived, click
  // included, so a text field drawing its own ring has to decide for itself
  const handleFocusRing = () => {
    onFocusRingChange(getInputModality() === 'keyboard')
  }

  const handleFocus = () => {
    handleFocusRing()
    setIsFocused(true)
    onIntent?.()
    if (!hasMessages) {
      setSelectedSuggestions(getRandomSuggestions(CHAT_SUGGESTIONS, 3))
    }
  }

  // Opening on focus alone made this a keyboard trap: every tab onto it
  // reopened the modal, which put the focus back here
  const handleClick = () => {
    if (hasMessages) {
      onOpenChat()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
    trackEvent('Selected suggestion')
    onValueChange('')
    setIsFocused(false)
    onOpenChat()
  }

  return (
    <div
      className={clsx(
        'fixed bottom-[calc(1rem+var(--keyboard-inset))] left-1/2 -translate-x-1/2 z-1000 pointer-events-none flex flex-col-reverse items-center gap-3',
        'min-[500px]:bottom-[calc(1.5rem+var(--keyboard-inset))]',
        // Only the hiding fades: a transition on the bottom drags the bar
        // behind a keyboard on its way in
        'transition-opacity duration-300',
        hide && 'opacity-0',
      )}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false)
          onFocusRingChange(false)
        }
      }}
    >
      <form
        onSubmit={onSubmit}
        className={clsx(
          'pointer-events-auto flex items-center gap-2 p-[8px_8px_8px_20px] bg-[rgba(220,220,220,0.7)] backdrop-blur-xl rounded-full shadow-[0_4px_24px_rgba(0,0,0,0)] w-80 max-w-[90vw] transition-all duration-300 ease-in-out scale-[0.98] border border-black/2 hover:scale-100',
          showFocusRing && 'outline-2 outline-offset-2 outline-sky',
          isFocused && 'w-[400px] scale-100',
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onClick={handleClick}
          placeholder="Spurðu Veldu Rafbíl"
          // The ring lives on the form, so it wraps the whole pill
          className="flex-1 border-0 bg-transparent p-[8px_0] text-base font-normal text-tint outline-none placeholder:text-black/60 disabled:opacity-60"
        />
        <button
          onFocus={handleFocusRing}
          aria-label="Senda skilaboð"
          type="submit"
          disabled={disabled || !value.trim()}
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
              // Keeps the blur above from firing before the click lands;
              // Safari does not focus buttons on click
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
