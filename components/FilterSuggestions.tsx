import { useEffect, useState } from 'react'
import { trackEvent } from 'fathom-client'
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

const pillClasses = clsx(
  'bg-raised/70 backdrop-blur-xl border border-scrim/6 rounded-2xl p-[12px_16px] text-sm font-medium text-tint cursor-pointer transition-all duration-200 text-left whitespace-nowrap shadow-(--shadow-chip) animate-[fadeInUpRotate_0.3s_ease-out_backwards]',
  'hover:bg-raised/90 hover:text-tint hover:-translate-y-0.5 hover:shadow-(--shadow-chip-hover)',
  'active:translate-y-0',
)

const carCount = (count: number) => `${count} ${agree(count, 'bíll', 'bílar')}`

interface Props {
  text: string
  filters: Filters
  onApply: (filters: Filters) => void
}

/**
 * Pills for the filters the text asks for, each to be tapped rather than
 * applied, as a wrong one quietly empties the list. What the text says
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

  if (!suggestions.length) return null

  const pills = [
    ...suggestions.map((suggestion) => {
      const { label, value } = filterChipText(suggestion.key, suggestion.value)
      return {
        // Keyed by filter alone, so a value refined by the next keystroke
        // changes in place rather than animating in again
        key: suggestion.key,
        text: `${label} ${value}`,
        count: suggestion.count,
        onClick: () => {
          trackEvent('Applied filter suggestion')
          onApply(withSuggestion(filters, suggestion))
        },
      }
    }),
    ...(suggestions.length > 1
      ? [
          {
            key: 'all',
            text: 'Bæta öllum síum við',
            count,
            onClick: () => {
              trackEvent('Applied all filter suggestions')
              onApply(combined)
            },
          },
        ]
      : []),
  ]

  return (
    <fieldset
      aria-label="Tillögur að síum"
      className="pointer-events-auto m-0 flex min-w-0 flex-col gap-2 border-0 p-0"
    >
      {pills.map((pill, index) => (
        <button
          key={pill.key}
          type="button"
          aria-label={`${pill.key === 'all' ? pill.text : `Bæta við síu: ${pill.text}`}, ${carCount(pill.count)}`}
          className={pillClasses}
          // Rising from the input, as the question suggestions do
          style={{ animationDelay: `${(pills.length - 1 - index) * 0.06}s` }}
          // Keeps the input's blur from firing before the click lands;
          // Safari does not focus buttons on click
          onMouseDown={(event) => event.preventDefault()}
          onClick={pill.onClick}
        >
          {pill.key === 'all' ? pill.text : `+ ${pill.text}`}
          <span className="font-normal text-scrim/60">
            {' '}
            · {carCount(pill.count)}
          </span>
        </button>
      ))}
    </fieldset>
  )
}
