'use client'

import { useRef, useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import dynamic from 'next/dynamic'
import FloatingChat from './ChatInput'
import useBodyScrollLock from '../utils/useBodyScrollLock'
import useKeyboardInset from '../utils/useKeyboardInset'
import {
  clearStoredMessages,
  readStoredMessages,
  writeStoredMessages,
} from '../utils/chatStorage'

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

  const [initialMessages] = useState(readStoredMessages)
  const chatState = useChat({ messages: initialMessages })

  useBodyScrollLock(isChatOpen && !releaseBodyLock)

  // Keeps the input above a phone keyboard rather than behind it
  useKeyboardInset()

  useEffect(() => {
    if (chatState.messages.length > 0) {
      writeStoredMessages(chatState.messages)
    }
  }, [chatState.messages])

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
    const lastUserMessage = messages[lastUserIndex]
    const textPart = lastUserMessage.parts?.find((p) => p.type === 'text')
    if (!textPart || !('text' in textPart)) return
    chatState.setMessages(messages.slice(0, lastUserIndex))
    handleSendMessage(textPart.text)
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
      disabled={chatState.status === 'streaming'}
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
