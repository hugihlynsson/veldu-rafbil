import { useEffect, useState } from 'react'
import clsx from 'clsx'

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

const chipClasses =
  'shrink-0 text-xs font-semibold py-1 px-2.5 border border-line-strong rounded-full cursor-pointer bg-surface text-clay transition-all duration-200 hover:bg-cloud active:text-tint'

interface Props {
  text: string
  filters: Filters
  onApply: (filters: Filters) => void
}

/**
 * Chips for the filters a description asks for, each to be tapped rather
 * than applied, as a wrong one quietly empties the list. What the text says
 * outright is read here as it is typed; only what is left goes to the route.
 */
export default function FilterSuggestions({ text, filters, onApply }: Props) {
  const [answer, setAnswer] = useState<{
    text: string
    suggestions: FilterSuggestion[]
  }>()

  // The route refuses a longer one, and the parser reads no further
  const request = text.trim().slice(0, MAX_INTENT_LENGTH)
  const parsed = parseFilterIntent(request)
  const asksModel = needsModel(parsed)

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
        // Aborted by the next keystroke, or offline: the text's chips stand
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
  const reading = asksModel && !answered

  if (!suggestions.length && !reading) return null

  return (
    <div className="flex flex-wrap items-center gap-2 -mt-4 mb-6 px-1">
      {suggestions.map((suggestion) => {
        const { label, value } = filterChipText(
          suggestion.key,
          suggestion.value,
        )
        const cars = agree(suggestion.count, 'bíll', 'bílar')
        return (
          <button
            key={suggestion.key}
            type="button"
            aria-label={`Bæta við síu: ${label} ${value}, ${suggestion.count} ${cars}`}
            // Dashed where it is a guess at what the words meant
            className={clsx(
              chipClasses,
              suggestion.source === 'model' && 'border-dashed',
            )}
            onClick={() => onApply(withSuggestion(filters, suggestion))}
          >
            + {label} <span className="text-tint">{value}</span>{' '}
            <span className="font-normal">· {suggestion.count}</span>
          </button>
        )
      })}
      {suggestions.length > 1 && (
        <button
          type="button"
          className={clsx(chipClasses, 'text-tint')}
          onClick={() => onApply(combined)}
        >
          Nota allar <span className="font-normal text-clay">· {count}</span>
        </button>
      )}
      {reading && (
        <span aria-hidden className="text-xs text-clay">
          …
        </span>
      )}
    </div>
  )
}
