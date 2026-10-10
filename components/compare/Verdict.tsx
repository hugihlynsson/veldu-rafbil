'use client'

import { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import clsx from 'clsx'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { comparedName } from '@/modules/compare/comparison'
import {
  decodeEvents,
  type Verdict as VerdictData,
} from '@/modules/compare/verdictEvents'

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

const VerdictCard: FunctionComponent<{
  cars: ReadonlyArray<Car>
  verdict: VerdictData
}> = ({ cars, verdict }) => {
  // In the columns' order, which the cached verdict cannot know
  const picks = cars.flatMap((car) => {
    const pick = verdict.picks.find(({ slug }) => slug === carSlug(car))
    return pick ? [{ car, when: pick.when }] : []
  })

  return (
    <Card className="animate-message-in">
      {verdict.summary && (
        <p className="mt-2 mb-0 text-base leading-snug md:text-lg">
          {verdict.summary}
        </p>
      )}
      {picks.length > 0 && (
        <ul className="mt-4 mb-0 p-0 list-none flex flex-col gap-3">
          {picks.map(({ car, when }) => (
            <li key={car.id} className="text-sm leading-normal md:text-base">
              <span className="font-semibold">
                Veldu {comparedName(car, cars)}
              </span>{' '}
              ef {when}.
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 mb-0 text-fine font-medium text-clay">
        Skrifað af gervigreind út frá tölunum hér fyrir neðan og ev-database.org
      </p>
    </Card>
  )
}

interface Lookup {
  id: string
  car: string
  done: boolean
}

// Gemini's thoughts come as a bold heading over a paragraph; the heading is
// the step it is on, and the paragraph what it is thinking there
const latestHeading = (thinking: string): string | undefined =>
  [...thinking.matchAll(/\*\*(.+?)\*\*/g)].at(-1)?.[1]

const withoutHeadings = (thinking: string): string =>
  thinking
    .replace(/\*\*(.+?)\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const Working: FunctionComponent<{
  thinking: string
  lookups: ReadonlyArray<Lookup>
}> = ({ thinking, lookups }) => (
  <Card>
    <output className="mt-3 flex items-center gap-2 text-sm">
      <span
        aria-hidden
        className="w-2 h-2 shrink-0 rounded-full bg-stone animate-pulse"
      />
      <span className="font-semibold">
        {latestHeading(thinking) ?? 'Ber bílana saman…'}
      </span>
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

    {thinking && (
      // The newest of it at the foot, the start faded out over the top
      <div
        aria-hidden
        className="mt-3 max-h-24 overflow-hidden flex flex-col justify-end text-xs leading-relaxed text-clay [mask-image:linear-gradient(to_bottom,transparent,black_60%)]"
      >
        <p className="m-0">{withoutHeadings(thinking)}</p>
      </div>
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
 * The model's verdict, or the model at work on it: what it is thinking and
 * which cars it is reading up on, until the verdict arrives
 */
const Verdict: FunctionComponent<Props> = ({ cars, written, endpoint }) => {
  const [verdict, setVerdict] = useState(written)
  const [failed, setFailed] = useState(false)
  const [thinking, setThinking] = useState('')
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
          if (event.type === 'reasoning') {
            setThinking((before) => before + event.text)
          } else if (event.type === 'lookup') {
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

  if (verdict) return <VerdictCard cars={cars} verdict={verdict} />
  if (failed) return null
  return <Working thinking={thinking} lookups={lookups} />
}

export default Verdict
