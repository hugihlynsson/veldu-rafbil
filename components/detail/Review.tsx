import { FunctionComponent } from 'react'

import type { CarReview } from '@/modules/data/carReviews'
import { CHAT_INPUT_ID } from '@/modules/chat/inputId'

/** The car's review, under its figures, with the way into the chat about it */
const Review: FunctionComponent<{ review: CarReview }> = ({ review }) => (
  <section
    aria-labelledby="review"
    className="px-(--gutter) md:px-10 mt-8 mb-6"
  >
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
      {/* A label, so it focuses the chat bar wherever it is loaded, and is
          plainly nothing until then */}
      <label
        htmlFor={CHAT_INPUT_ID}
        className="block w-fit ml-auto mt-3 text-sm font-semibold text-tint cursor-pointer hover:underline"
      >
        Spyrja nánar <span aria-hidden>→</span>
      </label>
    </div>
  </section>
)

export default Review
