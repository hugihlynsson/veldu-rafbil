import { useLayoutEffect, type MouseEvent } from 'react'

import { scrollDepth } from '@/modules/analytics/visit'
import type { Car } from '@/modules/data/cars'
import { carPathOf } from '@/modules/detail/paths'

// A mouse on a screen as wide as --breakpoint-md, where the list stays in
// view around the sheet. A phone keeps going to the car's page, which takes
// the whole screen either way.
const SHEET_MEDIA = '(min-width: 768px) and (pointer: fine)'

/** A click the page may take over, rather than one asking for a new tab */
export const isPlainClick = (event: MouseEvent): boolean =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey

/** Whether a car opens in a sheet over the list, for this click if any */
export const opensInSheet = (event?: MouseEvent): boolean =>
  (!event || isPlainClick(event)) && window.matchMedia(SHEET_MEDIA).matches

/**
 * Opens the sheet at the car's own address, so back closes it and a reload or
 * a copied link is the car's page. The list's query comes along: nuqs reads
 * the sorting and the filters from the URL whatever its path, and the list
 * behind the sheet would reset without it.
 */
export const showCarSheet = (car: Car, history: 'push' | 'replace') => {
  const url = `${carPathOf(car)}${window.location.search}`
  if (history === 'push') window.history.pushState(null, '', url)
  else window.history.replaceState(null, '', url)
}

export const closeCarSheet = () => window.history.back()

let listShown = false
let sheetPanel: HTMLElement | null = null

/**
 * Held by the list while it is mounted, so a car's path read with it is the
 * sheet over it rather than the car's page. A layout effect, so it is set
 * before any page's passive effects read it in the same commit.
 */
export const useListShown = () =>
  useLayoutEffect(() => {
    listShown = true
    return () => {
      listShown = false
    }
  }, [])

export const isListShown = (): boolean => listShown

/** The sheet's panel, which scrolls in the page's place while it is open */
export const holdSheetPanel = (panel: HTMLElement): (() => void) => {
  sheetPanel = panel
  return () => {
    if (sheetPanel === panel) sheetPanel = null
  }
}

/** How far down the sheet has been read; the top until it has arrived */
export const sheetScrollDepth = (): number =>
  sheetPanel
    ? scrollDepth(
        sheetPanel.scrollTop,
        sheetPanel.clientHeight,
        sheetPanel.scrollHeight,
      )
    : 0
