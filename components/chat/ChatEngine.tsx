'use client'

import { useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type ChatStatus } from 'ai'
import { getMessageText, type ChatMessage } from '@/modules/chat/message'
import { trimHistory } from '@/modules/chat/request'
import {
  clearStoredMessages,
  getConversationId,
  readStoredMessages,
  writeStoredMessages,
} from '@/utils/chatStorage'

// The stored conversation grows without end, and the route refuses one past
// its bounds whole, so what is sent is cut to fit the way the route cuts it
const transport = new DefaultChatTransport<ChatMessage>({
  prepareSendMessagesRequest: ({ body, messages }) => ({
    body: {
      ...body,
      messages: trimHistory(messages),
      conversationId: getConversationId(),
    },
  }),
})

const asQuestion = (text: string, metadata: ChatMessage['metadata']) => ({
  role: 'user' as const,
  parts: [{ type: 'text' as const, text }],
  ...(metadata && { metadata }),
})

export interface ChatSession {
  messages: ChatMessage[]
  status: ChatStatus
  error: Error | undefined
  send: (text: string) => void
  retry: () => void
  clear: () => void
}

interface Props {
  /** Called once the stored conversation is in, and on every change after */
  onChange: (session: ChatSession) => void
  /** Sent with each question: the page it was asked on, where that matters */
  questionMetadata?: ChatMessage['metadata']
}

/**
 * The conversation, apart from the bar so the AI SDK loads once it is used.
 * Read through utils/useConversation, which renders it.
 */
export default function ChatEngine({ onChange, questionMetadata }: Props) {
  const { messages, status, error, sendMessage, setMessages } =
    useChat<ChatMessage>({ transport })
  const [hasRestored, setHasRestored] = useState<boolean>(false)

  // Nothing can be sent until this is in, as the session is held back until
  // then
  useEffect(() => {
    void readStoredMessages().then((stored) => {
      if (stored.length > 0) setMessages(stored)
      setHasRestored(true)
    })
  }, [setMessages])

  // Messages change on every streamed chunk, and each write serialises the
  // whole history, so the answer is stored once it has arrived
  useEffect(() => {
    if (status !== 'streaming' && messages.length > 0) {
      writeStoredMessages(messages)
    }
  }, [messages, status])

  useEffect(() => {
    if (!hasRestored) return

    const send = (text: string) => {
      void sendMessage(asQuestion(text, questionMetadata))
    }

    onChange({
      messages,
      status,
      error,
      send,
      retry: () => {
        const lastUserIndex = messages.findLastIndex((m) => m.role === 'user')
        if (lastUserIndex === -1) return
        const text = getMessageText(messages[lastUserIndex])
        if (!text) return
        setMessages(messages.slice(0, lastUserIndex))
        send(text)
      },
      clear: () => {
        setMessages([])
        clearStoredMessages()
      },
    })
  }, [
    hasRestored,
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    onChange,
    questionMetadata,
  ])

  return null
}
