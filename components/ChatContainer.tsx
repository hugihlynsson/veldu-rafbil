'use client'

import { useRef, useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import ChatModal from './ChatModal'
import FloatingChat from './ChatInput'
import useBodyScrollLock from '../utils/useBodyScrollLock'

const CHAT_STORAGE_KEY = 'veldu-rafbil-chat-messages'

interface Props {
  hide: boolean
}

export default function ChatContainer({ hide }: Props) {
  const chatInputRef = useRef<HTMLInputElement>(null)
  const [showChatMessages, setShowChatMessages] = useState<boolean>(false)
  const [releaseBodyLock, setReleaseBodyLock] = useState<boolean>(false)

  useEffect(() => {
    if (!showChatMessages) {
      setReleaseBodyLock(false)
    }
  }, [showChatMessages])

  // Load initial messages from localStorage
  const [initialMessages] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  // Initialize useChat
  const chatState = useChat({ messages: initialMessages })

  // Handle body scroll lock for chat modal
  useBodyScrollLock(showChatMessages && !releaseBodyLock)

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (chatState.messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatState.messages))
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

  return (
    <>
      {showChatMessages && (
        <ChatModal
          onDone={() => {
            setShowChatMessages(false)
            // The dialog normally hands focus back to whatever opened it, but
            // that can be a suggestion button which is gone by now. The input
            // is always here, and is where the reader was anyway.
            chatInputRef.current?.focus()
          }}
          messages={chatState.messages}
          status={chatState.status}
          onClearChat={() => {
            chatState.setMessages([])
            localStorage.removeItem(CHAT_STORAGE_KEY)
          }}
          onReleaseBodyLock={() => setReleaseBodyLock(true)}
          onSendMessage={handleSendMessage}
          onRetry={handleRetry}
        />
      )}

      <FloatingChat
        inputRef={chatInputRef}
        onOpenChat={() => setShowChatMessages(true)}
        hide={hide}
        disabled={chatState.status === 'streaming'}
        hasMessages={chatState.messages.length > 0}
        sendMessage={handleSendMessage}
      />
    </>
  )
}
