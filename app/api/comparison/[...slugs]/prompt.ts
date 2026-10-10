import type { Car } from '@/modules/data/cars'
import type { Verdict } from '@/modules/compare/verdictEvents'
import { carSlug } from '@/modules/data/getCarId'
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
- Ekkert markdown, engin feitletrun, engir listar.

Svaraðu nákvæmlega svona, og engu öðru:
- Fyrst tvær til þrjár setningar um það sem helst skilur bílana að.
- Svo ein lína fyrir hvern bíl, í sömu röð og bílarnir eru taldir upp, sem byrjar á [car:<auðkenni>]. Á eftir auðkenninu kemur skilyrðið sem gerir þennan bíl að réttu valinu, sem byrjar á "Ef þú": hvað sá sem velur hann vill eða þarf. Vefurinn bætir sjálfur við ", veldu [bíllinn]." aftan við, svo ekki nefna bílinn og ekki segja "veldu". Ein setning, 12 til 30 orð, og gjarnan með því sem þú last um stærð hans og pláss.

Til dæmis:
Kia er rúmbetri og fer lengra, en Tesla er sneggri og ódýrari í rekstri.
[car:kia-ev3-long-range] Ef þú keyrir oft út á land og vilt 460 lítra skott fyrir fjölskylduna, án þess að borga mikið
[car:tesla-model-y-standard-range] Ef þú vilt snarpan og skemmtilegan bíl sem hleðst hratt á ferðalögum`

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

// Generous bounds that only stop a runaway; the prompt asks for far less
const MAX_SUMMARY_LENGTH = 800
const MAX_PICK_LENGTH = 800

const clean = (text: string, max: number) =>
  text
    // The prompt asks for plain text, and a model writes markdown anyway
    .replace(/\*\*|__|^[-*•]\s+/gm, '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, max)

const pickLine = /^\s*[-*•]?\s*\[car:\s*([^\]\s]+)\s*\]\s*(.*)$/

/**
 * The answer as the page shows it: the lines before the first car marker are
 * the summary, and each marked line is that car's pick. A marker naming a car
 * not compared is dropped, and so is a second one for the same car.
 */
export const readVerdict = (
  text: string,
  compared: ReadonlyArray<Car>,
): Verdict | null => {
  const slugs = new Set(compared.map(carSlug))
  const summary: string[] = []
  const picks: Verdict['picks'] = []

  for (const line of text.split('\n')) {
    const marked = line.match(pickLine)
    if (!marked) {
      if (picks.length === 0) summary.push(line)
      continue
    }
    const slug = marked[1].toLowerCase()
    // The page ends the sentence itself, with ", veldu X."
    const when = clean(marked[2], MAX_PICK_LENGTH).replace(/[.,;:\s]+$/, '')
    if (!slugs.has(slug) || !when || picks.some((pick) => pick.slug === slug))
      continue
    picks.push({ slug, when })
  }

  const joined = clean(summary.join(' '), MAX_SUMMARY_LENGTH)
  return joined || picks.length > 0 ? { summary: joined, picks } : null
}
