import { parseStoredMessages, type ChatMessage } from '@/modules/chatMessage'

const CHAT_STORAGE_KEY = 'veldu-rafbil-chat-messages'

// Private mode can make even reading throw
export const readStoredMessages = async (): Promise<ChatMessage[]> => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    return stored ? await parseStoredMessages(stored) : []
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
