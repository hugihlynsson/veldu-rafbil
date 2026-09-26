'use client'

import { useRef, useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import dynamic from 'next/dynamic'
import FloatingChat from './ChatInput'
import { getMessageText, type ChatMessage } from '@/modules/chatMessage'
import useBodyScrollLock from '@/utils/useBodyScrollLock'
import useKeyboardInset from '@/utils/useKeyboardInset'
import {
  clearStoredMessages,
  readStoredMessages,
  writeStoredMessages,
} from '@/utils/chatStorage'

// react-markdown is fetched the first time the chat opens, warmed on focus
const ChatModal = dynamic(() => import('./ChatModal'))

interface Props {
  hide: boolean
}

export default function ChatContainer({ hide }: Props) {
  const chatInputRef = useRef<HTMLInputElement>(null)
  const shouldFocusInput = useRef<boolean>(false)
  const [showChatMessages, setShowChatMessages] = useState<boolean>(false)
  const [releaseBodyLock, setReleaseBodyLock] = useState<boolean>(false)
  // The draft outlives the input, which is mounted in one of two places
  const [draft, setDraft] = useState<string>('')
  const [showFocusRing, setShowFocusRing] = useState<boolean>(false)
  const [isChatModalLoaded, setIsChatModalLoaded] = useState<boolean>(false)

  // Handing over while the chunk is in flight would take the input with it
  const loadChatModal = () => {
    void import('./ChatModal').then(() => setIsChatModalLoaded(true))
  }
  const isChatOpen = showChatMessages && isChatModalLoaded

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

  const chatState = useChat<ChatMessage>()
  const { setMessages } = chatState

  // Read after mount, as validating it is async. A question already sent in
  // the meantime has started a conversation of its own, so it is not replaced.
  useEffect(() => {
    void readStoredMessages().then((stored) => {
      if (stored.length > 0) {
        setMessages((current) => (current.length > 0 ? current : stored))
      }
    })
  }, [setMessages])

  useBodyScrollLock(isChatOpen && !releaseBodyLock)

  // Keeps the input above a phone keyboard rather than behind it
  useKeyboardInset()

  // Messages change on every streamed chunk, and each write serialises the
  // whole history, so the answer is stored once it has arrived
  useEffect(() => {
    if (chatState.status !== 'streaming' && chatState.messages.length > 0) {
      writeStoredMessages(chatState.messages)
    }
  }, [chatState.messages, chatState.status])

  const handleSendMessage = (text: string) => {
    chatState.sendMessage({
      role: 'user',
      parts: [{ type: 'text', text }],
    })
  }

  const handleRetry = () => {
    const messages = chatState.messages
    const lastUserIndex = messages.findLastIndex((m) => m.role === 'user')
    if (lastUserIndex === -1) return
    const text = getMessageText(messages[lastUserIndex])
    if (!text) return
    chatState.setMessages(messages.slice(0, lastUserIndex))
    handleSendMessage(text)
  }

  // One input in two places: showModal() makes everything outside it inert
  const chatInput = (
    <FloatingChat
      inputRef={focusInputOnArrival}
      onIntent={loadChatModal}
      onOpenChat={() => {
        loadChatModal()
        setShowChatMessages(true)
      }}
      hide={hide}
      // Waiting on the first token counts: a question sent then is answered
      // alongside the one before it, and the two answers interleave
      disabled={
        chatState.status === 'submitted' || chatState.status === 'streaming'
      }
      hasMessages={chatState.messages.length > 0}
      sendMessage={handleSendMessage}
      value={draft}
      onValueChange={setDraft}
      showFocusRing={showFocusRing}
      onFocusRingChange={setShowFocusRing}
    />
  )

  if (!isChatOpen) return chatInput

  return (
    <ChatModal
      onDone={() => {
        shouldFocusInput.current = true
        setShowChatMessages(false)
        // Reset with the thing that closed the modal, not in an effect
        setReleaseBodyLock(false)
      }}
      messages={chatState.messages}
      status={chatState.status}
      onClearChat={() => {
        chatState.setMessages([])
        clearStoredMessages()
      }}
      onReleaseBodyLock={() => setReleaseBodyLock(true)}
      onSendMessage={handleSendMessage}
      onRetry={handleRetry}
      composer={chatInput}
      composerRef={chatInputRef}
    />
  )
}
