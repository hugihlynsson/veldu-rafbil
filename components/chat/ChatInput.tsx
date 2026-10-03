'use client'

import React, { Suspense, useState } from 'react'
import { trackEvent } from 'fathom-client'
import {
  CHAT_SUGGESTIONS,
  getRandomSuggestions,
} from '@/modules/chat/suggestions'
import { MAX_QUESTION_LENGTH } from '@/modules/chat/message'
import useInputModality, { getInputModality } from '@/utils/inputModality'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import type { Filters } from '@/modules/list/filters'
import SuggestionPills from '@/components/SuggestionPills'

// The parser and its patterns are fetched once someone focuses the input,
// rather than with the chat
const FilterSuggestions = dynamic(
  () => import('@/components/filters/FilterSuggestions'),
)

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
  /** Fades the pill in as it mounts */
  animateIn?: boolean
  /** Left out where the list is not what is in view, as inside the chat */
  filterSuggestions?: {
    filters: Filters
    onApply: (filters: Filters) => void
  }
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
  animateIn = false,
  filterSuggestions,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  // The filter pills are fetched on the first keystroke, then kept mounted so
  // they can play their exit when the text is cleared or the input left
  const [hasTyped, setHasTyped] = useState(value !== '')
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
    if (e.target.value) setHasTyped(true)
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
    if (filterSuggestions) void import('@/components/filters/FilterSuggestions')
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
          'pointer-events-auto flex items-center gap-2 p-[8px_8px_8px_20px] bg-veil/70 backdrop-blur-xl rounded-full shadow-(--shadow-pill) w-80 max-w-[90vw] transition-all duration-300 ease-in-out border border-scrim/2',
          showFocusRing && 'outline-2 outline-offset-2 outline-focus',
          isFocused ? 'w-[400px] scale-100' : 'scale-[0.98] hover:scale-100',
          animateIn &&
            'animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)_backwards]',
        )}
      >
        <input
          ref={inputRef}
          type="text"
          maxLength={MAX_QUESTION_LENGTH}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onClick={handleClick}
          placeholder="Spurðu Veldu Rafbíl"
          // The ring lives on the form, so it wraps the whole pill
          className="flex-1 border-0 bg-transparent p-[8px_0] text-base font-normal text-tint outline-none placeholder:text-scrim/60 disabled:opacity-60"
        />
        <button
          onFocus={handleFocusRing}
          aria-label="Senda skilaboð"
          type="submit"
          disabled={disabled || !value.trim()}
          className="appearance-none w-9 h-9 flex items-center justify-center bg-sky border-0 rounded-full text-on-sky cursor-pointer transition-all duration-200 shrink-0 hover:enabled:bg-sky-hover hover:enabled:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
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

      {filterSuggestions && hasTyped && (
        // Its own boundary: suspending on the chunk would otherwise swap out
        // the input mid-word, and the keystrokes typed meanwhile with it
        <Suspense fallback={null}>
          <FilterSuggestions
            active={isFocused && value.trim() !== ''}
            text={value}
            filters={filterSuggestions.filters}
            onApply={filterSuggestions.onApply}
          />
        </Suspense>
      )}

      <SuggestionPills
        label="Tillögur að spurningum"
        pills={
          isFocused && !hasMessages && !value
            ? selectedSuggestions.map((suggestion, index) => ({
                key: suggestion,
                content: suggestion,
                onClick: () => handleSuggestionClick(suggestion),
                // Top last, once the input has widened under them
                enterDelay: 0.45 - index * 0.1,
              }))
            : []
        }
      />
    </div>
  )
}

export default ChatInput
