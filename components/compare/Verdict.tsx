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
  phraseDuration,
  thinkingPhrases,
} from '@/modules/compare/thinkingPhrases'

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
    <p className="mt-4 mb-0 text-fine font-medium text-clay">
      Skrifað af gervigreind út frá tölunum hér fyrir neðan og ev-database.org
    </p>
  </Card>
)

interface Lookup {
  id: string
  car: string
  done: boolean
}

const ThinkingLine: FunctionComponent<{ names: ReadonlyArray<string> }> = ({
  names,
}) => {
  const [{ phrases, loopFrom }] = useState(() => thinkingPhrases(names))
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)

  // A line stays for its time, then plays its exit, and the next arrives once
  // that has finished
  useEffect(() => {
    if (leaving) return
    const timer = setTimeout(
      () => setLeaving(true),
      phraseDuration(phrases[index]),
    )
    return () => clearTimeout(timer)
  }, [index, leaving, phrases])

  return (
    <span
      key={index}
      aria-hidden
      onAnimationEnd={() => {
        if (!leaving) return
        setLeaving(false)
        setIndex(index + 1 < phrases.length ? index + 1 : loopFrom)
      }}
      className={clsx(
        'font-semibold leading-snug',
        leaving ? 'animate-phrase-out' : 'animate-phrase-in',
      )}
    >
      {phrases[index]}
    </span>
  )
}

const Working: FunctionComponent<{
  names: ReadonlyArray<string>
  lookups: ReadonlyArray<Lookup>
}> = ({ names, lookups }) => (
  <Card>
    {/* Two lines tall whatever the line, so the card holds still as they turn */}
    <output className="mt-3 flex items-start gap-2 min-h-[2lh] text-sm leading-snug">
      <span
        aria-hidden
        className="w-2 h-2 mt-1.5 shrink-0 rounded-full bg-stone animate-pulse"
      />
      <span className="sr-only">Gervigreindin ber bílana saman</span>
      <ThinkingLine names={names} />
    </output>

    {lookups.length > 0 && (
      <ul className="mt-3 mb-0 p-0 list-none flex flex-col gap-1 text-xs font-medium text-stone">
        {lookups.map((lookup) => (
          <li key={lookup.id} className="flex gap-1.5">
            <span aria-hidden className="w-3 shrink-0 text-center">
              {lookup.done ? '✓' : '…'}
            </span>
            <span>
              {lookup.done ? 'Las' : 'Les'} um stærð og pláss: {lookup.car}
            </span>
          </li>
        ))}
      </ul>
    )}

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
 * be weighing, and the cars it is reading up on, until the verdict arrives
 */
const Verdict: FunctionComponent<Props> = ({ cars, written, endpoint }) => {
  const [verdict, setVerdict] = useState(written)
  const [failed, setFailed] = useState(false)
  const [lookups, setLookups] = useState<Lookup[]>([])

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
            setLookups((before) =>
              before.some(({ id }) => id === event.id)
                ? before.map((lookup) =>
                    lookup.id === event.id
                      ? { ...lookup, done: event.done }
                      : lookup,
                  )
                : [...before, event],
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
  }, [written, endpoint])

  if (verdict) return <VerdictCard verdict={verdict} />
  if (failed) return null
  return (
    <Working
      names={cars.map((car) => comparedName(car, cars))}
      lookups={lookups}
    />
  )
}

export default Verdict
