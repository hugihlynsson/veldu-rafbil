import { z } from 'zod'

import type { Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { grantAmountText } from '@/modules/copy/grantCopy'
import { driveLabels } from '@/modules/data/drives'
import { formatKmPerMinute } from '@/modules/data/getKmPerMinutesCharged'
import { realRangeHighFactor, realRangeLowFactor } from '@/modules/data/globals'

export const verdictSystemPrompt = `Þú ert ráðgjafi Veldu Rafbíl, íslensks vefs sem ber saman alla 100% rafdrifna bíla sem eru seldir nýir á Íslandi. Einhver er að bera saman bílana hér að neðan og þú átt að hjálpa viðkomandi að velja á milli þeirra.

- Skrifaðu á eðlilegri, lipurri íslensku, í samtalstón.
- Ekki endursegja tölurnar: þær eru í töflu beint fyrir neðan textann þinn. Segðu frekar hvað munurinn þýðir fyrir þann sem keyrir bílinn og hverjum hver bíll hentar.
- Reiknaðu aldrei sjálf(ur). Ef þú nefnir tölu eða mun, taktu hana orðrétt úr gögnunum.
- Verðin eru eftir ${grantAmountText} ríkisstyrk þar sem hann á við.
- Drægnin er samkvæmt WLTP. Í íslenskum vetri er hún nær ${Math.round(realRangeLowFactor * 100)}–${Math.round(realRangeHighFactor * 100)}% af því.
- Byggðu aðeins á gögnunum hér að neðan, ekki á því sem þú heldur að þú vitir um bílana.
- Ekkert markdown, engin feitletrun, engir listar.

Svaraðu með:
- summary: ein til tvær stuttar setningar um það sem helst skilur bílana að.
- picks: einn fyrir hvern bíl, í sömu röð og bílarnir. "car" er auðkenni bílsins og "when" er framhald setningarinnar "Veldu [bíllinn] ef …": byrjaðu á litlum staf, ekki endurtaka nafn bílsins, og hafðu það undir 25 orðum. Til dæmis: "þú keyrir oft út á land, því hann fer 120 km lengra á hleðslunni".`

interface Metric {
  label: string
  better: 'higher' | 'lower'
  value: (car: Car) => number
  format: (value: number) => string
  /** The gap behind the leader, as the trailing car is described by it */
  behind: (gap: string) => string
}

const oneDecimal = (value: number) => String(Number(value.toFixed(1)))

const metrics: Metric[] = [
  {
    label: 'Verð',
    better: 'lower',
    value: (car) => car.priceWithGrant,
    format: (value) => `${addDecimalSeparators(value)} kr.`,
    behind: (gap) => `${gap} dýrari`,
  },
  {
    label: 'Drægni',
    better: 'higher',
    value: (car) => car.range,
    format: (value) => `${value} km`,
    behind: (gap) => `${gap} minni drægni`,
  },
  {
    label: 'Verð á hvern km drægni',
    better: 'lower',
    value: (car) => Math.round(car.pricePerKm),
    format: (value) => `${addDecimalSeparators(value)} kr.`,
    behind: (gap) => `${gap} dýrari á km`,
  },
  {
    label: 'Hraðhleðsla, drægni bætt við á mínútu',
    better: 'higher',
    value: (car) => car.kmPerMinuteCharged,
    format: (value) => `${formatKmPerMinute(value)} km/mín`,
    behind: (gap) => `${gap} hægari`,
  },
  {
    label: 'Rafhlaða',
    better: 'higher',
    value: (car) => car.capacity,
    format: (value) => `${oneDecimal(value)} kWh`,
    behind: (gap) => `${gap} minni`,
  },
  {
    label: 'Hröðun 0-100 km/klst',
    better: 'lower',
    value: (car) => car.acceleration,
    format: (value) => `${oneDecimal(value)} s`,
    behind: (gap) => `${gap} hægari`,
  },
  {
    label: 'Afl',
    better: 'higher',
    value: (car) => car.power,
    format: (value) => `${value} kW`,
    behind: (gap) => `${gap} minna afl`,
  },
]

const describeCar = (car: Car): string =>
  [
    `${carSlug(car)}: ${car.label}`,
    `${addDecimalSeparators(car.priceWithGrant)} kr.${car.hasGrant ? ' eftir styrk' : ', fær ekki styrk'}`,
    `${car.range} km drægni (WLTP)`,
    `${car.capacity} kWh rafhlaða`,
    `hraðhleðsla 10-80% á ${car.timeToCharge10To80} mín`,
    `0-100 km/klst á ${car.acceleration} s`,
    `${car.power} kW`,
    driveLabels[car.drive].toLowerCase(),
    `allt að ${car.seats} sæti`,
    car.expectedDelivery
      ? `ekki kominn, væntanlegur ${car.expectedDelivery.toLowerCase()}`
      : 'fáanlegur núna',
  ].join(', ')

// The model is given every gap worked out, so a figure in its text is one it
// copied rather than one it subtracted
const describeMetric = (metric: Metric, compared: ReadonlyArray<Car>) => {
  const ranked = compared.toSorted((a, b) =>
    metric.better === 'lower'
      ? metric.value(a) - metric.value(b)
      : metric.value(b) - metric.value(a),
  )
  const leader = metric.value(ranked[0])

  const entries = ranked.map((car) => {
    const value = metric.value(car)
    const gap = Math.abs(value - leader)
    const standing =
      gap === 0
        ? 'fremstur'
        : metric.behind(metric.format(Number(gap.toPrecision(6))))
    return `${car.label} ${metric.format(value)} (${standing})`
  })

  return `${metric.label}: ${entries.join(', ')}`
}

/** What the model is told about the cars, everything it may say included */
export const verdictFacts = (compared: ReadonlyArray<Car>): string =>
  `Bílarnir:\n${compared.map((car) => `- ${describeCar(car)}`).join('\n')}\n\nMunurinn, sá besti fyrst:\n${metrics
    .map((metric) => `- ${describeMetric(metric, compared)}`)
    .join('\n')}`

// Generous bounds that only stop a runaway; the prompt asks for far less
const MAX_SUMMARY_LENGTH = 400
const MAX_WHEN_LENGTH = 240

/** The answer's shape, which can only name the cars compared */
export const verdictSchema = (compared: ReadonlyArray<Car>) => {
  const slugs = compared.map(carSlug)
  return z.object({
    summary: z.string(),
    picks: z.array(
      z.object({
        car: z.enum(slugs as [string, ...string[]]),
        when: z.string(),
      }),
    ),
  })
}

export interface Verdict {
  summary: string
  /** Each car once at most */
  picks: Array<{ slug: string; when: string }>
}

const clean = (text: string, max: number) =>
  text.trim().replace(/\s+/g, ' ').slice(0, max)

/** The answer as the page shows it */
export const readVerdict = (
  answer: z.infer<ReturnType<typeof verdictSchema>>,
  compared: ReadonlyArray<Car>,
): Verdict | null => {
  const summary = clean(answer.summary, MAX_SUMMARY_LENGTH)
  const picks = compared.flatMap((car) => {
    const pick = answer.picks.find(({ car: slug }) => slug === carSlug(car))
    // The page ends the sentence itself
    const when = pick && clean(pick.when, MAX_WHEN_LENGTH).replace(/\.$/, '')
    return when ? [{ slug: carSlug(car), when }] : []
  })

  return summary || picks.length > 0 ? { summary, picks } : null
}
