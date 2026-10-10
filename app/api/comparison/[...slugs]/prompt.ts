import type { Car } from '@/modules/data/cars'
import type { Verdict } from '@/modules/compare/verdictEvents'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { grantAmountText } from '@/modules/copy/grantCopy'
import { driveLabels } from '@/modules/data/drives'
import { formatKmPerMinute } from '@/modules/data/getKmPerMinutesCharged'
import { realRangeHighFactor, realRangeLowFactor } from '@/modules/data/globals'

export const verdictSystemPrompt = `Þú ert ráðgjafi Veldu Rafbíl, íslensks vefs sem ber saman alla 100% rafdrifna bíla sem eru seldir nýir á Íslandi. Einhver er að bera saman bílana hér að neðan og þú átt að hjálpa viðkomandi að velja á milli þeirra.

Áður en þú skrifar:
- Sæktu nánari upplýsingar um hvern bíl með fetchCarDetails, með ev-database slóðinni sem fylgir honum hér að neðan, til að vita stærð hans, farangursrými og dráttargetu. Bíll sem hefur enga slóð hefur engar slíkar upplýsingar.
- Hugsaðu á íslensku.

Þegar þú skrifar:
- Skrifaðu á eðlilegri, lipurri íslensku, í samtalstón.
- Ekki endursegja tölurnar: þær eru í töflu beint fyrir neðan textann þinn. Segðu frekar hvað munurinn þýðir í daglegu lífi og hverjum hver bíll hentar: fjölskyldu, langferðum, innanbæjarakstri, vetri, kerru eða hjólhýsi.
- Reiknaðu aldrei sjálf(ur). Munurinn á tölunum hér að neðan er reiknaður fyrir þig: taktu hann orðrétt. Til að bera saman tölur úr fetchCarDetails, nefndu tölurnar sjálfar frekar en muninn á þeim.
- Verðin eru eftir ${grantAmountText} ríkisstyrk þar sem hann á við.
- Drægnin er samkvæmt WLTP. Í íslenskum vetri er hún nær ${Math.round(realRangeLowFactor * 100)}–${Math.round(realRangeHighFactor * 100)}% af því.
- Byggðu aðeins á gögnunum hér að neðan og því sem fetchCarDetails skilar, ekki á því sem þú heldur að þú vitir um bílana.
- Ekkert markdown, engin feitletrun, engir listar, engar fyrirsagnir.

Svaraðu með hnitmiðuðum samanburði á bílunum, um 160 orðum í tveimur eða þremur stuttum efnisgreinum og engu öðru. Byrjaðu á því sem helst skilur þá að, segðu svo hverjum hver þeirra hentar og hvers vegna, gjarnan með því sem þú last um stærð þeirra og pláss. Nefndu bílana með tegund og gerð, til dæmis Kia EV3.`

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
    car.label,
    car.evDatabaseUrl
      ? `ev-database: ${car.evDatabaseUrl}`
      : 'engin ev-database slóð',
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

// A bound that only stops a runaway; the prompt asks for a fraction of it
const MAX_LENGTH = 3000

/**
 * The answer as the page shows it: its paragraphs, with the markdown the
 * prompt asks it not to write taken out anyway
 */
export const readVerdict = (text: string): Verdict | null => {
  const paragraphs = text
    .slice(0, MAX_LENGTH)
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .replace(/\*\*|__|^#+\s*|^[-*•]\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean)

  return paragraphs.length > 0 ? { paragraphs } : null
}
