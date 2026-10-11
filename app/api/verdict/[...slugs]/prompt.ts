import type { Car } from '@/modules/data/cars'
import { carRef } from '@/modules/chat/cars'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { grantAmountText } from '@/modules/copy/grantCopy'
import { driveLabels } from '@/modules/data/drives'
import { realRangeHighFactor, realRangeLowFactor } from '@/modules/data/globals'
import type { Verdict } from '@/modules/detail/verdictEvents'

// The rules the car reviews in scripts/reviewPrompt.ts are written by, less
// what only a review of one car needs
const comparisonSystemPrompt = `Þú ert ráðgjafi Veldu Rafbíl, íslensks vefs sem ber saman alla 100% rafdrifna bíla sem eru seldir nýir á Íslandi. Einhver er að bera saman bílana hér að neðan og þú átt að hjálpa viðkomandi að velja á milli þeirra.

Áður en þú skrifar:
- Sæktu nánari upplýsingar um hvern bíl með fetchCarDetails, með auðkenninu sem fylgir honum hér að neðan, til að vita stærð hans, farangursrými og dráttargetu. Bíll sem hefur enga ev-database síðu hefur engar slíkar upplýsingar.

Þegar þú skrifar:
- Skrifaðu á eðlilegri, lipurri íslensku, í samtalstón, eins og fróður vinur en ekki sölumaður.
- Ekki endursegja tölurnar: þær eru í töflu beint fyrir neðan textann þinn. Segðu frekar hvað þær þýða í daglegu lífi.
- Reiknaðu aldrei sjálf(ur). Munurinn á tölunum er reiknaður fyrir þig: taktu hann orðréttan. Til að bera saman tölur úr fetchCarDetails, nefndu tölurnar sjálfar frekar en muninn á þeim.
- Verðin eru eftir ${grantAmountText} ríkisstyrk þar sem hann á við.
- Drægnin er samkvæmt WLTP. Í íslenskum vetri er hún nær ${Math.round(realRangeLowFactor * 100)}–${Math.round(realRangeHighFactor * 100)}% af því.
- Tölur taktu aðeins úr gögnunum hér að neðan og því sem fetchCarDetails skilar, aldrei úr minni. Notaðu óhikað almenna þekkingu á bílunum og framleiðendunum, til dæmis hvar merkið stendur í gæðum og verði eða hvernig bíllinn er í akstri.
- Skrifaðu tölur að íslenskum sið: komma í tugabrotum (7,7 s) og punktur í þúsundum (100.000 kr.).
- Nefndu hleðsluhraða aldrei í tölum, hvorki í km/mín, kW né mínútum: fáir tengja við þær. Segðu frekar hver hleður hraðar, eða hve miklu styttri eða lengri hleðslustoppin eru, eins og það er gefið.
- Gættu að beygingum og samræmi, og notaðu orð um bíla en ekki fólk.
- Skrifaðu eins og allir bílarnir séu fáanlegir núna: segðu ekkert um hvenær bíll kemur eða hvort hann er kominn.
- Ekkert markdown, engin feitletrun, engir listar, engar fyrirsagnir.

Svaraðu með hnitmiðuðum samanburði á bílunum, um 160 orðum í tveimur eða þremur stuttum efnisgreinum og engu öðru. Byrjaðu á því sem helst skilur þá að, segðu svo hverjum hver þeirra hentar og hvers vegna, gjarnan með því sem þú last um stærð þeirra og pláss. Nefndu bílana með tegund og gerð, til dæmis Kia EV3.`

interface Metric {
  label: string
  better: 'higher' | 'lower'
  value: (car: Car) => number
  /** The figure as the model is shown it, if it is to see it at all */
  shown?: (car: Car) => string
  /** How far a car is behind the best of them, or nothing if not at all */
  behind: (car: Car, best: Car) => string | undefined
}

// With a decimal comma, as the model would otherwise copy the point into
// Icelandic text
const oneDecimal = (value: number) =>
  String(Number(value.toFixed(1))).replace('.', ',')

const gap =
  (value: (car: Car) => number, said: (gap: number) => string) =>
  (car: Car, best: Car) => {
    const difference = Math.abs(value(car) - value(best))
    return difference === 0 ? undefined : said(difference)
  }

