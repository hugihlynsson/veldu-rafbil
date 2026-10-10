import { Suspense, useRef, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'

import type { ChatSession } from '@/components/chat/ChatEngine'
import type { ChatMessage } from '@/modules/chat/message'
import { hasStoredMessages } from './chatStorage'

// The AI SDK and zod, fetched once the chat is used rather than with the bar:
// warmed on focus, or on load when a conversation is waiting in storage
const ChatEngine = dynamic(() => import('@/components/chat/ChatEngine'))

export interface Conversation {
  /** Null until the engine has loaded and restored the stored conversation */
  session: ChatSession | null
  hasMessages: boolean
  /** Waiting on the first token counts: a question sent then is answered
   * alongside the one before it, and the two answers interleave */
  isBusy: boolean
  /** Before the engine is in, the question waits and is sent once it is */
  send: (text: string) => void
  /** Starts fetching the engine before anything is sent */
  load: () => void
  /** Draws nothing, and has to be rendered for the conversation to load */
  engine: ReactNode
}

/**
 * The chat's conversation, the same to its callers before the engine holding
 * it has loaded as after
 */
const useConversation = (
  questionMetadata?: ChatMessage['metadata'],
): Conversation => {
  // Never server-rendered, so storage can be read as it first renders
  const [hadStoredChat] = useState<boolean>(hasStoredMessages)
  const [isWanted, setIsWanted] = useState<boolean>(hadStoredChat)
  const [session, setSession] = useState<ChatSession | null>(null)
  // Asked before the engine was in. A ref, as the engine reports from an
  // effect and can report again before this renders, and it is sent once.
  const queued = useRef<string | null>(null)
  const [hasQueued, setHasQueued] = useState<boolean>(false)

  // The engine reports in only once the stored conversation is restored, so
  // a queued question is asked as part of it rather than replaced by it
  const handleChange = (next: ChatSession) => {
    setSession(next)
    const question = queued.current
    if (question === null) return
    queued.current = null
    next.send(question)
  }

  return {
    session,
    hasMessages: session ? session.messages.length > 0 : hadStoredChat,
    isBusy: session
      ? session.status === 'submitted' || session.status === 'streaming'
      : hasQueued,
    send: (text) => {
      if (session) return session.send(text)
      queued.current = text
      setHasQueued(true)
      setIsWanted(true)
    },
    load: () => setIsWanted(true),
    engine: isWanted && (
      // Its own boundary, so the bar does not wait on the chunk
      <Suspense fallback={null}>
        <ChatEngine
          onChange={handleChange}
          questionMetadata={questionMetadata}
        />
      </Suspense>
    ),
  }
}

export default useConversation
