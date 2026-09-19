'use client'

import React, { useEffect, useRef } from 'react'
import { UIDataTypes, UITools, ChatStatus, UIMessage } from 'ai'
import { parseFollowUps, stripFollowUps } from '../modules/chatHelpers'
import Modal from './Modal'
import ChatHeader from './chat/ChatHeader'
import ChatMessage from './chat/ChatMessage'
import FollowUpSuggestions from './chat/FollowUpSuggestions'
import MentionedCars from './chat/MentionedCars'
import TypingIndicator from './chat/TypingIndicator'

const emptyMessageFilter = (
  message: UIMessage<unknown, UIDataTypes, UITools>,
) =>
  message.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim()

interface Props {
  onDone: () => void
  messages: UIMessage<unknown, UIDataTypes, UITools>[]
  status: ChatStatus
  onClearChat: () => void
  onReleaseBodyLock: () => void
  onSendMessage: (message: string) => void
  onRetry: () => void
  /**
   * The chat input. It has to render inside the dialog: showModal() puts this
   * in the top layer and makes the rest of the page inert, so the floating
   * pill left behind out there is both hidden under the backdrop and dead to
   * every click. It sits next to the panel rather than inside it because the
   * panel is scaled and blurred, and a transform or a filter makes itself the
   * containing block of the fixed things below it.
   */
  composer: React.ReactNode
  /**
   * The composer's input, focused once the dialog is open. showModal() lands
   * on the first focusable thing, which is the close button, and being put
   * there after every send is no way to hold a conversation.
   */
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

  // Keep scroll at bottom during streaming to prevent jumps
  useEffect(() => {
    if (!messagesContainerRef.current) return

    const container = messagesContainerRef.current
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 20

    // If already near bottom and content is streaming, keep it scrolled to bottom
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, status])

  // Extract data from the last assistant message
  const lastMessage = messages[messages.length - 1]
  const lastAssistantText =
    lastMessage?.role === 'assistant'
      ? (lastMessage.parts
          ?.filter((part) => part.type === 'text')
          .map((part) => part.text)
          .join(' ') ?? '')
      : ''
  const lastMessageFollowUps = lastAssistantText
    ? parseFollowUps(lastAssistantText)
    : []

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
      className="items-start backdrop:duration-300 data-[state=visible]:backdrop:bg-black/20"
    >
      {({ isVisible, close }) => (
        <>
          <section
            className={`z-1 flex flex-col bg-white/95 backdrop-blur-[20px] w-screen h-dvh overflow-hidden scale-95 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.32,0,0.67,0)] min-[600px]:h-[calc(100dvh-24px)] min-[600px]:max-w-[600px] min-[600px]:w-[90vw] min-[600px]:rounded-[24px_24px_32px_32px] min-[600px]:mt-3 min-[600px]:shadow-[0px_8px_60px_rgba(0,0,0,0.15)] ${isVisible ? 'opacity-100 ease-[cubic-bezier(0.33,1,0.68,1)] scale-100' : ''}`}
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
              {messages.filter(emptyMessageFilter).map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLastUserMessage={
                    message.id ===
                    messages.findLast((m) => m.role === 'user')?.id
                  }
                />
              ))}

              {showLoading && <TypingIndicator />}

              {status === 'error' && (
                <div
                  role="alert"
                  className="flex items-center justify-between mx-4 mb-4 rounded-full bg-red-50 p-3 pl-4 text-sm text-red-700"
                >
                  <p className="font-medium">Úps, eitthvað fór úrskeiðis</p>
                  <button
                    onClick={onRetry}
                    className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
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

            {/* The answer arrives token by token into a region nothing watches.
            Announcing only the finished text keeps a screen reader from
            re-reading the whole message on every token. */}
            <div aria-live="polite" className="sr-only">
              {status !== 'streaming' && lastAssistantText
                ? stripFollowUps(lastAssistantText)
                : ''}
            </div>
          </section>

          {composer}
        </>
      )}
    </Modal>
  )
}

export default ChatModal
