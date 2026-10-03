import { useEffect, useState } from 'react'
import { trackEvent } from 'fathom-client'

import { Filters } from '@/types'
import {
  FilterSuggestion,
  MAX_INTENT_LENGTH,
  needsModel,
  parseFilterIntent,
  rankSuggestions,
  readSuggestions,
  suggestionsFromFilters,
  withSuggestion,
} from '@/modules/filterIntent'
import { agree } from '@/modules/plural'
import { filterChipText } from './ActiveFilters'
import SuggestionPills, { type Pill } from './SuggestionPills'

const carCount = (count: number) => `${count} ${agree(count, 'bíll', 'bílar')}`

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
      if (!needsModel(parsed)) {
        setShown({ text: request, suggestions: read })
        return
      }
      try {
        const response = await fetch('/api/filter-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: request }),
          signal: controller.signal,
        })
        // The route sends back what the text says along with the guesses
        setShown({
          text: request,
          suggestions: response.ok
            ? readSuggestions(await response.json())
            : read,
        })
      } catch {
        // Offline or failed, the text's own reading still stands; aborted, a
        // later keystroke has its own request coming
        if (!controller.signal.aborted) {
          setShown({ text: request, suggestions: read })
        }
      }
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

  const pills: Pill[] = suggestions.map((suggestion) => {
    const { label, value } = filterChipText(suggestion.key, suggestion.value)
    return {
      // Keyed by filter alone, so a value refined by the next keystroke
      // changes in place rather than leaving and arriving again
      key: suggestion.key,
      content: (
        <>
          + {label} {value}
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

  return <SuggestionPills label="Tillögur að síum" pills={pills} />
}

const CarCount = ({ count }: { count: number }) => (
  <span className="font-normal text-scrim/60"> · {carCount(count)}</span>
)
