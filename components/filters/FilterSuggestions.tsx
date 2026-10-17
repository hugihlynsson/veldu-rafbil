import { useEffect, useRef, useState } from 'react'
import { trackEvent } from 'fathom-client'

import type { Filters } from '@/modules/list/filters'
import {
  MAX_INTENT_LENGTH,
  needsModel,
  parseFilterIntent,
} from '@/modules/list/filterIntent'
import {
  rankSuggestions,
  readSuggestions,
  suggestionsFromFilters,
  withSuggestion,
  type FilterSuggestion,
} from '@/modules/list/filterSuggestions'
import { filterChipText } from '@/modules/list/filterChips'
import type { ShownSuggestions } from '@/modules/list/suggestionOutcome'
import reportSuggestionOutcome from '@/utils/reportSuggestionOutcome'
import { agree } from '@/modules/copy/plural'
import SearchIcon from '@/components/SearchIcon'
import SuggestionPills, { type Pill } from '@/components/SuggestionPills'

const carCount = (count: number) => `${count} ${agree(count, 'bíll', 'bílar')}`

/**
 * What the route reads in the text, along with what the text says outright,
 * or null when offline, failed or refused, where the text's own reading still
 * stands. Apart from the component, which the React Compiler cannot compile
 * around a try/catch holding a conditional.
 */
const askRoute = async (
  body: { text: string; id: string; supersedes?: string },
  signal: AbortSignal,
): Promise<FilterSuggestion[] | null> => {
  try {
    const response = await fetch('/api/filter-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
    return response.ok ? readSuggestions(await response.json()) : null
  } catch {
    return null
  }
}

interface Props {
  /** Mounted on while hidden, so the pills it showed can play their exit */
  active: boolean
  text: string
  filters: Filters
  onApply: (filters: Filters) => void
  /** The pills on screen, or null, for the input to report a send past them */
  onShownChange?: (shown: ShownSuggestions | null) => void
}

/**
 * Pills for the filters the text asks for, each to be tapped rather than
 * applied, as a wrong one quietly empties the list. They change once per
 * pause in typing: what the text says outright, and the model's reading of
 * the rest when there is any, arrive together rather than one after the other.
 */
export default function FilterSuggestions({
  active,
  text,
  filters,
  onApply,
  onShownChange,
}: Props) {
  const [shown, setShown] = useState<{
    text: string
    requestId?: string
    suggestions: FilterSuggestion[]
    at: number
  }>({ text: '', suggestions: [], at: 0 })
  // A request typed past before it was answered, for the next one to name
  const unanswered = useRef<string | undefined>(undefined)

  // The route refuses a longer one, and the parser reads no further
  const request = active ? text.trim().slice(0, MAX_INTENT_LENGTH) : ''

  // Cleared or left, the pills go at once rather than after the pause
  if (request === '' && shown.text !== '') {
    setShown({ text: '', suggestions: [], at: 0 })
  }

  useEffect(() => {
    if (request === '') return

    const parsed = parseFilterIntent(request)
    const read = suggestionsFromFilters(parsed.filters, 'text')
    const controller = new AbortController()
    let inFlight: string | undefined

    const timer = setTimeout(async () => {
      let asked: FilterSuggestion[] | null = null
      if (needsModel(parsed)) {
        inFlight = crypto.randomUUID()
        const supersedes = unanswered.current
        unanswered.current = undefined
        asked = await askRoute(
          { text: request, id: inFlight, supersedes },
          controller.signal,
        )
      }
      // A later keystroke has its own request coming
      if (controller.signal.aborted) return
      setShown({
        text: request,
        requestId: inFlight,
        suggestions: asked ?? read,
        at: performance.now(),
      })
      inFlight = undefined
    }, 100)

    return () => {
      clearTimeout(timer)
      controller.abort()
      if (inFlight) unanswered.current = inFlight
    }
  }, [request])

  const { suggestions, combined, count } = rankSuggestions(
    shown.suggestions,
    filters,
  )
  const hasSuggestions = suggestions.length > 0

  // Once each time the pills appear, as what the taps are counted against
  useEffect(() => {
    if (hasSuggestions) trackEvent('Shown filter suggestions')
  }, [hasSuggestions])

  const onScreen = (): ShownSuggestions => ({
    text: shown.text,
    requestId: shown.requestId,
    suggestions,
    shownAt: shown.at,
  })

  useEffect(() => {
    onShownChange?.(hasSuggestions ? onScreen() : null)
  })

  const pills: Pill[] = suggestions.map((suggestion) => {
    const { label, value } = filterChipText(suggestion.key, suggestion.value)
    return {
      // Keyed by filter alone, so a value refined by the next keystroke
      // changes in place rather than leaving and arriving again
      key: suggestion.key,
      content: (
        <>
          <SearchIcon
            size={13}
            className="inline-block align-[-1px] mr-2 text-stone"
          />
          {label} {value}
          <CarCount count={suggestion.count} />
        </>
      ),
      ariaLabel: `Bæta við síu: ${label} ${value}, ${carCount(suggestion.count)}`,
      onClick: () => {
        trackEvent('Applied filter suggestion')
        reportSuggestionOutcome('applied', onScreen(), suggestion.key)
        onApply(withSuggestion(filters, suggestion))
      },
    }
  })

  if (pills.length > 1) {
    const addAll = `Bæta ${pills.length === 2 ? 'báðum' : 'öllum'} síum við`
    pills.push({
      key: 'all',
      content: (
        <>
          <SearchIcon
            size={13}
            className="inline-block align-[-1px] mr-2 text-stone"
          />
          {addAll}
          <CarCount count={count} />
        </>
      ),
      ariaLabel: `${addAll}, ${carCount(count)}`,
      onClick: () => {
        trackEvent('Applied all filter suggestions')
        reportSuggestionOutcome('appliedAll', onScreen())
        onApply(combined)
      },
    })
  }

  // Rising from the input, as the question suggestions do
  pills.forEach((pill, index) => {
    pill.enterDelay = (pills.length - 1 - index) * 0.06
  })

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {hasSuggestions &&
          `${suggestions.length} ${agree(suggestions.length, 'tillaga að síu', 'tillögur að síum')}`}
      </div>
      <SuggestionPills label="Tillögur að síum" pills={pills} />
    </>
  )
}

const CarCount = ({ count }: { count: number }) => (
  <span className="font-normal text-stone"> · {carCount(count)}</span>
)
