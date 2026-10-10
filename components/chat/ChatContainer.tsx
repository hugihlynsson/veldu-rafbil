'use client'

import { Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import ChatInput from './ChatInput'
import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import type { Filters } from '@/modules/list/filters'
import useChunk from '@/utils/useChunk'
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
  /** The list's filters, which the bar suggests changes to as it is typed in */
  filters?: Filters
  onApplyFilters?: (filters: Filters) => void
  /** The cars compared on the page it is on, which each question carries */
  comparing?: ReadonlyArray<Car>
}

export default function ChatContainer({
  hide,
  onShowCar,
  filters,
  onApplyFilters,
  comparing,
}: Props) {
  const conversation = useConversation(
    comparing && { comparing: comparing.map(carSlug) },
  )
  const composer = useComposer()
  const chatModal = useChunk(importChatModal)
  const [wantsChatOpen, setWantsChatOpen] = useState<boolean>(false)
  // The input remounts each time it moves in and out of the modal, and only
  // its first arrival on the page is an entrance
  const [hasOpenedChat, setHasOpenedChat] = useState<boolean>(false)

  // Waits for the modal's chunk, as handing over while it is in flight would
  // take the input with it, and for the session, as the modal keeps what it
  // was opened on to tell the messages already said from the ones arriving
  const { session } = conversation
  const isChatOpen = wantsChatOpen && chatModal.isLoaded && session !== null

  // Keeps the input above a phone keyboard rather than behind it
  useKeyboardInset()

  // One input in two places: showModal() makes everything outside it inert
  const chatInput = (
    <ChatInput
      {...composer.inputProps}
      onIntent={() => {
        chatModal.load()
        conversation.load()
      }}
      onOpenChat={() => {
        chatModal.load()
        setWantsChatOpen(true)
        setHasOpenedChat(true)
      }}
      animateIn={!hasOpenedChat}
      hide={hide}
      disabled={conversation.isBusy}
      hasMessages={conversation.hasMessages}
      sendMessage={conversation.send}
      filterSuggestions={
        !isChatOpen && filters && onApplyFilters
          ? { filters, onApply: onApplyFilters }
          : undefined
      }
    />
  )

  return (
    <>
      {conversation.engine}
      {isChatOpen ? (
        // Its own boundary: the modal suspends on its first render even with
        // its chunk in, and the one above would hide the engine with it.
        // Strict Mode remounts what reappears, and the engine stops the
        // question just sent as it unmounts.
        <Suspense fallback={chatInput}>
          <ChatModal
            session={session}
            composer={chatInput}
            composerRef={composer.ref}
            onDone={(pickedCar) => {
              setWantsChatOpen(false)
              // A car picked from the answer takes the focus instead
              if (pickedCar) onShowCar(pickedCar)
              else composer.focusOnArrival()
            }}
          />
        </Suspense>
      ) : (
        chatInput
      )}
    </>
  )
}
