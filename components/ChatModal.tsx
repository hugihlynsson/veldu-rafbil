'use client'

import React, { useEffect, useRef } from 'react'
import type { ChatStatus } from 'ai'
import {
  getFollowUps,
  getMessageText,
  type ChatMessage as Message,
} from '@/modules/chatHelpers'
import Modal from './Modal'
import ChatHeader from './chat/ChatHeader'
import ChatMessage from './chat/ChatMessage'
import FollowUpSuggestions from './chat/FollowUpSuggestions'
import MentionedCars from './chat/MentionedCars'
import TypingIndicator from './chat/TypingIndicator'

interface Props {
  onDone: () => void
  messages: Message[]
  status: ChatStatus
  onClearChat: () => void
  onReleaseBodyLock: () => void
  onSendMessage: (message: string) => void
  onRetry: () => void
  /** Inside the dialog, since showModal() makes the page outside it inert */
  composer: React.ReactNode
  /** Focused after open: showModal() would land on the close button */
  composerRef: React.RefObject<HTMLInputElement | null>
}

const ChatModal: React.FunctionComponent<Props> = ({
  onDone,
  messages,
  status,
  onClearChat,
  onReleaseBodyLock,
  onSendMessage,
  onRetry,
  composer,
  composerRef,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!messagesContainerRef.current) return

    const container = messagesContainerRef.current
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 20

    // Only when already at the bottom, so reading back is not yanked down
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, status])

  const lastMessage = messages[messages.length - 1]
  const lastAssistantText =
    lastMessage?.role === 'assistant' ? getMessageText(lastMessage) : ''
  const lastMessageFollowUps = getFollowUps(lastMessage)

  // Found once rather than per message, which is what reading it inside the
  // map below came to
  const lastUserMessageId = messages.findLast((m) => m.role === 'user')?.id

  const showLoading =
    (lastMessage?.role === 'user' && status !== 'error') ||
    (status === 'streaming' &&
      !lastMessage?.parts?.some(({ type }) => type === 'text'))

  return (
    <Modal
      labelledBy="chat-modal-title"
      onDone={onDone}
      onLeave={onReleaseBodyLock}
      initialFocusRef={composerRef}
      className="items-start backdrop:duration-300 data-[state=visible]:backdrop:bg-backdrop"
    >
      {({ isVisible, close }) => (
        <>
          <section
            className={`z-1 flex flex-col bg-glass/95 backdrop-blur-[20px] w-screen h-[calc(100dvh-var(--keyboard-inset))] overflow-hidden scale-95 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.32,0,0.67,0)] min-[600px]:h-[calc(100dvh-24px-var(--keyboard-inset))] min-[600px]:max-w-[600px] min-[600px]:w-[90vw] min-[600px]:rounded-[24px_24px_32px_32px] min-[600px]:mt-3 min-[600px]:shadow-(--shadow-modal) ${isVisible ? 'opacity-100 ease-[cubic-bezier(0.33,1,0.68,1)] scale-100' : ''}`}
          >
            <ChatHeader
              hasMessages={messages.length > 0}
              onClose={close}
              onClearChat={() => {
                close()
                setTimeout(onClearChat, 300)
              }}
            />

            <div
              className="flex-1 overflow-y-auto pb-21 flex flex-col"
              style={{ paddingTop: '20px' }}
              ref={messagesContainerRef}
            >
              {messages
                .filter((message) => getMessageText(message))
                .map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLastUserMessage={message.id === lastUserMessageId}
                  />
                ))}

              {showLoading && <TypingIndicator />}

              {status === 'error' && (
                <div
                  role="alert"
                  className="flex items-center justify-between mx-4 mb-4 rounded-full bg-alarm-surface p-3 pl-4 text-sm text-alarm"
                >
                  <p className="font-medium">Úps, eitthvað fór úrskeiðis</p>
                  <button
                    onClick={onRetry}
                    className="rounded-full bg-alarm-fill px-3 py-1.5 text-xs font-medium text-alarm hover:bg-alarm-fill-hover transition-colors cursor-pointer"
                  >
                    Reyna aftur
                  </button>
                </div>
              )}

              {status !== 'streaming' && lastMessage && (
                <MentionedCars lastMessage={lastMessage} onClose={close} />
              )}

              {status !== 'streaming' && lastMessageFollowUps.length > 0 && (
                <FollowUpSuggestions
                  suggestions={lastMessageFollowUps}
                  onSendMessage={onSendMessage}
                />
              )}
              <span ref={messagesEndRef} />
            </div>

            {/* Announcing only the finished text keeps a screen reader from
            re-reading the whole message on every token */}
            <div aria-live="polite" className="sr-only">
              {status !== 'streaming' ? lastAssistantText : ''}
            </div>
          </section>

          {composer}
        </>
      )}
    </Modal>
  )
}

export default ChatModal
