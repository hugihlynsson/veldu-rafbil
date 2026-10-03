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
 * applied, as a wrong one quietly empties the list. What the text says
 * outright is read here as it is typed; only what is left goes to the route.
 */
export default function FilterSuggestions({
  active,
  text,
  filters,
  onApply,
}: Props) {
  const [answer, setAnswer] = useState<{
    text: string
    suggestions: FilterSuggestion[]
  }>()

  // The route refuses a longer one, and the parser reads no further
  const request = active ? text.trim().slice(0, MAX_INTENT_LENGTH) : ''
  const parsed = parseFilterIntent(request)
  const asksModel = request !== '' && needsModel(parsed)

  useEffect(() => {
    if (!asksModel) return

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/filter-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: request }),
          signal: controller.signal,
        })
        if (!response.ok) return
        setAnswer({
          text: request,
          suggestions: readSuggestions(await response.json()),
        })
      } catch {
        // Aborted by the next keystroke, or offline: the text's pills stand
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [request, asksModel])

  const answered = answer?.text === request
  const { suggestions, combined, count } = rankSuggestions(
    answered
      ? answer.suggestions
      : suggestionsFromFilters(parsed.filters, 'text'),
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
    pills.push({
      key: 'all',
      content: (
        <>
          Bæta öllum síum við
          <CarCount count={count} />
        </>
      ),
      ariaLabel: `Bæta öllum síum við, ${carCount(count)}`,
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
