'use client'

import { Suspense, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import ChatInput from './ChatInput'
import type { ChatSession } from './ChatEngine'
import type { Car } from '@/modules/data/cars'
import type { Filters } from '@/modules/list/filters'
import useBodyScrollLock from '@/utils/useBodyScrollLock'
import useKeyboardInset from '@/utils/useKeyboardInset'
import { hasStoredMessages } from '@/utils/chatStorage'

// The AI SDK and zod, fetched once the chat is used rather than with the bar:
// warmed on focus, or on load when a conversation is waiting in storage
const ChatEngine = dynamic(() => import('./ChatEngine'))

// react-markdown is fetched the first time the chat opens, warmed on focus
const ChatModal = dynamic(() => import('./ChatModal'))

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
  const [releaseBodyLock, setReleaseBodyLock] = useState<boolean>(false)
  // The draft outlives the input, which is mounted in one of two places
  const [draft, setDraft] = useState<string>('')
  const [showFocusRing, setShowFocusRing] = useState<boolean>(false)
  const [isChatModalLoaded, setIsChatModalLoaded] = useState<boolean>(false)
  // The input remounts each time it moves in and out of the modal, and only
  // its first arrival on the page is an entrance
  const [hasOpenedChat, setHasOpenedChat] = useState<boolean>(false)
  // Never server-rendered, so storage can be read as it first renders
  const [hadStoredChat] = useState<boolean>(hasStoredMessages)
  const [isEngineWanted, setIsEngineWanted] = useState<boolean>(hadStoredChat)
  const [session, setSession] = useState<ChatSession | null>(null)
  // Asked before the engine had arrived, and sent the moment it does
  const [queuedQuestion, setQueuedQuestion] = useState<string | null>(null)

  // Handing over while the chunk is in flight would take the input with it
  const loadChatModal = () => {
    void import('./ChatModal').then(() => setIsChatModalLoaded(true))
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

  useBodyScrollLock(isChatOpen && !releaseBodyLock)

  // Keeps the input above a phone keyboard rather than behind it
  useKeyboardInset()

  const handleSendMessage = (text: string) => {
    if (session) {
      session.send(text)
    } else {
      setQueuedQuestion(text)
      setIsEngineWanted(true)
    }
  }

  // One input in two places: showModal() makes everything outside it inert
  const chatInput = (
    <ChatInput
      inputRef={focusInputOnArrival}
      onIntent={() => {
        loadChatModal()
        setIsEngineWanted(true)
      }}
      onOpenChat={() => {
        loadChatModal()
        setShowChatMessages(true)
        setHasOpenedChat(true)
      }}
      animateIn={!hasOpenedChat}
      hide={hide}
      // Waiting on the first token counts: a question sent then is answered
      // alongside the one before it, and the two answers interleave
      disabled={
        session
          ? session.status === 'submitted' || session.status === 'streaming'
          : queuedQuestion !== null
      }
      hasMessages={session ? session.messages.length > 0 : hadStoredChat}
      sendMessage={handleSendMessage}
      value={draft}
      onValueChange={setDraft}
      showFocusRing={showFocusRing}
      onFocusRingChange={setShowFocusRing}
      filterSuggestions={
        isChatOpen ? undefined : { filters, onApply: onApplyFilters }
      }
    />
  )

  const engine = isEngineWanted && (
    // Its own boundary, so the bar does not wait on the chunk
    <Suspense fallback={null}>
      <ChatEngine
        queuedQuestion={queuedQuestion}
        onQueuedQuestionSent={() => setQueuedQuestion(null)}
        onChange={setSession}
      />
    </Suspense>
  )

  if (!isChatOpen) {
    return (
      <>
        {engine}
        {chatInput}
      </>
    )
  }

  return (
    <>
      {engine}
      <ChatModal
        onDone={() => {
          const car = carToShow.current
          carToShow.current = null
          // A car picked from the answer takes the focus instead
          shouldFocusInput.current = !car
          setShowChatMessages(false)
          // Reset with the thing that closed the modal, not in an effect
          setReleaseBodyLock(false)
          if (car) onShowCar(car)
        }}
        messages={session.messages}
        status={session.status}
        error={session.error}
        onClearChat={session.clear}
        onReleaseBodyLock={() => setReleaseBodyLock(true)}
        onSendMessage={handleSendMessage}
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
