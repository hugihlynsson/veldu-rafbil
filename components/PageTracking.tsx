'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import {
  MAX_DURATION_MS,
  pageOf,
  referrerHost,
  scrollDepth,
  type PageKind,
} from '@/modules/analytics/visit'
import { isListShown, sheetScrollDepth } from '@/utils/carSheet'
import { takePageBeforeLoad } from '@/utils/pageBeforeLoad'
import { flushTracked, track } from '@/utils/track'

// The page before this one in the tab, for the next to say it came from
let previousPage: PageKind | undefined
// Only the first page of a document was reached from document.referrer
let isFirstView = true

const newViewId = () =>
  crypto.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)

const currentDepth = () =>
  scrollDepth(
    window.scrollY,
    window.innerHeight,
    document.documentElement.scrollHeight,
  )

/**
 * A view of each page and how it was left: the time it was looked at, and how
 * far down it was read. On the path alone, as Fathom counts them: a sort or a
 * filter rewrites the query in place and is the same page.
 */
export default function PageTracking() {
  const pathname = usePathname()

  useEffect(() => {
    const page = pageOf(pathname)
    const viewId = newViewId()
    const referrer = isFirstView
      ? referrerHost(document.referrer, window.location.host)
      : undefined
    const from = isFirstView ? takePageBeforeLoad() : previousPage
    isFirstView = false
    // The list stays under the sheet with the page locked behind it, so the
    // sheet's own panel is what is read, and the query is still the list's
    const inSheet = page.kind === 'car' && isListShown()
    const depth = inSheet ? sheetScrollDepth : currentDepth

    track({
      name: 'page_viewed',
      viewId,
      from,
      query: inSheet ? '' : window.location.search.slice(0, 300),
      ...(referrer && { referrer }),
      ...(inSheet && { sheet: true }),
    })
    previousPage = page.kind

    let engagedMs = 0
    let visibleSince: number | null =
      document.visibilityState === 'visible' ? performance.now() : null
    // A sheet opens at its top, but a car swapped into one is counted before
    // the panel is scrolled back up from the last
    let maxScroll = inSheet ? 0 : depth()
    let measuring = false

    const engaged = () =>
      Math.min(
        MAX_DURATION_MS,
        Math.round(
          engagedMs +
            (visibleSince === null ? 0 : performance.now() - visibleSince),
        ),
      )

    const report = () =>
      track(
        { name: 'page_left', viewId, engagedMs: engaged(), maxScroll },
        page,
      )

    // Measured once a frame at most, as scroll fires faster than that
    const onScroll = () => {
      if (measuring) return
      measuring = true
      requestAnimationFrame(() => {
        measuring = false
        maxScroll = Math.max(maxScroll, depth())
      })
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        engagedMs = engaged()
        visibleSince = null
        report()
        // The tab may never come back, so this goes now rather than later
        flushTracked()
      } else {
        visibleSince = performance.now()
      }
    }

    // Capturing, as a scroll inside the sheet's panel does not bubble
    window.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    })
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true })
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (visibleSince !== null) report()
    }
  }, [pathname])

  return null
}
