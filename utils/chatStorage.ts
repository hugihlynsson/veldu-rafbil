import type { ChatMessage } from '@/modules/chat/message'

const CHAT_STORAGE_KEY = 'veldu-rafbil-chat-messages'
const CONVERSATION_ID_KEY = 'veldu-rafbil-chat-conversation'

// For when storage throws, so a conversation still keeps one id while the tab
// is open
let unstoredConversationId: string | undefined

// Only a secure origin has randomUUID, so a phone trying the dev server over
// the LAN goes without an id rather than without the chat
const newConversationId = (): string | undefined => crypto.randomUUID?.()

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

/**
 * The id the log groups this conversation's turns by. It is kept beside the
 * messages, as a stored conversation picked up days later is the same one,
 * and clearing the chat starts a new one.
 */
export const getConversationId = (): string | undefined => {
  try {
    const stored = localStorage.getItem(CONVERSATION_ID_KEY)
    if (stored) return stored
    const id = newConversationId()
    if (id) localStorage.setItem(CONVERSATION_ID_KEY, id)
    return id
  } catch {
    unstoredConversationId ??= newConversationId()
    return unstoredConversationId
  }
}

export const clearStoredMessages = (): void => {
  unstoredConversationId = undefined
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY)
    localStorage.removeItem(CONVERSATION_ID_KEY)
  } catch {}
}
