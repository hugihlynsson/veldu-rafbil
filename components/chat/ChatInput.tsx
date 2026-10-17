'use client'

import React, {
  Suspense,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react'
import { trackEvent } from 'fathom-client'
import {
  CHAT_SUGGESTIONS,
  getRandomSuggestions,
} from '@/modules/chat/suggestions'
import { MAX_QUESTION_LENGTH } from '@/modules/chat/questionLength'
import useInputModality, { getInputModality } from '@/utils/inputModality'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import type { Filters } from '@/modules/list/filters'
import { agree } from '@/modules/copy/plural'
import SuggestionPills from '@/components/SuggestionPills'
import SearchIcon from '@/components/SearchIcon'
import SendIcon from '@/components/SendIcon'
import type { BarAction } from '@/components/filters/FilterSuggestions'
import type { ShownSuggestions } from '@/modules/list/suggestionOutcome'
import reportSuggestionOutcome from '@/utils/reportSuggestionOutcome'

// The parser and its patterns are fetched once someone focuses the input,
// rather than with the chat. One import for both, as in ChatContainer.
const importFilterSuggestions = () =>
  import('@/components/filters/FilterSuggestions')
const FilterSuggestions = dynamic(importFilterSuggestions)

const noAction: BarAction = { text: '', filter: null }

// The longest a send waits on the suggestions before it goes to the chat:
// past the route's own timeout, for a chunk that never arrives
const READ_WAIT = 2_000

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
  /** The questions offered to start on; the general ones when left out */
  starters?: string[]
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
  starters = CHAT_SUGGESTIONS,
  filterSuggestions,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  // The filter pills are fetched on the first keystroke, then kept mounted so
  // they can play their exit when the text is cleared or the input left
  const [hasTyped, setHasTyped] = useState(value !== '')
  const [action, setAction] = useState<BarAction>(noAction)
  // Sent before the suggestions had read it, so it goes once they have
  const [sendWhenRead, setSendWhenRead] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const filterPills = useRef<ShownSuggestions | null>(null)
  useInputModality()

  const filter = filterSuggestions && value.trim() ? action.filter : null
  const carsLeft =
    filter && `${filter.count} ${agree(filter.count, 'bíll', 'bílar')}`

  const ask = () => {
    // A busy chat takes no message, however it was sent
    if (disabled) return
    if (filterPills.current) {
      reportSuggestionOutcome('sent', filterPills.current)
    }
    sendMessage(value)
    trackEvent('Sent message')
    onValueChange('')
    onOpenChat()
  }

  const send = (next: BarAction) => {
    if (filterSuggestions && next.filter) {
      trackEvent('Filtered from bar')
      if (filterPills.current) {
        reportSuggestionOutcome('appliedAll', filterPills.current)
      }
      filterSuggestions.onApply(next.filter.filters)
      onValueChange('')
      // Off the bar, so the list it narrowed is in view, keyboard and all
      formRef.current?.querySelector('input')?.blur()
    } else {
      ask()
    }
  }

  const handleAction = (next: BarAction) => {
    setAction(next)
    if (sendWhenRead !== null && next.text === sendWhenRead) {
      setSendWhenRead(null)
      send(next)
    }
  }

  const askUnread = useEffectEvent(() => {
    setSendWhenRead(null)
    ask()
  })
  useEffect(() => {
    if (sendWhenRead === null) return
    const timer = setTimeout(askUnread, READ_WAIT)
    return () => clearTimeout(timer)
  }, [sendWhenRead])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const text = value.trim()
    if (text) {
      if (filterSuggestions && action.text !== text) setSendWhenRead(text)
      else send(action)
    } else if (hasMessages) {
      // Without this there is no keyboard route back into an open chat
      onOpenChat()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value)
    setSendWhenRead(null)
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
    if (filterSuggestions) void importFilterSuggestions()
    if (!hasMessages) {
      setSelectedSuggestions(getRandomSuggestions(starters, 3))
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
        'sm:bottom-[calc(1.5rem+var(--keyboard-inset))]',
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
        ref={formRef}
        onSubmit={onSubmit}
        className={clsx(
          'pointer-events-auto flex items-center gap-2 p-2 pl-5 bg-veil/70 backdrop-blur-xl rounded-full shadow-(--shadow-pill) w-80 max-w-[90vw] transition-[width,scale] duration-300 ease-in-out border border-edge',
          showFocusRing && 'outline-2 outline-offset-2 outline-focus',
          isFocused ? 'w-[400px] scale-100' : 'scale-[0.98] hover:scale-100',
          animateIn && 'animate-bar-in',
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
          className="flex-1 border-0 bg-transparent py-2 text-base font-normal text-tint outline-none placeholder:text-stone disabled:opacity-60"
        />
        <button
          onFocus={handleFocusRing}
          aria-label={carsLeft ? `Sía listann: ${carsLeft}` : 'Senda skilaboð'}
          type="submit"
          // A busy chat takes no message, but the list still takes a filter
          disabled={(disabled && !filter) || !value.trim()}
          // Keeps the input's blur from clearing the suggestions before the
          // click lands; Safari does not focus buttons on click
          onMouseDown={(event) => event.preventDefault()}
          className={clsx(
            'appearance-none h-9 flex items-center justify-center gap-1.5 bg-sky border-0 rounded-full text-on-sky cursor-pointer transition duration-200 shrink-0 hover:enabled:bg-sky-hover disabled:opacity-40 disabled:cursor-not-allowed',
            filter ? 'px-3.5 text-sm font-semibold whitespace-nowrap' : 'w-9',
          )}
        >
          {carsLeft ? (
            <>
              <SearchIcon size={15} />
              {carsLeft}
            </>
          ) : (
            <SendIcon size={20} />
          )}
        </button>
      </form>

      {filterSuggestions && hasTyped && (
        // Its own boundary: suspending on the chunk would otherwise swap out
        // the input mid-word, and the keystrokes typed meanwhile with it
        <Suspense fallback={null}>
          <FilterSuggestions
            // Kept reading while a send waits on it, should the input be left
            active={(isFocused || sendWhenRead !== null) && value.trim() !== ''}
            text={value}
            filters={filterSuggestions.filters}
            onApply={filterSuggestions.onApply}
            onShownChange={(shown) => {
              filterPills.current = shown
            }}
            onAction={handleAction}
            onAsk={ask}
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
