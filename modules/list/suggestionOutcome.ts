import type { FilterKey } from './filters'
import type { RankedSuggestion } from './filterSuggestions'

/** The pills on screen, and what they were made from */
export interface ShownSuggestions {
  text: string
  /** The route request they came from, when the parser alone did not answer */
  requestId: string | undefined
  suggestions: RankedSuggestion[]
  shownAt: number
}

export type OutcomeAction = 'applied' | 'appliedAll' | 'sent'

export interface SuggestionOutcome {
  action: OutcomeAction
  text: string
  requestId?: string
  suggestions: RankedSuggestion[]
  /** The pill tapped, for `applied` */
  tapped?: FilterKey
  shownMs: number
}

/**
 * What happened to the pills on screen: one tapped, all of them, or the text
 * sent to the advisor past them. Kept apart from zod, as the chat bar sends
 * the last one.
 */
export const suggestionOutcome = (
  action: OutcomeAction,
  shown: ShownSuggestions,
  now: number,
  tapped?: FilterKey,
): SuggestionOutcome => ({
  action,
  text: shown.text,
  ...(shown.requestId && { requestId: shown.requestId }),
  suggestions: shown.suggestions,
  ...(tapped && { tapped }),
  shownMs: Math.max(0, Math.round(now - shown.shownAt)),
})
