'use client'

import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import type { ChatStatus } from 'ai'
import type { Car } from '@/modules/data/cars'
import {
  getFollowUps,
  getMessageText,
  groupIntoTurns,
  type ChatMessage as Message,
} from '@/modules/chat/message'
import { isAwaitingText, unansweredReason } from '@/modules/chat/progress'
import Modal, { panelMotion } from '@/components/Modal'
import ChatHeader from './ChatHeader'
import ChatMessage from './ChatMessage'
import FollowUpSuggestions from './FollowUpSuggestions'
import MentionedCars from './MentionedCars'
import TypingIndicator from './TypingIndicator'

interface Props {
  /** Once the chat has closed, with the car picked from an answer if one was */
  onDone: (pickedCar?: Car) => void
  messages: Message[]
  status: ChatStatus
  error: Error | undefined
  onClearChat: () => void
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
  error,
  onClearChat,
  onSendMessage,
  onRetry,
  composer,
  composerRef,
}) => {
  // Held until the dialog has closed: the page behind it is inert until then,
  // and the car's card could not take the focus
  const pickedCar = useRef<Car | undefined>(undefined)
  const lastMessage = messages[messages.length - 1]
  // Reopening shows what was already said as it was left; only what arrives
  // while the chat is open animates in, over the panel's own entrance
  const [idsOnOpen] = useState(() => new Set(messages.map(({ id }) => id)))
  // The cars and follow-ups wait for the stream, so they were only on screen
  // if it had finished
  const [settledIdOnOpen] = useState(() =>
    status === 'streaming' ? undefined : lastMessage?.id,
  )
  const animateExtras = lastMessage?.id !== settledIdOnOpen
  const lastAssistantText =
    lastMessage?.role === 'assistant' ? getMessageText(lastMessage) : ''
  const lastMessageFollowUps = getFollowUps(lastMessage)

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
      onDone={() => onDone(pickedCar.current)}
      initialFocusRef={composerRef}
      className="items-start data-[state=visible]:backdrop:bg-backdrop"
    >
      {({ close }) => (
        <>
          <section
            className={clsx(
              'z-1 flex flex-col bg-glass/95 backdrop-blur-[20px] w-screen h-[calc(100dvh-var(--keyboard-inset))] overflow-hidden chat-panel:h-[calc(100dvh-24px-var(--keyboard-inset))] chat-panel:max-w-[600px] chat-panel:w-[90vw] chat-panel:rounded-t-3xl chat-panel:rounded-b-4xl chat-panel:mt-3 chat-panel:shadow-(--shadow-modal)',
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

            <div className="flex-1 overflow-y-auto pt-5 pb-21 flex flex-col">
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
                        animate={!idsOnOpen.has(message.id)}
                      />
                    ))}

                    {isLastTurn && (
                      <>
                        {showLoading && <TypingIndicator />}
                        {unansweredAlert}
                        {status !== 'streaming' && lastMessage && (
                          <MentionedCars
                            lastMessage={lastMessage}
                            animate={animateExtras}
                            onPick={(car) => {
                              pickedCar.current = car
                              close()
                            }}
                          />
                        )}
                        {status !== 'streaming' &&
                          lastMessageFollowUps.length > 0 && (
                            <FollowUpSuggestions
                              suggestions={lastMessageFollowUps}
                              animate={animateExtras}
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
