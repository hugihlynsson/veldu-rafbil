import { UIDataTypes, UIMessage, UITools } from 'ai'

export const CHAT_STORAGE_KEY = 'veldu-rafbil-chat-messages'

type StoredMessage = UIMessage<unknown, UIDataTypes, UITools>

// Any of these can throw — private mode, a full quota, JSON from an older
// shape — and a broken history must read as an empty one.
export const readStoredMessages = (): StoredMessage[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const writeStoredMessages = (messages: StoredMessage[]): void => {
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
