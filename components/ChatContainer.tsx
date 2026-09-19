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
const warmChatModal = () => void import('./ChatModal')

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
  const [initialMessages] = useState(readStoredMessages)

  // Initialize useChat
  const chatState = useChat({ messages: initialMessages })

  // Handle body scroll lock for chat modal
  useBodyScrollLock(showChatMessages && !releaseBodyLock)

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
            clearStoredMessages()
          }}
          onReleaseBodyLock={() => setReleaseBodyLock(true)}
          onSendMessage={handleSendMessage}
          onRetry={handleRetry}
        />
      )}

      <FloatingChat
        inputRef={chatInputRef}
        onIntent={warmChatModal}
        onOpenChat={() => setShowChatMessages(true)}
        hide={hide}
        disabled={chatState.status === 'streaming'}
        hasMessages={chatState.messages.length > 0}
        sendMessage={handleSendMessage}
      />
    </>
  )
}
