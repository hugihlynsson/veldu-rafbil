import { describe, expect, it } from 'vitest'

import { CHAT_SUGGESTIONS } from './chatSuggestions'

describe('CHAT_SUGGESTIONS', () => {
  // The chat input offers three at a time, drawn without repeats
  it('has at least three, all different', () => {
    expect(new Set(CHAT_SUGGESTIONS).size).toBe(CHAT_SUGGESTIONS.length)
    expect(CHAT_SUGGESTIONS.length).toBeGreaterThanOrEqual(3)
  })
})
