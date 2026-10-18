import { eventRows, readBatch } from '@/modules/analytics/events'
import { productEventRateLimit } from '@/modules/rateLimit'
import {
  deployment,
  ingestAfterResponse,
  invalidBody,
  PRODUCT_EVENTS_DATASET,
  readGuardedBody,
} from '../publicEndpoint'

// Vercel's, from the address; anything else in the header is not a country
const countryOf = (request: Request): string | undefined => {
  const country = request.headers.get('x-vercel-ip-country')
  return country && /^[A-Z]{2}$/.test(country) ? country : undefined
}

/**
 * How the pages are used, a few events at a time. A beacon reads no answer,
 * so there is nothing to send back but whether the batch was taken.
 */
export async function POST(req: Request) {
  const read = await readGuardedBody(req, productEventRateLimit)
  if (read instanceof Response) return read

  const batch = readBatch(read.body)
  if (!batch) return invalidBody()

  const receipt = {
    receivedAt: Date.now(),
    country: countryOf(req),
    ...deployment(),
  }
  ingestAfterResponse(PRODUCT_EVENTS_DATASET, () => eventRows(batch, receipt))

  return new Response(null, { status: 204 })
}
