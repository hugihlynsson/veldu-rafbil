'use client'

import { useRef, useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import dynamic from 'next/dynamic'
import FloatingChat from './ChatInput'
import useBodyScrollLock from '../utils/useBodyScrollLock'
import {
  clearStoredMessages,
  readStoredMessages,
  writeStoredMessages,
} from '../utils/chatStorage'

// The modal drags in react-markdown and remark-gfm, which most visitors never
// need — they came for the list. Its chunk is fetched the first time the chat
// opens, and warmed on focus so that the open still feels instant.
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
  const [isChatModalLoaded, setIsChatModalLoaded] = useState<boolean>(false)

  // The input goes inside the dialog when the chat opens, so the modal has to
  // be here before the switch rather than after it: handing over while its
  // chunk was still in flight would take the input off the page along with it.
  const loadChatModal = () => {
    void import('./ChatModal').then(() => setIsChatModalLoaded(true))
  }
  const isChatOpen = showChatMessages && isChatModalLoaded

  // The dialog hands focus back to whatever opened it, but that is gone by
  // then: the input moves out of the dialog as the chat closes and a new node
  // takes its place. So closing claims the focus and the node takes it as it
  // arrives, which is the first moment there is anything to give it to.
  const focusInputOnArrival = (node: HTMLInputElement | null) => {
    chatInputRef.current = node
    if (node && shouldFocusInput.current) {
      shouldFocusInput.current = false
      node.focus()
    }
  }

  // Load initial messages from localStorage
  const [initialMessages] = useState(readStoredMessages)

  // Initialize useChat
  const chatState = useChat({ messages: initialMessages })

  // Handle body scroll lock for chat modal
  useBodyScrollLock(isChatOpen && !releaseBodyLock)

  // Save messages to localStorage whenever they change
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

  // One input, rendered either on the page or inside the chat dialog, because
  // a dialog opened with showModal() makes everything outside it inert. Only
  // its place in the tree changes; the draft above is what carries across.
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
    />
  )

  if (!isChatOpen) return chatInput

  return (
    <ChatModal
      onDone={() => {
        shouldFocusInput.current = true
        setShowChatMessages(false)
        // Reset here, with the thing that closed the modal, rather than in
        // an effect watching for it to have closed
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
