import { z } from 'zod'

import cars from '@/modules/data/cars'
import { filterKeys, type FilterKey } from '@/modules/list/filters'
import { MAX_INTENT_LENGTH } from '@/modules/list/filterIntent'
import {
  MAX_SUGGESTIONS,
  readSuggestion,
} from '@/modules/list/filterSuggestions'
import type { Deployment } from '../../publicEndpoint'

// Anything else a caller sends would only be written to the logs as it came
const pillSchema = z
  .object({ count: z.int().min(0).max(cars.length) })
  .passthrough()
  .transform((item, context) => {
    const suggestion = readSuggestion(item)
    if (suggestion) return { ...suggestion, count: item.count }
    context.addIssue({ code: 'custom', message: 'Not a filter suggestion' })
    return z.NEVER
  })

export const outcomeSchema = z
  .strictObject({
    action: z.enum(['applied', 'appliedAll', 'sent']),
    text: z.string().trim().min(1).max(MAX_INTENT_LENGTH),
    requestId: z.uuid().optional(),
    suggestions: z.array(pillSchema).min(1).max(MAX_SUGGESTIONS),
    tapped: z.enum(filterKeys as [FilterKey, ...FilterKey[]]).optional(),
    shownMs: z.int().min(0).max(3_600_000),
  })
  .refine(
    ({ action, tapped, suggestions }) =>
      action === 'applied'
        ? suggestions.some(({ key }) => key === tapped)
        : tapped === undefined,
    'A tap names one of the pills shown, and only a tap names one',
  )

export type Outcome = z.infer<typeof outcomeSchema>

/**
 * What happened to a set of pills. `requestId` joins it to the request's own
 * filter_suggestions event; without one the parser alone made the pills.
 */
export const outcomeLogEvent = (
  outcome: Outcome,
  timestamp: string,
  { environment, commit }: Deployment,
) => ({
  type: 'filter_suggestion_outcome',
  timestamp,
  ...outcome,
  environment,
  commit,
})
