'use client'

import type { FunctionComponent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { readVerdict } from '@/modules/detail/readVerdict'
import {
  decodeEvents,
  type Verdict as VerdictData,
} from '@/modules/detail/verdictEvents'
import { track } from '@/utils/track'

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

// Roughly the lines a verdict of about 120 words fills
const skeletonWidths = ['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-2/3']

/** The verdict's lines before it is written */
const Skeleton: FunctionComponent = () => (
  <div aria-hidden className="mt-4 flex flex-col gap-2.5 animate-pulse">
    {skeletonWidths.map((width, index) => (
      <div key={index} className={clsx('h-3.5 rounded-full bg-smoke', width)} />
    ))}
  </div>
)

const StatusLine: FunctionComponent<{ shown: boolean }> = ({ shown }) => (
  <output
    className={clsx('block mt-2 text-sm leading-snug', !shown && 'invisible')}
  >
    <span className="flex items-start gap-2">
      <span
        aria-hidden
        className="w-2 h-2 mt-1.5 shrink-0 rounded-full bg-stone animate-pulse"
      />
      <span className="sr-only">Gervigreindin ber bílana saman</span>
      <span aria-hidden className="min-w-0 truncate font-semibold leading-snug">
        Legg bílana hlið við hlið…
      </span>
    </span>
  </output>
)

/**
 * The verdict's place while the page checks for one already written, keeping
 * room for the line that shows if one is to be written, so its arrival moves
 * nothing below
 */
export const VerdictPlaceholder: FunctionComponent = () => (
  <ReviewSection>
    <StatusLine shown={false} />
    <Skeleton />
  </ReviewSection>
)

const Paragraphs: FunctionComponent<{ paragraphs: ReadonlyArray<string> }> = ({
  paragraphs,
}) =>
  paragraphs.map((paragraph, index) => (
    <p
      // By place, as the last one grows with every word while it is written
      key={index}
      className="mt-2 mb-0 text-base leading-normal text-pretty md:text-lg [&+&]:mt-3"
    >
      {paragraph}
    </p>
  ))

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
  const [failed, setFailed] = useState(false)
  const [working, setWorking] = useState(false)

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
          if (event.type === 'working') {
            setWorking(true)
          } else if (event.type === 'text') {
            firstTextMs ??= since()
            words += event.text
            setText(words)
          } else if (event.type === 'restart') {
            words = ''
            setText(words)
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
        <Paragraphs paragraphs={written.paragraphs} />
      </ReviewSection>
    )
  // Until the endpoint says a model is at it, the verdict may be one already
  // written, which arrives too soon for the line to mean anything
  if (!working && !verdict) return <VerdictPlaceholder />

  const shown = verdict ?? readVerdict(text)
  return (
    <ReviewSection busy={!verdict}>
      {/* The waiting lines stay, unseen, under the words as they arrive, so
          the room they held does not shrink to one line and grow back */}
      <div className="grid">
        <div
          aria-hidden={Boolean(shown)}
          className={clsx('col-start-1 row-start-1', shown && 'invisible')}
        >
          <StatusLine shown />
          <Skeleton />
        </div>
        {shown && (
          <div className="col-start-1 row-start-1 animate-message-in">
            <Paragraphs paragraphs={shown.paragraphs} />
          </div>
        )}
      </div>
    </ReviewSection>
  )
}

export default Verdict
