import { z } from 'zod'

import cars, { type Car } from '@/modules/data/cars'
import carFilter from './carFilter'
import {
  filterKeys,
  normalizeFilters,
  type FilterKey,
  type Filters,
  type FilterValue,
} from './filters'

export type SuggestionSource = 'text' | 'model'

export type FilterSuggestion = {
  [Key in FilterKey]: {
    key: Key
    value: FilterValue<Key>
    source: SuggestionSource
    /** 1 for what the text says outright */
    probability: number
  }
}[FilterKey]

// In the order the chips stand in the list, so when MAX_SUGGESTIONS cuts what
// the text says, it cuts the narrower asks rather than price or seats
export const suggestionsFromFilters = (
  filters: Filters,
  source: SuggestionSource,
  probability = 1,
): FilterSuggestion[] =>
  filterKeys.flatMap((key) =>
    filters[key] === undefined
      ? []
      : [{ key, value: filters[key], source, probability } as FilterSuggestion],
  )

export const withSuggestion = (
  filters: Filters,
  suggestion: Pick<FilterSuggestion, 'key' | 'value'>,
): Filters => ({ ...filters, [suggestion.key]: suggestion.value })

const sameValue = (a: unknown, b: unknown) =>
  Array.isArray(a) && Array.isArray(b)
    ? [...a].sort().join() === [...b].sort().join()
    : a === b

const suggestionSchema = z.object({
  key: z.enum(filterKeys as [FilterKey, ...FilterKey[]]),
  value: z.unknown(),
  source: z.enum(['text', 'model']),
  probability: z.number().min(0).max(1),
})

/**
 * Suggestions as they arrive from the route, each put through the filter's own
 * parser: anything that would not survive the URL is no suggestion.
 */
export const readSuggestions = (json: unknown): FilterSuggestion[] => {
  const response = z
    .object({ suggestions: z.array(z.unknown()) })
    .safeParse(json)
  if (!response.success) return []

  // One at a time, so a suggestion that fails costs only itself
  return response.data.suggestions.flatMap((item) => {
    const read = suggestionSchema.safeParse(item)
    if (!read.success) return []
    const { key, value, source, probability } = read.data
    const parsed = normalizeFilters({ [key]: value })[key]
    return parsed === undefined
      ? []
      : [{ key, value: parsed, source, probability } as FilterSuggestion]
  })
}

export type RankedSuggestion = FilterSuggestion & {
  /** Cars the list would show with this added to the current filters */
  count: number
}

// Four, and the pill that adds them all, fit above the input on a phone with
// the keyboard up
export const MAX_SUGGESTIONS = 4

/**
 * The suggestions worth a chip, best first, each counted against the filters
 * already set. What the text says is always offered, even when it matches
 * nothing, since that is an answer. A model's guess is dropped when it narrows
 * nothing, or when it would take the suggestions together to zero: a wrong
 * filter quietly empties the list, and offering one is how it gets applied.
 */
export const rankSuggestions = (
  suggestions: ReadonlyArray<FilterSuggestion>,
  current: Filters,
  list: ReadonlyArray<Car> = cars,
): { suggestions: RankedSuggestion[]; combined: Filters; count: number } => {
  const count = (filters: Filters) =>
    list.filter(carFilter(normalizeFilters(filters))).length
  const currentCount = count(current)

  const ordered = [...suggestions].sort(
    (a, b) =>
      Number(b.source === 'text') - Number(a.source === 'text') ||
      b.probability - a.probability,
  )

  let combined = current
  const kept: RankedSuggestion[] = []
  for (const suggestion of ordered) {
    if (kept.length === MAX_SUGGESTIONS) break
    if (sameValue(current[suggestion.key], suggestion.value)) continue
    if (kept.some(({ key }) => key === suggestion.key)) continue

    const alone = count(withSuggestion(current, suggestion))
    const together = count(withSuggestion(combined, suggestion))
    if (
      suggestion.source === 'model' &&
      (together === 0 || alone === currentCount)
    )
      continue

    combined = withSuggestion(combined, suggestion)
    kept.push({ ...suggestion, count: alone })
  }

  return { suggestions: kept, combined, count: count(combined) }
}
