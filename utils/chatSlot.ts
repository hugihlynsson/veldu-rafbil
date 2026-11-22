import { createContext, use, useLayoutEffect, type ComponentProps } from 'react'

import type ChatContainer from '@/components/chat/ChatContainer'

export type ChatSettings = ComponentProps<typeof ChatContainer>

type SetChatSettings = (settings: ChatSettings | null) => void

export const ChatSlotContext = createContext<SetChatSettings>(() => {})

/**
 * Puts the page's settings on the chat bar, which the root layout holds so it
 * stays put as one page gives way to the next. Before paint, so a page never
 * shows a frame of the bar as the last one left it.
 */
const useChatSettings = ({
  hide,
  container,
  placeTaken,
  onShowCar,
  filters,
  onApplyFilters,
  about,
  starters,
}: ChatSettings) => {
  const setSettings = use(ChatSlotContext)

  // The page leaving clears them in the same commit as the next one sets its
  // own, so the bar only hides on a page that has none
  useLayoutEffect(() => {
    setSettings({
      hide,
      container,
      placeTaken,
      onShowCar,
      filters,
      onApplyFilters,
      about,
      starters,
    })
    return () => setSettings(null)
  }, [
    setSettings,
    hide,
    container,
    placeTaken,
    onShowCar,
    filters,
    onApplyFilters,
    about,
    starters,
  ])
}

export default useChatSettings
