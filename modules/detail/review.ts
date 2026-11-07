import type { Car } from '@/modules/data/cars'
import carReviews, { type CarReview } from '@/modules/data/carReviews'
import { carSlug } from '@/modules/data/getCarId'

/** The review a car is shown with: buying advice, which a car no longer sold new is past */
export const reviewOf = (car: Car): CarReview | undefined =>
  car.deprecated ? undefined : carReviews[carSlug(car)]

/** What the sheet over the list fetches of a review: what it shows, and the chat's starters */
export type SheetReview = Pick<CarReview, 'paragraphs' | 'questions'>

export const sheetReviewOf = (car: Car): SheetReview | null => {
  const review = reviewOf(car)
  return review
    ? { paragraphs: review.paragraphs, questions: review.questions }
    : null
}
