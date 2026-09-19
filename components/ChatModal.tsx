'use client'

import React, { useEffect, useState, useRef } from 'react'
import { UIDataTypes, UITools, ChatStatus, UIMessage } from 'ai'
import { parseFollowUps } from '../utils/chatHelpers'
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
}

enum State {
  Initializing,
  Visible,
  Leaving,
}

const ChatModal: React.FunctionComponent<Props> = ({
  onDone,
  messages,
  status,
  onClearChat,
  onReleaseBodyLock,
  onSendMessage,
  onRetry,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [state, setState] = useState<State>(State.Initializing)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const hasScrolledToInitialPosition = useRef(false)

  useEffect(() => {
    dialogRef.current?.showModal()
    setTimeout(() => setState(() => State.Visible), 1)

    // Mark that initial position has been set after a short delay
    setTimeout(() => {
      hasScrolledToInitialPosition.current = true
    }, 10)
  }, [])

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

  const handleClose = () => {
    setState(() => State.Leaving)
    onReleaseBodyLock()
    setTimeout(() => {
      // Closing before unmount is what hands focus back to the chat input
      dialogRef.current?.close()
      onDone()
    }, 300)
  }

  // Extract data from the last assistant message
  const lastMessage = messages[messages.length - 1]
  const lastMessageFollowUps =
    lastMessage?.role === 'assistant'
      ? (() => {
          const textContent = lastMessage.parts
            ?.filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join(' ')
          return textContent ? parseFollowUps(textContent) : []
        })()
      : []

  const showLoading =
    (lastMessage?.role === 'user' && status !== 'error') ||
    (status === 'streaming' &&
      !lastMessage?.parts?.some(({ type }) => type === 'text'))

  return (
    // oxlint and jsx-a11y do not know <dialog>: the click is backdrop dismissal
    // and Escape is handled natively through onCancel below
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      aria-labelledby="chat-modal-title"
      className={`hidden open:flex fixed inset-0 m-0 h-full max-h-none w-full max-w-none items-start justify-center border-0 bg-transparent p-0 backdrop:bg-black/0 backdrop:transition-[background-color] backdrop:duration-300 backdrop:delay-100 ${state === State.Visible ? 'backdrop:delay-0 backdrop:bg-black/20' : ''}`}
      onCancel={(event) => {
        // Escape: animate out rather than letting the browser close instantly
        event.preventDefault()
        handleClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose()
      }}
    >
      <section
        className={`z-1 flex flex-col bg-white/95 backdrop-blur-[20px] w-screen h-dvh overflow-hidden scale-95 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.32,0,0.67,0)] min-[600px]:h-[calc(100dvh-24px)] min-[600px]:max-w-[600px] min-[600px]:w-[90vw] min-[600px]:rounded-[24px_24px_32px_32px] min-[600px]:mt-3 min-[600px]:shadow-[0px_8px_60px_rgba(0,0,0,0.15)] ${state === State.Visible ? 'opacity-100 ease-[cubic-bezier(0.33,1,0.68,1)] scale-100' : ''}`}
      >
        <ChatHeader
          hasMessages={messages.length > 0}
          onClose={handleClose}
          onClearChat={() => {
            handleClose()
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
                message.id === messages.findLast((m) => m.role === 'user')?.id
              }
            />
          ))}

          {showLoading && <TypingIndicator />}

          {status === 'error' && (
            <div className="flex items-center justify-between mx-4 mb-4 rounded-full bg-red-50 p-3 pl-4 text-sm text-red-700">
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
            <MentionedCars lastMessage={lastMessage} onClose={handleClose} />
          )}

          {status !== 'streaming' && lastMessageFollowUps.length > 0 && (
            <FollowUpSuggestions
              suggestions={lastMessageFollowUps}
              onSendMessage={onSendMessage}
            />
          )}
          <span ref={messagesEndRef} />
        </div>
      </section>
    </dialog>
  )
}

export default ChatModal
