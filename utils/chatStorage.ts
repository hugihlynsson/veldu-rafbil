import type { ChatMessage } from '@/modules/chat/message'

const CHAT_STORAGE_KEY = 'veldu-rafbil-chat-messages'

// Unvalidated, so the bar can tell a conversation is waiting without loading
// what reads one
export const hasStoredMessages = (): boolean => {
  try {
    return Boolean(localStorage.getItem(CHAT_STORAGE_KEY))
  } catch {
    return false
  }
}

// Private mode can make even reading throw
export const readStoredMessages = async (): Promise<ChatMessage[]> => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (!stored) return []
    // Behind an import() so the bar can import this file without zod
    const { parseStoredMessages } = await import('@/modules/chat/message')
    return await parseStoredMessages(stored)
  } catch {
    return []
  }
}

export const writeStoredMessages = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // A conversation too big to store is still fine to keep talking in
  }
}

export const clearStoredMessages = (): void => {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY)
  } catch {}
}