const metrics: Metric[] = [
  {
    label: 'Verð',
    better: 'lower',
    value: (car) => car.priceWithGrant,
    shown: (car) => `${addDecimalSeparators(car.priceWithGrant)} kr.`,
    // 160.000 kr., not the 160.010 kr. two list prices happen to differ by
    behind: gap(
      (car) => car.priceWithGrant,
      (gap) => `${addDecimalSeparators(Number(gap.toPrecision(2)))} kr. dýrari`,
    ),
  },
  {
    label: 'Drægni',
    better: 'higher',
    value: (car) => car.range,
    shown: (car) => `${car.range} km`,
    behind: gap(
      (car) => car.range,
      (gap) => `${gap} km minni drægni`,
    ),
  },
  {
    label: 'Verð á hvern km drægni',
    better: 'lower',
    value: (car) => Math.round(car.pricePerKm),
    shown: (car) => `${addDecimalSeparators(Math.round(car.pricePerKm))} kr.`,
    behind: gap(
      (car) => Math.round(car.pricePerKm),
      (gap) => `${addDecimalSeparators(gap)} kr. dýrari á hvern km drægni`,
    ),
  },
  // A charging speed in km/min means little to most buyers, so it is given as
  // how much longer a stop for the same range is, to the nearest 5%
  {
    label: 'Hraðhleðsla',
    better: 'higher',
    value: (car) => car.kmPerMinuteCharged,
    behind: (car, best) => {
      const stop = best.kmPerMinuteCharged / car.kmPerMinuteCharged
      const percent = Math.round((stop - 1) * 20) * 5
      return percent === 0
        ? 'álíka löng hleðslustopp'
        : `um ${percent}% lengri hleðslustopp`
    },
  },
  {
    label: 'Rafhlaða',
    better: 'higher',
    value: (car) => car.capacity,
    shown: (car) => `${oneDecimal(car.capacity)} kWh`,
    behind: gap(
      (car) => car.capacity,
      (gap) => `${oneDecimal(gap)} kWh minni`,
    ),
  },
  {
    label: 'Hröðun 0-100 km/klst',
    better: 'lower',
    value: (car) => car.acceleration,
    shown: (car) => `${oneDecimal(car.acceleration)} s`,
    behind: gap(
      (car) => car.acceleration,
      (gap) => `${oneDecimal(gap)} s hægari`,
    ),
  },
  {
    label: 'Afl',
    better: 'higher',
    value: (car) => car.power,
    shown: (car) => `${car.power} kW`,
    behind: gap(
      (car) => car.power,
      (gap) => `${gap} kW minna afl`,
    ),
  },
]

const describeCar = (car: Car): string =>
  [
    car.label,
    car.evDatabaseUrl ? `auðkenni: ${carRef(car)}` : 'engin ev-database síða',
    `${addDecimalSeparators(car.priceWithGrant)} kr.${car.hasGrant ? ' eftir styrk' : ', fær ekki styrk'}`,
    `${car.range} km drægni (WLTP)`,
    `${oneDecimal(car.capacity)} kWh rafhlaða`,
    `0-100 km/klst á ${oneDecimal(car.acceleration)} s`,
    `${car.power} kW`,
    driveLabels[car.drive].toLowerCase(),
    `allt að ${car.seats} sæti`,
  ].join(', ')

// The model is given every gap worked out, so a figure in its text is one it
// copied rather than one it subtracted
const describeMetric = (metric: Metric, compared: ReadonlyArray<Car>) => {
  const ranked = compared.toSorted((a, b) =>
    metric.better === 'lower'
      ? metric.value(a) - metric.value(b)
      : metric.value(b) - metric.value(a),
  )
  const [best] = ranked
  if (!best) return metric.label
  const entries = ranked.map((car) =>
    [
      car.label,
      metric.shown?.(car),
      `(${metric.behind(car, best) ?? 'fremstur'})`,
    ]
      .filter(Boolean)
      .join(' '),
  )
  return `${metric.label}: ${entries.join(', ')}`
}

/** What the model is told about the cars, everything it may say included */
export const verdictFacts = (compared: ReadonlyArray<Car>): string =>
  [
    'Bílarnir:',
    ...compared.map((car) => `- ${describeCar(car)}`),
    '',
    'Munurinn, sá besti fyrst:',
    ...metrics.map((metric) => `- ${describeMetric(metric, compared)}`),
  ].join('\n')

/**
 * Everything the model is given for a comparison. The verdict's cache keys on
 * it, so cars whose figures change are compared afresh.
 */
export const verdictPrompt = (
  cars: ReadonlyArray<Car>,
): { system: string; prompt: string } => ({
  system: comparisonSystemPrompt,
  prompt: verdictFacts(cars),
})

// Far past the some 160 words asked for, as a car's review is cut
const MAX_LENGTH = 3000

/** The answer as the page shows it, in paragraphs and without markdown */
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
