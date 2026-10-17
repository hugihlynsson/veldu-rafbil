import type { FilterKey } from '@/modules/list/filters'
import {
  suggestionOutcome,
  type OutcomeAction,
  type ShownSuggestions,
} from '@/modules/list/suggestionOutcome'

const reportSuggestionOutcome = (
  action: OutcomeAction,
  shown: ShownSuggestions,
  tapped?: FilterKey,
): void => {
  fetch('/api/filter-suggestions/outcomes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      suggestionOutcome(action, shown, performance.now(), tapped),
    ),
  }).catch(() => {})
}

export default reportSuggestionOutcome
