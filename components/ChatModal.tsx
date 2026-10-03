'use client'

import React from 'react'
import clsx from 'clsx'
import type { ChatStatus } from 'ai'
import type { Car } from '@/modules/cars'
import {
  getFollowUps,
  getMessageText,
  groupIntoTurns,
  type ChatMessage as Message,
} from '@/modules/chatMessage'
import { isAwaitingText, unansweredReason } from '@/modules/chatProgress'
import Modal, { panelMotion } from './Modal'
import ChatHeader from './chat/ChatHeader'
import ChatMessage from './chat/ChatMessage'
import FollowUpSuggestions from './chat/FollowUpSuggestions'
import MentionedCars from './chat/MentionedCars'
import TypingIndicator from './chat/TypingIndicator'

interface Props {
  onDone: () => void
  messages: Message[]
  status: ChatStatus
  error: Error | undefined
  onClearChat: () => void
  onReleaseBodyLock: () => void
  onSendMessage: (message: string) => void
  onRetry: () => void
  /** Puts a car the answer mentions on the list, before it is scrolled to */
  onShowCar: (car: Car) => void
  /** Inside the dialog, since showModal() makes the page outside it inert */
  composer: React.ReactNode
  /** Focused after open: showModal() would land on the close button */
  composerRef: React.RefObject<HTMLInputElement | null>
}

const ChatModal: React.FunctionComponent<Props> = ({
  onDone,
  messages,
  status,
  error,
  onClearChat,
  onReleaseBodyLock,
  onSendMessage,
  onRetry,
  onShowCar,
  composer,
  composerRef,
}) => {
  const lastMessage = messages[messages.length - 1]
  const lastAssistantText =
    lastMessage?.role === 'assistant' ? getMessageText(lastMessage) : ''
  const lastMessageFollowUps = getFollowUps(lastMessage)

  // Found once rather than per message, which is what reading it inside the
  // map below came to
  const lastUserMessageId = messages.findLast((m) => m.role === 'user')?.id

  const turns = groupIntoTurns(
    messages.filter((message) => getMessageText(message)),
  )

  const showLoading = isAwaitingText(messages, status)
  const unanswered = unansweredReason(messages, status, error)
  const unansweredAlert = unanswered && (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 mx-4 mb-4 rounded-full bg-alarm-surface p-3 pl-4 text-sm text-alarm"
    >
      <p className="font-medium">{unanswered}</p>
      <button
        onClick={onRetry}
        className="shrink-0 rounded-full bg-alarm-fill px-3 py-1.5 text-xs font-medium text-alarm hover:bg-alarm-fill-hover transition-colors cursor-pointer"
      >
        Reyna aftur
      </button>
    </div>
  )

  return (
    <Modal
      labelledBy="chat-modal-title"
      onDone={onDone}
      onLeave={onReleaseBodyLock}
      initialFocusRef={composerRef}
      className="items-start data-[state=visible]:backdrop:bg-backdrop"
    >
      {({ close }) => (
        <>
          <section
            className={clsx(
              'z-1 flex flex-col bg-glass/95 backdrop-blur-[20px] w-screen h-[calc(100dvh-var(--keyboard-inset))] overflow-hidden min-[600px]:h-[calc(100dvh-24px-var(--keyboard-inset))] min-[600px]:max-w-[600px] min-[600px]:w-[90vw] min-[600px]:rounded-t-3xl min-[600px]:rounded-b-4xl min-[600px]:mt-3 min-[600px]:shadow-(--shadow-modal)',
              panelMotion,
            )}
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
            >
              {turns.map((turn, index) => {
                const isLastTurn = index === turns.length - 1
                return (
                  // The last turn is at least a screen tall, so its question
                  // can scroll to the top and leave the rest to the answer
                  <div
                    key={turn[0].id}
                    className={clsx(
                      'flex flex-col shrink-0 mb-4 last:mb-0',
                      isLastTurn && 'min-h-full',
                    )}
                  >
                    {turn.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isLastUserMessage={message.id === lastUserMessageId}
                      />
                    ))}

                    {isLastTurn && (
                      <>
                        {showLoading && <TypingIndicator />}
                        {unansweredAlert}
                        {status !== 'streaming' && lastMessage && (
                          <MentionedCars
                            lastMessage={lastMessage}
                            onClose={close}
                            onShowCar={onShowCar}
                          />
                        )}
                        {status !== 'streaming' &&
                          lastMessageFollowUps.length > 0 && (
                            <FollowUpSuggestions
                              suggestions={lastMessageFollowUps}
                              onSendMessage={onSendMessage}
                            />
                          )}
                      </>
                    )}
                  </div>
                )
              })}
              {turns.length === 0 && unansweredAlert}
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
