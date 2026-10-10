'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import ChatInput from './ChatInput'
import type { Car } from '@/modules/data/cars'
import type { Filters } from '@/modules/list/filters'
import useConversation from '@/utils/useConversation'
import useKeyboardInset from '@/utils/useKeyboardInset'

// react-markdown is fetched the first time the chat opens, warmed on focus.
// One import for both: written twice, each is built as a copy of its own and
// the warm-up fetches the other, and an import() inside the component makes
// the React Compiler skip it.
const importChatModal = () => import('./ChatModal')
const ChatModal = dynamic(importChatModal)

interface Props {
  hide: boolean
  /** Called once the chat has closed, so the car's card can take the focus */
  onShowCar: (car: Car) => void
  filters: Filters
  onApplyFilters: (filters: Filters) => void
}

export default function ChatContainer({
  hide,
  onShowCar,
  filters,
  onApplyFilters,
}: Props) {
  const chatInputRef = useRef<HTMLInputElement>(null)
  const shouldFocusInput = useRef<boolean>(false)
  // Held until the dialog has closed: the page behind it is inert until then,
  // and the card could not take the focus
  const carToShow = useRef<Car | null>(null)
  const [showChatMessages, setShowChatMessages] = useState<boolean>(false)
  // The draft outlives the input, which is mounted in one of two places
  const [draft, setDraft] = useState<string>('')
  const [showFocusRing, setShowFocusRing] = useState<boolean>(false)
  const [isChatModalLoaded, setIsChatModalLoaded] = useState<boolean>(false)
  // The input remounts each time it moves in and out of the modal, and only
  // its first arrival on the page is an entrance
  const [hasOpenedChat, setHasOpenedChat] = useState<boolean>(false)
  const conversation = useConversation()
  const { session } = conversation

  // Handing over while the chunk is in flight would take the input with it
  const loadChatModal = () => {
    void importChatModal().then(() => setIsChatModalLoaded(true))
  }

  // The session too: the modal keeps what it was opened on to tell the
  // messages already said from the ones arriving
  const isChatOpen = showChatMessages && isChatModalLoaded && session !== null

  // The node the dialog would hand focus back to is gone by the time it
  // closes, so the new one claims the focus as it arrives
  const focusInputOnArrival = (node: HTMLInputElement | null) => {
    chatInputRef.current = node
    if (node && shouldFocusInput.current) {
      shouldFocusInput.current = false
      node.focus()
      // Focus handed back on close is the reader carrying on, not arriving
      setShowFocusRing(false)
    }
  }

  // Keeps the input above a phone keyboard rather than behind it
  useKeyboardInset()

  // One input in two places: showModal() makes everything outside it inert
  const chatInput = (
    <ChatInput
      inputRef={focusInputOnArrival}
      onIntent={() => {
        loadChatModal()
        conversation.load()
      }}
      onOpenChat={() => {
        loadChatModal()
        setShowChatMessages(true)
        setHasOpenedChat(true)
      }}
      animateIn={!hasOpenedChat}
      hide={hide}
      disabled={conversation.isBusy}
      hasMessages={conversation.hasMessages}
      sendMessage={conversation.send}
      value={draft}
      onValueChange={setDraft}
      showFocusRing={showFocusRing}
      onFocusRingChange={setShowFocusRing}
      filterSuggestions={
        isChatOpen ? undefined : { filters, onApply: onApplyFilters }
      }
    />
  )

  if (!isChatOpen) {
    return (
      <>
        {conversation.engine}
        {chatInput}
      </>
    )
  }

  return (
    <>
      {conversation.engine}
      <ChatModal
        onDone={() => {
          const car = carToShow.current
          carToShow.current = null
          // A car picked from the answer takes the focus instead
          shouldFocusInput.current = !car
          setShowChatMessages(false)
          if (car) onShowCar(car)
        }}
        messages={session.messages}
        status={session.status}
        error={session.error}
        onClearChat={session.clear}
        onSendMessage={conversation.send}
        onRetry={session.retry}
        onShowCar={(car) => {
          carToShow.current = car
        }}
        composer={chatInput}
        composerRef={chatInputRef}
      />
    </>
  )
}
