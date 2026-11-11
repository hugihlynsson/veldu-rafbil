import type { Car } from '@/modules/data/cars'
import type { NewsKind } from '@/modules/news/news'
import { buildEnvelope, toApiCar, type ApiCar, type Envelope } from '../carApi'
import { carSlug } from '@/modules/data/getCarId'
import { historyOf } from '@/modules/news/history'
import { reviewOf } from '@/modules/detail/review'

// What one car's page holds beyond its row in /api/cars, under the same
// promise: shaped for readers outside the repo, and changed on purpose. The
// row is repeated so one fetch answers a question about one car.
export interface CarDetailPayload extends Envelope {
  notes: { figures: string; review: string; history: string }
  car: ApiCar & {
    // A car no longer sold new keeps its page and its history, but no review
    soldNew: boolean
    evDatabaseUrl?: string
  }
  review: { paragraphs: ReadonlyArray<string> } | null
  history: Array<ApiChange>
}

export interface ApiChange {
  date: string
  kind: NewsKind
  // The seller's price, before the grant: what a past day's grant was is not
  // kept, so a past price with it taken off would be a guess
  listPrice?: { from?: number; to: number }
  expectedDelivery?: { from?: string; to?: string }
  renamedFrom?: string
}

export const buildCarDetail = (
  car: Car,
  generatedAt: Date,
  commit?: string,
): CarDetailPayload => {
  const review = reviewOf(car)

  return {
    ...buildEnvelope(generatedAt, commit),
    notes: {
      figures:
        'car reads exactly as a row of /api/cars, whose grant and notes explain the figures.',
      review:
        'In Icelandic, as shown on the car’s page. Written from the figures above, and rewritten when they change. Null for a car no longer sold new.',
      history:
        'Newest first, from 2020. Prices here are list prices, before the grant.',
    },
    car: {
      ...toApiCar(car),
      soldNew: !car.deprecated,
      ...(car.evDatabaseUrl ? { evDatabaseUrl: car.evDatabaseUrl } : {}),
    },
    review: review ? { paragraphs: review.paragraphs } : null,
    history: historyOf(carSlug(car)).map(
      ({ date, kind, price, delivery, renamedFrom }) => ({
        date,
        kind,
        ...(price ? { listPrice: price } : {}),
        ...(delivery ? { expectedDelivery: delivery } : {}),
        ...(renamedFrom ? { renamedFrom } : {}),
      }),
    ),
  }
}
