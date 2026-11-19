'use client'

import type { FunctionComponent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

import TypingDots from '@/components/TypingDots'
import { readVerdict } from '@/modules/detail/readVerdict'
import {
  decodeEvents,
  type Verdict as VerdictData,
} from '@/modules/detail/verdictEvents'
import { track } from '@/utils/track'
import useWordReveal from '@/utils/useWordReveal'

/** Where the model's words about the cars go, as a car's page has its review */
const ReviewSection: FunctionComponent<{
  busy?: boolean
  children: ReactNode
}> = ({ busy, children }) => (
  <section aria-labelledby="review" aria-busy={busy} className="mt-8 mb-6">
    {/* 65ch of the wrapper's 16px, not the 18px text, keeps lines near 70 */}
    <div className="max-w-prose">
      <h2 id="review" className="m-0 text-sm font-semibold">
        Í hnotskurn:
      </h2>
      {children}
    </div>
  </section>
)

// Not text-pretty: Safari's weighs a whole paragraph, so each word added to
// one being written moves the line breaks above it
const paragraphStyle =
  'mt-2 mb-0 text-base leading-normal md:text-lg [&+&]:mt-3'

const Paragraphs: FunctionComponent<{
  paragraphs: ReadonlyArray<string>
  pretty?: boolean
}> = ({ paragraphs, pretty }) =>
  paragraphs.map((paragraph, index) => (
    <p key={index} className={clsx(paragraphStyle, pretty && 'text-pretty')}>
      {paragraph}
    </p>
  ))

// Room for a long verdict, the 95th percentile of the first ones Fable wrote:
// some 860 characters in three paragraphs. Set in filler like the words, it
// wraps as they will at any width.
const filler = 'Bíllinn fer lengra á hleðslunni og hleður hraðar á leiðinni. '
const room = [290, 290, 280].map((length) =>
  filler
    .repeat(Math.ceil(length / filler.length))
    .slice(0, length)
    .trim(),
)

/** A verdict's words, each in a span useWordReveal fades in on arrival */
const wordSpans = (paragraph: string, part: number) =>
  Array.from(paragraph.matchAll(/\s+|\S+/g), ({ 0: text, index }) =>
    /^\s/.test(text) ? (
      text
    ) : (
      <span key={index} data-word={`${part}:${index}`}>
        {text}
      </span>
    ),
  )

/**
 * The verdict while it is written: the dots until its first word, then the
 * words as they come. The room it holds until it is done keeps what is below
 * still.
 */
const Writing: FunctionComponent<{
  paragraphs: ReadonlyArray<string> | undefined
  done: boolean
  /** Once a model has taken over, the reader has waited already */
  restarted?: boolean
}> = ({ paragraphs, done, restarted }) => {
  const { ref, enabled } = useWordReveal<HTMLDivElement>(true)

  return (
    <div className="grid">
      {!done && (
        <div aria-hidden className="invisible col-start-1 row-start-1">
          <Paragraphs paragraphs={room} />
        </div>
      )}
      <div ref={ref} className="col-start-1 row-start-1">
        {paragraphs ? (
          paragraphs.map((paragraph, index) => (
            // By place, as the last one grows with every word while it is written
            <p key={index} className={paragraphStyle}>
              {enabled ? wordSpans(paragraph, index) : paragraph}
            </p>
          ))
        ) : (
          // Held back past the first word's usual arrival, some 1.5 to 2.5s
          // after the page asks, so most see the words come and never dots
          // that flash past; in CSS so it counts from their paint, not hydration
          <TypingDots
            label="Gervigreindin ber bílana saman"
            className={clsx('mt-2', !restarted && 'animate-late-in')}
          />
        )}
      </div>
    </div>
  )
}

/**
 * The verdict's place while the page checks for one already written, the same
 * as while one is written, so a wait for either looks the same
 */
export const VerdictPlaceholder: FunctionComponent = () => (
  <ReviewSection busy>
    <Writing paragraphs={undefined} done={false} />
  </ReviewSection>
)

interface Props {
  /** One already written, which needs no waiting for */
  written: VerdictData | null
  /** Where the verdict is written when there is none yet */
  endpoint: string
}

/**
 * The model's verdict, shown as the model writes it, or one already written
 * at once
 */
const Verdict: FunctionComponent<Props> = ({ written, endpoint }) => {
  const [verdict, setVerdict] = useState(written)
  const [text, setText] = useState('')
  // Counts the models that took over, each writing the verdict afresh
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (written) {
      track({ name: 'verdict_shown', written: true, waitMs: 0 })
      return
    }
    const controller = new AbortController()
    const startedAt = performance.now()
    const since = () => Math.round(performance.now() - startedAt)
    let firstTextMs: number | undefined

    const read = async () => {
      const response = await fetch(endpoint, { signal: controller.signal })
      if (!response.ok || !response.body) throw new Error(`${response.status}`)

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader()
      let buffered = ''
      let words = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const { events, rest } = decodeEvents(buffered + value)
        buffered = rest
        for (const event of events) {
          if (event.type === 'text') {
            firstTextMs ??= since()
            words += event.text
            setText(words)
          } else if (event.type === 'restart') {
            words = ''
            setText(words)
            setAttempt((count) => count + 1)
          } else if (event.type === 'verdict') {
            setVerdict(event.verdict)
            track({
              name: 'verdict_shown',
              written: false,
              waitMs: since(),
              firstTextMs,
            })
            return
          } else if (event.type === 'error') {
            throw new Error('No verdict')
          }
        }
      }
      throw new Error('The verdict ended early')
    }

    read().catch(() => {
      if (controller.signal.aborted) return
      setFailed(true)
      track({ name: 'verdict_failed', waitMs: since(), firstTextMs })
    })
    return () => controller.abort()
  }, [written, endpoint])

  if (failed) return null
  if (written && verdict === written)
    return (
      <ReviewSection>
        <Paragraphs paragraphs={written.paragraphs} pretty />
      </ReviewSection>
    )

  return (
    <ReviewSection busy={!verdict}>
      <Writing
        key={attempt}
        paragraphs={(verdict ?? readVerdict(text))?.paragraphs}
        done={Boolean(verdict)}
        restarted={attempt > 0}
      />
    </ReviewSection>
  )
}

export default Verdict
