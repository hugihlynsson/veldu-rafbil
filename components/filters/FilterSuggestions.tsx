import { useEffect, useState } from 'react'
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
  text: string,
  signal: AbortSignal,
): Promise<FilterSuggestion[] | null> => {
  try {
    const response = await fetch('/api/filter-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
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
}: Props) {
  const [shown, setShown] = useState<{
    text: string
    suggestions: FilterSuggestion[]
  }>({ text: '', suggestions: [] })

  // The route refuses a longer one, and the parser reads no further
  const request = active ? text.trim().slice(0, MAX_INTENT_LENGTH) : ''

  // Cleared or left, the pills go at once rather than after the pause
  if (request === '' && shown.text !== '') {
    setShown({ text: '', suggestions: [] })
  }

  useEffect(() => {
    if (request === '') return

    const parsed = parseFilterIntent(request)
    const read = suggestionsFromFilters(parsed.filters, 'text')
    const controller = new AbortController()

    const timer = setTimeout(async () => {
      const asked = needsModel(parsed)
        ? await askRoute(request, controller.signal)
        : null
      // A later keystroke has its own request coming
      if (controller.signal.aborted) return
      setShown({ text: request, suggestions: asked ?? read })
    }, 100)

    return () => {
      clearTimeout(timer)
      controller.abort()
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
