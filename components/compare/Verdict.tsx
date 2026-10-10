'use client'

import { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import clsx from 'clsx'

import type { Car } from '@/modules/data/cars'
import { comparedName } from '@/modules/compare/comparison'
import {
  decodeEvents,
  type Verdict as VerdictData,
} from '@/modules/compare/verdictEvents'
import {
  lookupPhrase,
  phraseDuration,
  thinkingPhrases,
} from '@/modules/compare/thinkingPhrases'
import { CHAT_INPUT_ID } from '@/modules/chat/inputId'

const eyebrow =
  'm-0 uppercase text-eyebrow font-semibold tracking-wider text-stone'

const Card: FunctionComponent<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <section
    aria-labelledby="verdict"
    className="px-(--gutter) md:px-10 mt-5 mb-3"
  >
    <div className={clsx('p-4 rounded-card bg-cloud md:p-6', className)}>
      <h2 id="verdict" className={eyebrow}>
        Í stuttu máli
      </h2>
      {children}
    </div>
  </section>
)

/** The verdict's place while the page checks for one already written */
export const VerdictPlaceholder: FunctionComponent = () => (
  <Card>
    <div aria-hidden className="mt-3 flex flex-col gap-2 animate-pulse">
      <div className="h-3.5 w-full rounded-full bg-smoke" />
      <div className="h-3.5 w-4/5 rounded-full bg-smoke" />
      <div className="h-3.5 w-3/5 rounded-full bg-smoke" />
    </div>
  </Card>
)

const VerdictCard: FunctionComponent<{ verdict: VerdictData }> = ({
  verdict,
}) => (
  <Card className="animate-message-in">
    {verdict.paragraphs.map((paragraph) => (
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
  </Card>
)

interface Line {
  text: string
  /** The next of the made-up lines to show */
  phrase: number
  /** How many of the lookups have had their line */
  lookups: number
  /** Changes with every line, so each plays its entrance */
  key: number
}

const ThinkingLine: FunctionComponent<{
  names: ReadonlyArray<string>
  lookedUp: ReadonlyArray<string>
}> = ({ names, lookedUp }) => {
  const [{ phrases, loopFrom }] = useState(() => thinkingPhrases(names))
  const [line, setLine] = useState<Line>({
    text: phrases[0],
    phrase: 1,
    lookups: 0,
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

  // A car the model has started looking up goes before the next made-up line
  const next = ({ phrase, lookups, key }: Line): Line =>
    lookups < lookedUp.length
      ? {
          text: lookupPhrase(lookedUp[lookups]),
          phrase,
          lookups: lookups + 1,
          key: key + 1,
        }
      : {
          text: phrases[phrase],
          phrase: phrase + 1 < phrases.length ? phrase + 1 : loopFrom,
          lookups,
          key: key + 1,
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
        'font-semibold leading-snug',
        leaving ? 'animate-phrase-out' : 'animate-phrase-in',
      )}
    >
      {line.text}
    </span>
  )
}

const Working: FunctionComponent<{
  names: ReadonlyArray<string>
  lookedUp: ReadonlyArray<string>
}> = ({ names, lookedUp }) => (
  <Card>
    {/* Two lines tall whatever the line, so the card holds still as they turn */}
    <output className="mt-3 flex items-start gap-2 min-h-[2lh] text-sm leading-snug">
      <span
        aria-hidden
        className="w-2 h-2 mt-1.5 shrink-0 rounded-full bg-stone animate-pulse"
      />
      <span className="sr-only">Gervigreindin ber bílana saman</span>
      <ThinkingLine names={names} lookedUp={lookedUp} />
    </output>

    <p className="mt-3 mb-0 text-fine font-medium text-clay">
      Gervigreindin skrifar samantekt. Hún er skrifuð einu sinni og geymd, svo
      þetta tekur bara tíma í fyrsta sinn.
    </p>
  </Card>
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
 * be weighing, or the car it is reading up on, until the verdict arrives
 */
const Verdict: FunctionComponent<Props> = ({ cars, written, endpoint }) => {
  const [verdict, setVerdict] = useState(written)
  const [failed, setFailed] = useState(false)
  // The cars the model has started looking up, by the name the page uses
  const [lookedUp, setLookedUp] = useState<string[]>([])

  useEffect(() => {
    if (written) return
    const controller = new AbortController()

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
          if (event.type === 'lookup') {
            const car = cars.find(({ label }) => label === event.car)
            if (!car || event.done) continue
            const name = comparedName(car, cars)
            setLookedUp((before) =>
              before.includes(name) ? before : [...before, name],
            )
          } else if (event.type === 'verdict') {
            setVerdict(event.verdict)
            return
          } else {
            throw new Error('No verdict')
          }
        }
      }
      throw new Error('The verdict ended early')
    }

    read().catch(() => {
      if (!controller.signal.aborted) setFailed(true)
    })
    return () => controller.abort()
  }, [written, endpoint, cars])

  if (verdict) return <VerdictCard verdict={verdict} />
  if (failed) return null
  return (
    <Working
      names={cars.map((car) => comparedName(car, cars))}
      lookedUp={lookedUp}
    />
  )
}

export default Verdict
