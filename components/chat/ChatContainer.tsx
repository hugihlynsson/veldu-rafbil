'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ChatInput from './ChatInput'
import type { Car } from '@/modules/data/cars'
import type { Filters } from '@/modules/list/filters'
import useComposer from '@/utils/useComposer'
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
  const [showChatMessages, setShowChatMessages] = useState<boolean>(false)
  const [isChatModalLoaded, setIsChatModalLoaded] = useState<boolean>(false)
  // The input remounts each time it moves in and out of the modal, and only
  // its first arrival on the page is an entrance
  const [hasOpenedChat, setHasOpenedChat] = useState<boolean>(false)
  const conversation = useConversation()
  const composer = useComposer()
  const { session } = conversation

  // Handing over while the chunk is in flight would take the input with it
  const loadChatModal = () => {
    void importChatModal().then(() => setIsChatModalLoaded(true))
  }

  // The session too: the modal keeps what it was opened on to tell the
  // messages already said from the ones arriving
  const isChatOpen = showChatMessages && isChatModalLoaded && session !== null

  // Keeps the input above a phone keyboard rather than behind it
  useKeyboardInset()

  // One input in two places: showModal() makes everything outside it inert
  const chatInput = (
    <ChatInput
      {...composer.inputProps}
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
        onDone={(pickedCar) => {
          setShowChatMessages(false)
          // A car picked from the answer takes the focus instead
          if (pickedCar) onShowCar(pickedCar)
          else composer.focusOnArrival()
        }}
        session={session}
        composer={chatInput}
        composerRef={composer.ref}
      />
    </>
  )
}
