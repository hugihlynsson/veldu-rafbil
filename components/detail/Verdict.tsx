'use client'

import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'

import type { Car } from '@/modules/data/cars'
import { carName } from '@/modules/data/getCarId'
import {
  decodeEvents,
  type Verdict as VerdictData,
} from '@/modules/detail/verdictEvents'
import {
  firstPhrase,
  phraseDuration,
  thinkingPhrases,
  type ThinkingPhrases,
} from '@/modules/detail/thinkingPhrases'
import { verdictProgress } from '@/modules/detail/verdictProgress'
import { track } from '@/utils/track'

/** Where the model's words about the cars go, as a car's page has its review */
const ReviewSection: FunctionComponent<{
  children: ReactNode
}> = ({ children }) => (
  <section aria-labelledby="review" className="mt-8 mb-6">
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

/** The verdict's place while the page checks for one already written */
export const VerdictPlaceholder: FunctionComponent = () => (
  <ReviewSection>
    <Skeleton />
  </ReviewSection>
)

interface Line {
  text: string
  /** The next of the made-up lines to show */
  phrase: number
  /** Changes with every line, so each plays its entrance */
  key: number
}

const ThinkingLine: FunctionComponent<{
  names: ReadonlyArray<string>
}> = ({ names }) => {
  // Drawn in the browser on the first turn, as a draw on the server would
  // not be the one it hydrates with
  const sequence = useRef<ThinkingPhrases | null>(null)
  const [line, setLine] = useState<Line>({
    text: firstPhrase,
    phrase: 0,
    key: 0,
  })
  const [leaving, setLeaving] = useState(false)

  // A line stays for its time, then plays its exit, and the next arrives once
  // that has finished
  useEffect(() => {
    if (leaving) return
    const timer = setTimeout(() => setLeaving(true), phraseDuration(line.text))
    return () => clearTimeout(timer)
  }, [line, leaving])

  const next = ({ phrase, key }: Line): Line => {
    sequence.current ??= thinkingPhrases(names)
    const { phrases, loopFrom } = sequence.current
    return {
      text: phrases[phrase] ?? firstPhrase,
      phrase: phrase + 1 < phrases.length ? phrase + 1 : loopFrom,
      key: key + 1,
    }
  }

  return (
    <span
      key={line.key}
      aria-hidden
      onAnimationEnd={() => {
        if (!leaving) return
        setLeaving(false)
        setLine(next(line))
      }}
      className={clsx(
        'min-w-0 truncate font-semibold leading-snug',
        leaving ? 'animate-phrase-out' : 'animate-phrase-in',
      )}
    >
      {line.text}
    </span>
  )
}

interface Progress {
  /** When the writing began, by performance.now(), if it has */
  writingAt?: number
  /** Whether the verdict is in, for the bar to fill before it shows */
  filled: boolean
}

// How often the bar moves on, as long as the transition between two places
const TICK_MS = 200
// Long enough to see the bar reach its end before the words take its place
const FILL_MS = 300

const ProgressBar: FunctionComponent<Progress> = ({ writingAt, filled }) => {
  // Empty on the server and as it hydrates, wherever the clocks stand
  const [startedAt] = useState(() => performance.now())
  const [now, setNow] = useState(startedAt)

  useEffect(() => {
    if (filled) return
    const timer = setInterval(() => setNow(performance.now()), TICK_MS)
    return () => clearInterval(timer)
  }, [filled])

  const progress = filled
    ? 1
    : verdictProgress(
        now - startedAt,
        writingAt === undefined ? undefined : writingAt - startedAt,
      )

  return (
    <div aria-hidden className="mt-2 h-1 rounded-full bg-cloud overflow-hidden">
      <div
        className="h-full rounded-full bg-stone transition-[width] ease-linear"
        style={{
          width: `${progress * 100}%`,
          transitionDuration: `${filled ? FILL_MS : TICK_MS}ms`,
        }}
      />
    </div>
  )
}

const Working: FunctionComponent<{
  names: ReadonlyArray<string>
  progress: Progress
}> = ({ names, progress }) => (
  // Headed as the verdict will be, so only what is under it changes when it
  // arrives, and the line below is the one that says it is being written
  <ReviewSection>
    {/* One line whatever the phrase, so the card holds still as they turn */}
    <output className="block mt-2 text-sm leading-snug">
      <span className="flex items-start gap-2">
        <span
          aria-hidden
          className="w-2 h-2 mt-1.5 shrink-0 rounded-full bg-stone animate-pulse"
        />
        <span className="sr-only">Gervigreindin ber bílana saman</span>
        <ThinkingLine names={names} />
      </span>
    </output>

    <ProgressBar {...progress} />

    <Skeleton />
  </ReviewSection>
)

interface Props {
  cars: ReadonlyArray<Car>
  /** One already written, which needs no waiting for */
  written: VerdictData | null
  /** Where the verdict is written when there is none yet */
  endpoint: string
}

/**
 * The model's verdict, or the model at work on it: a line about what it might
 * be weighing, and a bar for how far along it is, until the verdict arrives
 */
const Verdict: FunctionComponent<Props> = ({ cars, written, endpoint }) => {
  const [verdict, setVerdict] = useState(written)
  const [failed, setFailed] = useState(false)
  const [working, setWorking] = useState(false)
  const [progress, setProgress] = useState<Progress>({ filled: false })

  useEffect(() => {
    if (written) {
      track({ name: 'verdict_shown', written: true, waitMs: 0 })
      return
    }
    const controller = new AbortController()
    const startedAt = performance.now()
    const waitMs = () => Math.round(performance.now() - startedAt)

    const read = async () => {
      const response = await fetch(endpoint, { signal: controller.signal })
      if (!response.ok || !response.body) throw new Error(`${response.status}`)

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader()
      let buffered = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const { events, rest } = decodeEvents(buffered + value)
        buffered = rest
        for (const event of events) {
          if (event.type === 'working') {
            setWorking(true)
          } else if (event.type === 'writing') {
            const writingAt = performance.now()
            setProgress((before) => ({ ...before, writingAt }))
          } else if (event.type === 'verdict') {
            setProgress((before) => ({ ...before, filled: true }))
            await new Promise((resolve) => setTimeout(resolve, FILL_MS))
            setVerdict(event.verdict)
            track({ name: 'verdict_shown', written: false, waitMs: waitMs() })
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
      track({ name: 'verdict_failed', waitMs: waitMs() })
    })
    return () => controller.abort()
  }, [written, endpoint])

  if (verdict)
    return (
      <ReviewSection>
        {/* Only the words arrive; the heading was there all along */}
        <div className="animate-message-in">
          {verdict.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-2 mb-0 text-base leading-normal text-pretty md:text-lg [&+&]:mt-3"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </ReviewSection>
    )
  if (failed) return null
  // Until the endpoint says a model is at it, the verdict may be one already
  // written, which arrives too soon for the made-up lines to mean anything
  if (!working) return <VerdictPlaceholder />
  return (
    <Working
      names={cars.map((car) => carName(car, cars))}
      progress={progress}
    />
  )
}

export default Verdict
