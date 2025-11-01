'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import ChatModal from './ChatModal'
import FloatingChat from './FloatingChat'

const CHAT_STORAGE_KEY = 'veldu-rafbil-chat-messages'

const useBodyScrollLock = (lock: boolean): void => {
  const [scrollY, setScrollY] = useState<number>(0)

  useEffect(() => {
    setScrollY(window.scrollY)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (lock) {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      window.scrollTo(0, parseInt(scrollY) * -1)
    }
  }, [lock])
}

interface Props {
  hide: boolean
}

export default function ChatContainer({ hide }: Props) {
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

  return (
    <>
      {showChatMessages && (
        <ChatModal
          onDone={() => setShowChatMessages(false)}
          messages={chatState.messages}
          status={chatState.status}
          onClearChat={() => {
            chatState.setMessages([])
            localStorage.removeItem(CHAT_STORAGE_KEY)
          }}
          onReleaseBodyLock={() => setReleaseBodyLock(true)}
          onSendMessage={handleSendMessage}
        />
      )}

      <FloatingChat
        onOpenChat={() => setShowChatMessages(true)}
        hide={hide}
        disabled={chatState.status === 'streaming'}
        hasMessages={chatState.messages.length > 0}
        sendMessage={handleSendMessage}
      />
    </>
  )
}
