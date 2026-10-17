import { FunctionComponent } from 'react'

import type { CarReview } from '@/modules/data/carReviews'

/** The car's review, under its figures */
const Review: FunctionComponent<{ review: CarReview }> = ({ review }) => (
  <section aria-labelledby="review" className="mt-8 mb-6">
    {/* 65ch of the wrapper's 16px, not the 18px text, keeps lines near 70 */}
    <div className="max-w-prose">
      <h2 id="review" className="m-0 text-sm font-semibold">
        Í hnotskurn:
      </h2>
      {review.paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="mt-2 mb-0 text-base leading-normal text-pretty md:text-lg [&+&]:mt-3"
        >
          {paragraph}
        </p>
      ))}
    </div>
  </section>
)

export default Review
