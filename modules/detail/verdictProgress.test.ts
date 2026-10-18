import { describe, expect, it } from 'vitest'

import { THINKING_MS, verdictProgress } from './verdictProgress'

describe('verdictProgress', () => {
  it('starts empty and is three quarters across at the usual time', () => {
    expect(verdictProgress(0)).toBe(0)
    expect(verdictProgress(THINKING_MS)).toBeGreaterThan(0.7)
    expect(verdictProgress(THINKING_MS)).toBeLessThan(0.8)
  })

  // A bar that stops looks stuck, and one that fills looks done
  it('keeps moving through a long wait without reaching the end', () => {
    const later = verdictProgress(THINKING_MS * 4)
    expect(later).toBeGreaterThan(verdictProgress(THINKING_MS * 3))
    expect(later).toBeLessThan(0.9)
  })

  it('goes on from where the thinking left it once the writing begins', () => {
    const writingAt = THINKING_MS / 2
    expect(verdictProgress(writingAt, writingAt)).toBe(
      verdictProgress(writingAt),
    )
    expect(verdictProgress(writingAt + 2000, writingAt)).toBeGreaterThan(0.95)
    expect(verdictProgress(writingAt + 60_000, writingAt)).toBeLessThan(1)
  })
})
