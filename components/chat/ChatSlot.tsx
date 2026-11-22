'use client'

import { useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'

import { ChatSlotContext, type ChatSettings } from '@/utils/chatSlot'

// Keeps the AI SDK off every page's hydration path. The bar is fixed-position,
// so arriving a moment later shifts nothing.
const ChatContainer = dynamic(() => import('./ChatContainer'), { ssr: false })

interface Slot {
  /** The last page's that had any, kept so the bar can fade out with them */
  settings: ChatSettings | null
  isClaimed: boolean
}

/**
 * The one chat bar, held above the pages so that moving between them swaps
 * what it is about rather than remounting it, which would play its entrance
 * again and lose what was being typed. Each page puts its settings on it with
 * utils/chatSlot.
 */
export default function ChatSlot({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<Slot>({ settings: null, isClaimed: false })

  const setSettings = (settings: ChatSettings | null) =>
    setSlot((previous) =>
      settings
        ? { settings, isClaimed: true }
        : // Not the sheet's place, which leaves with the page it was on
          {
            settings: previous.settings && {
              ...previous.settings,
              container: undefined,
            },
            isClaimed: false,
          },
    )

  const { settings, isClaimed } = slot

  return (
    <ChatSlotContext value={setSettings}>
      {children}
      {/* Mounted with the first page that wants it, so it enters with that
          page's settings rather than hidden */}
      {settings && (
        <ChatContainer {...settings} hide={!isClaimed || settings.hide} />
      )}
    </ChatSlotContext>
  )
}
