import { describe, expect, it } from 'vitest'
import { scheduleWords, startReveal } from './reveal'

describe('scheduleWords', () => {
  it('spreads the first burst over a moment from when it arrived', () => {
    const { times } = scheduleWords(startReveal(), 10, 1000)
    expect(times[0]).toBe(1000)
    expect(times[9]).toBeGreaterThan(1100)
    expect(times[9]).toBeLessThan(1300)
  })

  it('keeps the words in order, never before they arrived', () => {
    let reveal = startReveal()
    let last = -Infinity
    const bursts: [count: number, now: number][] = [
      [6, 0],
      [10, 319],
      [13, 508],
      [10, 652],
      [11, 883],
    ]
    for (const [count, now] of bursts) {
      const result = scheduleWords(reveal, count, now)
      reveal = result.reveal
      for (const time of result.times) {
        expect(time).toBeGreaterThanOrEqual(now)
        expect(time).toBeGreaterThan(last)
        last = time
      }
    }
  })

  it('starts a burst after the words still waiting from the one before', () => {
    const first = scheduleWords(startReveal(), 10, 0)
    const second = scheduleWords(first.reveal, 10, 50)
    expect(second.times[0]).toBe(first.reveal.cursor)
  })

  it('catches up when bursts arrive faster than they are shown', () => {
    let reveal = startReveal()
    for (let now = 0; now <= 1000; now += 20) {
      reveal = scheduleWords(reveal, 10, now).reveal
    }
    // 51 bursts of ten at four ms a word at the least
    expect(reveal.cursor).toBeLessThan(1000 + 51 * 10 * 4)
  })

  it('follows the pace the bursts arrive at', () => {
    let fast = startReveal()
    let slow = startReveal()
    for (let i = 0; i < 10; i++) {
      fast = scheduleWords(fast, 10, i * 100).reveal
      slow = scheduleWords(slow, 10, i * 400).reveal
    }
    expect(fast.gap).toBeLessThan(150)
    expect(slow.gap).toBeGreaterThan(300)
  })

  it('does not take a pause for a tool call as the pace', () => {
    const first = scheduleWords(startReveal(), 10, 0)
    const { times } = scheduleWords(first.reveal, 1, 5000)
    const after = scheduleWords(first.reveal, 10, 5000)
    expect(after.reveal.gap).toBeLessThanOrEqual(500)
    expect(times).toEqual([5000])
  })

  it('leaves the reveal alone when nothing arrived', () => {
    const reveal = startReveal()
    expect(scheduleWords(reveal, 0, 100)).toEqual({ times: [], reveal })
  })
})
