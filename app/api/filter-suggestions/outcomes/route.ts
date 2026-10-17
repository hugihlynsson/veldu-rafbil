import { suggestionOutcomeRateLimit } from '@/modules/rateLimit'
import {
  deployment,
  invalidBody,
  logAfterResponse,
  readGuardedBody,
} from '../../publicEndpoint'
import { outcomeLogEvent, outcomeSchema } from './outcome'

export async function POST(req: Request) {
  const read = await readGuardedBody(req, suggestionOutcomeRateLimit)
  if (read instanceof Response) return read

  const parsed = outcomeSchema.safeParse(read.body)
  if (!parsed.success) return invalidBody()

  const timestamp = new Date().toISOString()
  logAfterResponse(() => outcomeLogEvent(parsed.data, timestamp, deployment()))

  return new Response(null, { status: 204 })
}
