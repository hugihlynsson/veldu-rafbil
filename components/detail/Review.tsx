import { FunctionComponent, ReactNode } from 'react'
import clsx from 'clsx'

import { CHAT_INPUT_ID } from '@/modules/chat/inputId'

/** Where the model's words about the cars go, under their figures */
export const ReviewSection: FunctionComponent<{
  children: ReactNode
  className?: string
  title?: string
}> = ({ children, className, title = 'Í stuttu máli:' }) => (
  <section
    aria-labelledby="review"
    className="px-(--gutter) md:px-10 mt-8 mb-6"
  >
    {/* 65ch of the wrapper's 16px, not the 18px text, keeps lines near 70 */}
    <div className={clsx('max-w-prose', className)}>
      <h2 id="review" className="m-0 text-sm font-semibold">
        {title}
      </h2>
      {children}
    </div>
  </section>
)

/** A car's review or a comparison's summary, with the way into the chat about it */
const Review: FunctionComponent<{
  paragraphs: ReadonlyArray<string>
  className?: string
}> = ({ paragraphs, className }) => (
  <ReviewSection className={className}>
    {paragraphs.map((paragraph) => (
      <p
        key={paragraph}
        className="mt-2 mb-0 text-base leading-normal md:text-lg [&+&]:mt-3"
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
  </ReviewSection>
)

export default Review
