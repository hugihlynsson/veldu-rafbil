import type { TrackedEvent } from '@/modules/analytics/events'
import {
  deviceOf,
  MAX_BATCH,
  pageOf,
  type Page,
} from '@/modules/analytics/visit'

const ENDPOINT = '/api/events'
const SESSION_KEY = 'veldu-rafbil-session'

// Long enough that a run of taps goes as one request
const FLUSH_MS = 5_000

type Queued = TrackedEvent & { page: Page; at: number }

let queue: Queued[] = []
let timer: ReturnType<typeof setTimeout> | undefined
let listening = false
let unstoredSessionId: string | undefined

/**
 * What ties one tab's events together: kept for the tab, so it lasts a reload
 * and goes with the tab, and is never the same visitor on another day. Only a
 * secure origin has randomUUID, so a phone on the dev server sends nothing.
 */
const sessionId = (): string | undefined => {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored) return stored
    const id = crypto.randomUUID?.()
    if (id) sessionStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    unstoredSessionId ??= crypto.randomUUID?.()
    return unstoredSessionId
  }
}

const send = (body: string) => {
  // A beacon outlives the page, which a hidden tab may be about to be. Sent
  // as a string, so as text/plain: Chromium throws on a JSON Blob, as a type
  // a form could not send. The route reads the body as JSON whatever its type.
  try {
    if (navigator.sendBeacon?.(ENDPOINT, body)) return
  } catch {}
  fetch(ENDPOINT, { method: 'POST', body, keepalive: true }).catch(() => {})
}

/** Sends whatever is waiting, now */
export const flushTracked = (): void => {
  clearTimeout(timer)
  timer = undefined
  const waiting = queue
  queue = []
  const id = sessionId()
  if (!id || waiting.length === 0) return

  const now = Date.now()
  const device = deviceOf(window.innerWidth)
  for (let start = 0; start < waiting.length; start += MAX_BATCH) {
    const events = waiting
      .slice(start, start + MAX_BATCH)
      .map(({ at, ...event }) => ({ ...event, ageMs: Math.max(0, now - at) }))
    send(JSON.stringify({ sessionId: id, device, events }))
  }
}

// Hidden is the last a phone promises to say before it closes the tab, so what
// is waiting goes then rather than waiting for the timer
const listen = () => {
  if (listening) return
  listening = true
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushTracked()
  })
  window.addEventListener('pagehide', flushTracked)
}

/**
 * Reports something a visitor did, on the page it happened on: the current
 * one unless named, as a page that is being left already has the next path.
 * Sent with the others from the next few seconds, to /api/events.
 */
export const track = (event: TrackedEvent, page?: Page): void => {
  if (typeof window === 'undefined') return
  listen()
  queue.push({
    ...event,
    page: page ?? pageOf(window.location.pathname),
    at: Date.now(),
  })
  timer ??= setTimeout(flushTracked, FLUSH_MS)
}
